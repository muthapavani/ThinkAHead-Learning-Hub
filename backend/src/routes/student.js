const express=require('express');
const fs=require('fs');
const path=require('path');
const multer=require('multer');
const crypto=require('crypto');
const RAZORPAY_KEY_ID=process.env.RAZORPAY_KEY_ID||'';
const RAZORPAY_KEY_SECRET=process.env.RAZORPAY_KEY_SECRET||'';
const PAYMENT_AMOUNT=Number(process.env.PAYMENT_AMOUNT||100000);
const PAYMENT_CURRENCY=process.env.RAZORPAY_CURRENCY||'INR';
const today=()=>new Date().toISOString().slice(0,10);
const User=require('../models/User');
const Course=require('../models/Course');
const MasterQuiz=require('../models/MasterQuiz');
const Progress=require('../models/Progress');
const Certificate=require('../models/Certificate');
const LiveSession=require('../models/LiveSession');
const ForumPost=require('../models/ForumPost');
const ChatThread=require('../models/ChatThread');
const Notification=require('../models/Notification');
const Achievement=require('../models/Achievement');
const Payment=require('../models/Payment');
const {requireAuth,requireVerifiedEmail}=require('../middleware/auth');
const { sendCourseCompletionEmail, sendAdminNotification, sendCourseStartedEmail, sendSubscriptionSuccessEmail, sendSubscriptionFailedEmail, sendCertificateAvailableEmail } = require('../utils/email');

const router=express.Router();
const uploadDir=path.join(__dirname,'../../uploads');
fs.mkdirSync(uploadDir,{recursive:true});
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:2*1024*1024},fileFilter:(req,file,cb)=>cb(null,/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype))});
router.use(requireAuth,requireVerifiedEmail);

const avatarFor=u=>u.profilePhoto?.length ? `data:${u.profilePhotoMimeType||'image/jpeg'};base64,${Buffer.from(u.profilePhoto).toString('base64')}` : '';
const toUser=u=>({id:u._id.toString(),name:u.name,email:u.email,phone:u.phone||'',role:u.role,avatar:avatarFor(u),bio:u.bio||'',enrolledCourseIds:u.enrolledCourseIds||[],completedCourseIds:u.completedCourseIds||[],subscription:u.subscription,streakDays:u.streakDays||0,totalHours:u.totalHours||0,points:u.points||0,unlockedBadgeIds:u.unlockedBadgeIds||[],emailVerified:!!u.emailVerified,emailNotifications:u.emailNotifications!==false});

// Creates an in-app notification (shown on the student Notifications page) to mirror an email event.
async function notifyUser(userId,{category,title,message,actionUrl,source='system'}){
  try{ await Notification.create({userId,category,title,message,time:'Just now',read:false,actionUrl,source}); }
  catch(e){ console.error('[notify] failed to create notification:',e.message); }
}

const subscriptionUnlockedMonths=(user)=>{
  const sub=user?.subscription;
  if(!sub?.active)return 0;
  const now=new Date();
  if(sub.expiresDate && new Date(`${sub.expiresDate}T23:59:59`) < now)return 0;
  if(!sub.startDate)return Math.min(12,Math.max(1,Number(sub.unlockedMonths||1)));
  const start=new Date(`${sub.startDate}T00:00:00`);
  if(Number.isNaN(start.getTime()))return Math.min(12,Math.max(1,Number(sub.unlockedMonths||1)));
  const elapsed=Math.max(0,(now.getFullYear()-start.getFullYear())*12+(now.getMonth()-start.getMonth())-(now.getDate()<start.getDate()?1:0));
  // The calendar month is the source of truth. A stale unlockedMonths value
  // must never unlock future courses before their scheduled month.
  return Math.min(12,Math.max(1,elapsed+1,Number(sub.unlockedMonths||1)));
};
const courseIsAccessible=(course,user)=>{
  if(!course)return false;
  // Any course explicitly marked as free is accessible without membership.
  if(course.isFree === true)return true;
  // Membership releases exactly the courses assigned to the current month.
  return subscriptionUnlockedMonths(user)>0 && Number(course.monthUnlock||99) <= subscriptionUnlockedMonths(user);
};

async function requireCourseAccess(req,res,next){
  try {
    const course=await Course.findOne({id:req.params.courseId});
    if(!course)return res.status(404).json({success:false,message:'Course not found.'});
    if(!courseIsAccessible(course,req.user))return res.status(403).json({success:false,message:`This course is locked. Subscribe to unlock 2 new courses for this month.`});
    req.course=course;
    next();
  } catch(e){next(e)}
}

async function bootstrap(req,res,next){try{
  const [user,progress,certificates,liveSessions,communityPosts,chatThreads,notifications,achievements,payments,courses]=await Promise.all([
    User.findById(req.user._id),Progress.find({userId:req.user._id}).lean(),Certificate.find({userId:req.user._id}).lean(),
    LiveSession.find().lean(),ForumPost.find().sort({createdAt:-1}).lean(),ChatThread.find({$or:[{participantUserId:req.user._id},{participantUserId:null}]}).lean(),
    Notification.find({$or:[{userId:req.user._id},{userId:null}]}).sort({createdAt:-1}).lean(),Achievement.find().lean(),Payment.find({userId:req.user._id}).sort({createdAt:-1}).lean(),Course.find().lean()
  ]);
  const freeCourseIds=courses
    .slice()
    .sort((a,b)=>Number(a.courseNumber||999)-Number(b.courseNumber||999))
    .slice(0,2)
    .map(c=>c.id);
  const missingFree=freeCourseIds.filter(id=>!(user.enrolledCourseIds||[]).includes(id));
  if(missingFree.length){ user.enrolledCourseIds=[...(user.enrolledCourseIds||[]),...missingFree]; await user.save(); }
  const totalCourses=courses.length;
  const unlockedBadgeIds=new Set((user.unlockedBadgeIds||[]).map(String));
  const learnerAchievements=achievements.map(a=>({...a,unlocked:unlockedBadgeIds.has(String(a.id)),unlockedAt:unlockedBadgeIds.has(String(a.id))?a.unlockedAt:undefined}));
  const catalogIds=new Set(courses.map(c=>c.id));
  const eligible=totalCourses>0 && progress.filter(p=>p.isCompleted && p.percent===100 && p.quizResult?.passed && catalogIds.has(p.courseId)).length===totalCourses;
  // The program has exactly ONE certificate. Remove any legacy per-course certificates.
  await Certificate.deleteMany({userId:req.user._id,courseId:{$ne:'all-22-capabilities-master'}});
  if(!eligible) await Certificate.deleteMany({userId:req.user._id,courseId:'all-22-capabilities-master'});
  const safeCertificates=eligible?certificates.filter(c=>c.courseId==='all-22-capabilities-master'):[];
  const normalizedPosts=communityPosts.map(p=>({...p,id:p.id,likedByMe:(p.likedByUserIds||[]).some(x=>x.toString()===req.user._id.toString())}));
  const normalizedThreads=chatThreads.map(t=>({...t, messages:(t.messages||[]).map(m=>({...m,isSender:m.senderId===req.user._id.toString()}))}));
  res.json({success:true,data:{user:toUser(user),courses,progress,certificates:safeCertificates,liveSessions,communityPosts:normalizedPosts,chatThreads:normalizedThreads,notifications,achievements:learnerAchievements,payments}});
}catch(e){next(e)}}
router.get('/bootstrap',bootstrap);
router.get('/me',async(req,res)=>res.json({success:true,user:toUser(req.user)}));

router.post('/enroll/:courseId',async(req,res,next)=>{try{
 const course=await Course.findOne({id:req.params.courseId}); if(!course)return res.status(404).json({success:false,message:'Course not found.'});
 const u=await User.findById(req.user._id);
 const unlocked=courseIsAccessible(course,u);
 if(!unlocked)return res.status(402).json({success:false,message:'This course is locked. Activate the annual membership to unlock it.'});
 const alreadyEnrolled=u.enrolledCourseIds.includes(course.id);
 if(!alreadyEnrolled) {u.enrolledCourseIds.push(course.id);await u.save();void sendCourseStartedEmail(u,course);void notifyUser(u._id,{category:'Course Updates',title:'Course started',message:`You've enrolled in ${course.title}.`,actionUrl:`/student/course/${course.id}`,source:'course_started'});}
 res.json({success:true,user:toUser(u)});
}catch(e){next(e)}});

router.post('/progress/:courseId/lesson/:lessonId/complete',requireCourseAccess,async(req,res,next)=>{try{
 const course=req.course;
 let p=await Progress.findOne({userId:req.user._id,courseId:course.id});
 if(!p)p=new Progress({userId:req.user._id,courseId:course.id});
 p.completedLessonIds=Array.from(new Set([...(p.completedLessonIds||[]),req.params.lessonId]));
 const lesson=course.modules.flatMap(m=>m.lessons||[]).find(l=>l.id===req.params.lessonId);
 if(lesson?.durationSeconds){
   const u=await User.findById(req.user._id);
   u.totalHours=Math.round(((u.totalHours||0)+(Number(lesson.durationSeconds)/3600))*100)/100;
   await u.save();
 }
 p.currentLessonId=req.params.lessonId;
 const total=course.modules.reduce((n,m)=>n+(m.lessons||[]).length,0); p.percent=Math.min(100,Math.round(p.completedLessonIds.length/Math.max(1,total)*100));
 await p.save();res.json({success:true,progress:p});
}catch(e){next(e)}});

router.patch('/progress/:courseId/note/:lessonId',requireCourseAccess,async(req,res,next)=>{try{
 if(typeof req.body.note!=='string')return res.status(400).json({success:false,message:'note must be a string.'});
 let p=await Progress.findOne({userId:req.user._id,courseId:req.params.courseId});if(!p)p=new Progress({userId:req.user._id,courseId:req.params.courseId});
 p.notes.set(req.params.lessonId,req.body.note);await p.save();res.json({success:true,progress:p});
}catch(e){next(e)}});

router.post('/progress/:courseId/assignments/:assignmentId',requireCourseAccess,async(req,res,next)=>{try{
 if(!req.body.text && !req.body.fileName)return res.status(400).json({success:false,message:'Assignment text or file is required.'});
 let p=await Progress.findOne({userId:req.user._id,courseId:req.params.courseId});if(!p)p=new Progress({userId:req.user._id,courseId:req.params.courseId});
 p.assignmentSubmissions.set(req.params.assignmentId,{submittedAt:new Date().toISOString(),textResponse:req.body.text||'',fileName:req.body.fileName||'',fileContent:req.body.fileContent||'',status:'submitted'});
 await p.save();res.json({success:true,progress:p});
}catch(e){next(e)}});

// ---- Programme-wide final assessment -------------------------------------

// How many courses are left, how many attempts remain, and the questions
// themselves once the learner has earned the right to see them.
async function assessmentState(user){
  const [quiz,courses,progress]=await Promise.all([
    MasterQuiz.load(),
    Course.find().select('id title').lean(),
    Progress.find({userId:user._id}).lean()
  ]);
  const catalogIds=new Set(courses.map(c=>c.id));
  const done=progress.filter(p=>catalogIds.has(p.courseId)&&p.isCompleted&&p.percent===100&&p.quizResult?.passed);
  const mine=user.masterAssessment||{};
  const attemptsUsed=Number(mine.attempts||0);
  return {
    quiz,
    available:quiz.published&&quiz.questions.length>0,
    totalCourses:courses.length,
    completedCourses:done.length,
    coursesRemaining:Math.max(0,courses.length-done.length),
    unlocked:courses.length>0&&done.length===courses.length,
    attemptsUsed,
    attemptsLeft:Math.max(0,Number(quiz.maxAttempts||3)-attemptsUsed),
    completed:mine.completed===true,
    bestPercentage:Number(mine.bestPercentage||0),
    lastPercentage:Number(mine.lastPercentage||0)
  };
}

router.get('/final-assessment',async(req,res,next)=>{try{
  const st=await assessmentState(req.user);
  // Questions are withheld until it is actually unlocked, and the correct
  // answers are never sent to the browser.
  const questions=(st.unlocked&&st.available&&st.attemptsLeft>0)
    ? st.quiz.questions.map(q=>({id:q.id,question:q.question,options:q.options}))
    : [];
  res.json({success:true,assessment:{
    title:st.quiz.title,description:st.quiz.description,
    durationMinutes:st.quiz.durationMinutes,passingScorePercentage:st.quiz.passingScorePercentage,
    maxAttempts:st.quiz.maxAttempts,questionCount:st.quiz.questions.length,
    available:st.available,unlocked:st.unlocked,
    totalCourses:st.totalCourses,completedCourses:st.completedCourses,coursesRemaining:st.coursesRemaining,
    attemptsUsed:st.attemptsUsed,attemptsLeft:st.attemptsLeft,
    completed:st.completed,bestPercentage:st.bestPercentage,lastPercentage:st.lastPercentage,
    questions
  }});
}catch(e){next(e)}});

router.post('/final-assessment',async(req,res,next)=>{try{
  const st=await assessmentState(req.user);
  if(!st.available) return res.status(400).json({success:false,message:'The final assessment has not been published yet.'});
  if(!st.unlocked) return res.status(403).json({success:false,code:'COURSES_PENDING',message:`Complete all ${st.totalCourses} courses first. ${st.coursesRemaining} still pending.`});
  if(st.attemptsLeft<=0) return res.status(403).json({success:false,code:'NO_ATTEMPTS_LEFT',message:`You have used all ${st.quiz.maxAttempts} attempts. Your recorded score is ${st.bestPercentage}%.`});

  const answers=req.body.answers||{};
  let correct=0;
  for(const q of st.quiz.questions){ if(Number(answers[q.id])===Number(q.correctAnswer)) correct++; }
  const total=st.quiz.questions.length;
  const percentage=total?Math.round(correct/total*100):0;

  const u=await User.findById(req.user._id);
  const prev=u.masterAssessment||{};
  u.masterAssessment={
    attempts:Number(prev.attempts||0)+1,
    bestPercentage:Math.max(Number(prev.bestPercentage||0),percentage),
    lastPercentage:percentage,
    // Finishing the assessment is enough; the score is recorded, not judged.
    completed:true,
    lastAttemptAt:new Date()
  };
  await u.save();

  const attemptsLeft=Math.max(0,Number(st.quiz.maxAttempts||3)-u.masterAssessment.attempts);
  if(!prev.completed){
    void notifyUser(u._id,{category:'Certificates',title:'Final assessment completed',message:`You scored ${percentage}%. Your certificate is being generated.`,actionUrl:'/student/certificates',source:'final_assessment'});
    void sendAdminNotification('Final assessment completed', `<p><strong>${u.name}</strong> completed the final assessment with ${percentage}%.</p>`, `${u.name} completed the final assessment with ${percentage}%.`);
  }
  res.json({success:true,result:{score:correct,total,percentage},attemptsLeft,attemptsUsed:u.masterAssessment.attempts,bestPercentage:u.masterAssessment.bestPercentage});
}catch(e){next(e)}});

router.post('/progress/:courseId/quiz',requireCourseAccess,async(req,res,next)=>{try{
 const course=req.course;
 const phase=req.body.phase==='starting'?'starting':'final';
 // Each phase has its own question set. The starting quiz falls back to the
 // final one only if no separate starting quiz was configured.
 const quiz=phase==='starting' ? (course.startingQuiz?.questions?.length ? course.startingQuiz : course.quiz) : course.quiz;
 if(!quiz?.questions?.length) return res.status(400).json({success:false,message:'No questions have been added for this quiz yet.'});

 let p=await Progress.findOne({userId:req.user._id,courseId:course.id});if(!p)p=new Progress({userId:req.user._id,courseId:course.id});

 if(phase==='final'){
   // The final quiz only opens once every lesson has been watched.
   const lessonIds=(course.modules||[]).flatMap(m=>(m.lessons||[]).map(l=>l.id));
   const done=new Set(p.completedLessonIds||[]);
   const pending=lessonIds.filter(id=>!done.has(id));
   if(lessonIds.length && pending.length) return res.status(403).json({success:false,code:'LESSONS_PENDING',pending:pending.length,message:`Complete all ${lessonIds.length} lessons before taking the final quiz. ${pending.length} still pending.`});
 }

 const answers=req.body.answers||{};let correct=0;for(const q of quiz.questions){if(Number(answers[q.id])===Number(q.correctAnswer))correct++}
 const passMark=Number(quiz.passingScorePercentage||70);
 const total=quiz.questions.length,percentage=total?Math.round(correct/total*100):0,passed=percentage>=passMark;
 const result={score:correct,total,percentage,passed,takenAt:new Date().toISOString()};

 if(phase==='starting'){
   p.startingQuizResult=result;
   await p.save();
   return res.json({success:true,result,progress:p,user:undefined,certificate:null});
 }

 p.quizResult=result;
 if(passed){p.percent=100;p.isCompleted=true;p.completedDate=today();p.certificateEarned=true;}
 await p.save();
 let certificate=null;
 if(passed){
   const u=await User.findById(req.user._id);
   const wasCompleted=u.completedCourseIds.includes(course.id);
   if(!wasCompleted){
     u.completedCourseIds.push(course.id);
     void sendCourseCompletionEmail(u,course);
     void notifyUser(u._id,{category:'Course Updates',title:'Course completed',message:`Congratulations! You completed ${course.title}.`,actionUrl:`/student/course/${course.id}`,source:'course_completed'});
     void sendAdminNotification('Course completed', `<p><strong>${u.name}</strong> completed <strong>${course.title}</strong>.</p>`, `${u.name} (${u.email}) completed ${course.title}.`);
   }
   u.points=(u.points||0)+100;await u.save();
   // Issue one combined certificate only after every catalog course has been completed
   // and every final quiz has been passed.
   const [allCourses, allProgress] = await Promise.all([
     Course.find().select('id title').lean(),
     Progress.find({userId:u._id}).lean()
   ]);
   const catalogIds=new Set(allCourses.map(c=>c.id));
   const completedFinals=allProgress.filter(x=>catalogIds.has(x.courseId) && x.isCompleted && x.percent===100 && x.quizResult?.passed);
   // Every course finished is only half the gate. The certificate is issued
   // once the programme-wide final assessment has also been completed.
   const masterQuiz=await MasterQuiz.load();
   const assessmentRequired=masterQuiz.published && masterQuiz.questions.length>0;
   const assessmentDone=!assessmentRequired || u.masterAssessment?.completed===true;
   if(allCourses.length>0 && completedFinals.length===allCourses.length && assessmentDone){
     const scoreRows=allCourses.map(c=>{
       const row=completedFinals.find(x=>x.courseId===c.id);
       return row?.quizResult ? {courseId:c.id,courseTitle:c.title,score:Number(row.quizResult.score||0),total:Number(row.quizResult.total||0),percentage:Number(row.quizResult.percentage||0)} : null;
     }).filter(Boolean);
     const overallAssessmentScore=scoreRows.length ? Math.round(scoreRows.reduce((sum,row)=>sum+row.percentage,0)/scoreRows.length) : 0;
     const certificateNumber=`IHCDR-MASTER-2026-HC22-${u._id.toString().slice(-6).toUpperCase()}`;
     const certData={studentName:u.name,studentEmail:u.email,courseName:`ThinkAHead Complete Learning Certificate — ${allCourses.length} Courses`,issueDate:today(),qrCodeUrl:`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://ihcdr.org/verify/${certificateNumber}`,directorName:'Prof. Dr. A. K. Sharma',founderName:'G. Satyanarayana',verified:true,overallAssessmentScore,finalAssessmentScore:Number(u.masterAssessment?.bestPercentage||0),finalAssessmentDate:u.masterAssessment?.lastAttemptAt?new Date(u.masterAssessment.lastAttemptAt).toISOString().slice(0,10):today(),assessmentScores:scoreRows};
     const certificateExisted=await Certificate.findOne({userId:u._id,courseId:'all-22-capabilities-master'});
     certificate=certificateExisted;
     if(!certificate) certificate=await Certificate.create({id:`master-${u._id}`,certificateNumber,userId:u._id,courseId:'all-22-capabilities-master',...certData});
     else {Object.assign(certificate,{certificateNumber,...certData});await certificate.save();}
     await Certificate.deleteMany({userId:u._id,courseId:{$ne:'all-22-capabilities-master'}});
     p.certificateId=certificate.id;await p.save();
     if(!certificateExisted){void sendCertificateAvailableEmail(u,certificate);void notifyUser(u._id,{category:'Certificates',title:'Certificate available',message:'Your Master Certificate has been generated and is ready to view.',actionUrl:'/student/certificates',source:'certificate_available'});void sendAdminNotification('Certificate issued', `<p><strong>${u.name}</strong> (${u.email}) earned the Master Certificate.</p>`, `${u.name} (${u.email}) earned the Master Certificate.`);}
   }
 }
 res.json({success:true,result,progress:p,user:passed?await User.findById(req.user._id):undefined,certificate});
}catch(e){next(e)}});


router.post('/progress/:courseId/complete',requireCourseAccess,async(req,res,next)=>{try{
 const course=req.course;
 let p=await Progress.findOne({userId:req.user._id,courseId:course.id});if(!p)p=new Progress({userId:req.user._id,courseId:course.id});
 const all=course.modules.flatMap(m=>(m.lessons||[]).map(l=>l.id));
 const completed=new Set(p.completedLessonIds||[]);
 if(all.some(id=>!completed.has(id))) return res.status(400).json({success:false,message:'Complete every lesson in this course before marking it complete.',requiredPercent:100,currentPercent:p.percent||0});
 p.completedLessonIds=all;p.percent=100;p.isCompleted=true;p.completedDate=today();p.certificateEarned=false;await p.save();
 const u=await User.findById(req.user._id);
 const wasCompleted=u.completedCourseIds.includes(course.id);
 if(!wasCompleted){u.completedCourseIds.push(course.id);void sendCourseCompletionEmail(u,course);void notifyUser(u._id,{category:'Course Updates',title:'Course completed',message:`Congratulations! You completed ${course.title}.`,actionUrl:`/student/course/${course.id}`,source:'course_completed'});void sendAdminNotification('Course completed', `<p><strong>${u.name}</strong> completed <strong>${course.title}</strong>.</p>`, `${u.name} (${u.email}) completed ${course.title}.`);}
 await u.save();
 res.json({success:true,progress:p,user:toUser(u)});
}catch(e){next(e)}});

router.get('/certificates',async(req,res,next)=>{try{res.json({success:true,certificates:await Certificate.find({userId:req.user._id,courseId:'all-22-capabilities-master'}).lean()})}catch(e){next(e)}});
router.get('/certificates/master',async(req,res,next)=>{try{
 const [u,courses,progresses]=await Promise.all([User.findById(req.user._id),Course.find().select('id').lean(),Progress.find({userId:req.user._id}).lean()]);
 const totalCourses=courses.length;
 const catalogIds=new Set(courses.map(c=>c.id));
 const validProgress=progresses.filter(p=>catalogIds.has(p.courseId));
 const completedCourses=validProgress.filter(p=>p.isCompleted && p.percent===100 && p.quizResult?.passed).length;
 const eligible=totalCourses>0 && completedCourses===totalCourses;
 if(!eligible) return res.status(403).json({success:false,message:`Certificate locked. Complete all ${totalCourses} courses and pass every final test before accessing the certificate.`,completedCourses,totalCourses,eligible:false});
 const scoreRows=validProgress.map(p=>{
   const course=courses.find(c=>c.id===p.courseId);
   return course && p.quizResult ? {courseId:p.courseId,courseTitle:course.title,score:Number(p.quizResult.score||0),total:Number(p.quizResult.total||0),percentage:Number(p.quizResult.percentage||0)} : null;
 }).filter(Boolean);
 const overallAssessmentScore=scoreRows.length ? Math.round(scoreRows.reduce((sum,row)=>sum+row.percentage,0)/scoreRows.length) : 0;
 const number='IHCDR-MASTER-2026-HC22-'+u._id.toString().slice(-6).toUpperCase();
 let cert=await Certificate.findOne({userId:u._id,courseId:'all-22-capabilities-master'});
 const certData={studentName:u.name,studentEmail:u.email,courseName:'IHCDR Master Diploma in Human Capability Development (22 Core Capabilities)',overallAssessmentScore,assessmentScores:scoreRows};
 if(!cert){cert=await Certificate.create({id:'master-'+u._id,certificateNumber:number,userId:u._id,courseId:'all-22-capabilities-master',issueDate:today(),qrCodeUrl:`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://ihcdr.org/verify/${number}`,directorName:'Prof. Dr. A. K. Sharma',founderName:'G. Satyanarayana',verified:true,...certData});}
 else {Object.assign(cert,certData);await cert.save();}
 res.json({success:true,certificate:cert,completedCourses,totalCourses,eligible:true,overallAssessmentScore});
}catch(e){next(e)}});

router.post('/subscription/create-order',async(req,res,next)=>{try{
 if(!RAZORPAY_KEY_ID||!RAZORPAY_KEY_SECRET)return res.status(503).json({success:false,message:'Payment gateway is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env.'});
 const receipt=`THINKAHEAD-${req.user._id.toString().slice(-8)}-${Date.now()}`;
 const auth=Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
 const response=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{Authorization:`Basic ${auth}`,'Content-Type':'application/json'},body:JSON.stringify({amount:PAYMENT_AMOUNT,currency:PAYMENT_CURRENCY,receipt,notes:{userId:req.user._id.toString(),plan:'Annual Premium'}})});
 const order=await response.json();if(!response.ok) return res.status(response.status).json({success:false,message:order.error?.description||'Unable to create payment order.'});
 const payment=await Payment.create({id:'pay-'+Date.now(),transactionId:order.id,userId:req.user._id,studentName:req.user.name,studentEmail:req.user.email,plan:'Annual Membership (Full Curriculum)',amount:PAYMENT_AMOUNT/100,date:today(),status:'Pending',paymentMethod:req.body.paymentMethod||'RAZORPAY',gatewayOrderId:order.id});
 res.json({success:true,keyId:RAZORPAY_KEY_ID,order,payment});
}catch(e){next(e)}});

router.post('/subscription/verify',async(req,res,next)=>{try{
 const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
 if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature)return res.status(400).json({success:false,message:'Payment verification data is incomplete.'});
 const expected=crypto.createHmac('sha256',RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');
 if(expected!==razorpay_signature)return res.status(400).json({success:false,message:'Payment signature verification failed.'});
 const payment=await Payment.findOne({gatewayOrderId:razorpay_order_id,userId:req.user._id});if(!payment)return res.status(404).json({success:false,message:'Payment order not found.'});
 payment.status='Successful';payment.gatewayPaymentId=razorpay_payment_id;payment.gatewaySignature=razorpay_signature;payment.paymentMethod='RAZORPAY';payment.date=today();await payment.save();
 const u=await User.findById(req.user._id);const start=new Date(),expires=new Date(start);expires.setFullYear(expires.getFullYear()+1);u.subscription={active:true,plan:'Annual Premium',startDate:today(),expiresDate:expires.toISOString().slice(0,10),unlockedMonths:1,amount:payment.amount};await u.save();
 void sendSubscriptionSuccessEmail(u,payment);
 void notifyUser(u._id,{category:'Subscription',title:'Membership activated',message:`Your Annual Membership is active until ${u.subscription.expiresDate}.`,actionUrl:'/student/subscription',source:'subscription_success'});
 void sendAdminNotification('Membership activated', `<p><strong>${u.name}</strong> (${u.email}) activated the Annual Membership for ₹${payment.amount}.</p>`, `${u.name} (${u.email}) activated the Annual Membership for ₹${payment.amount}.`);
 res.json({success:true,user:toUser(u),payment});
}catch(e){next(e)}});

router.post('/subscription/failed',async(req,res,next)=>{try{
 const {razorpay_order_id,reason}=req.body||{};
 const u=await User.findById(req.user._id);
 if(razorpay_order_id){
   const payment=await Payment.findOne({gatewayOrderId:razorpay_order_id,userId:req.user._id});
   if(payment){payment.status='Failed';payment.date=today();await payment.save();}
 }
 void sendSubscriptionFailedEmail(u,typeof reason==='string'?reason.slice(0,200):undefined);
 void notifyUser(u._id,{category:'Subscription',title:'Payment failed',message:'Your membership payment could not be completed. No amount was deducted.',actionUrl:'/student/subscription',source:'subscription_failed'});
 res.json({success:true});
}catch(e){next(e)}});

router.post('/subscription/checkout',async(req,res,next)=>{try{
 return res.status(410).json({success:false,message:'Direct subscription activation is disabled. Use the payment gateway checkout and verify the payment.'});
}catch(e){next(e)}});

router.post('/subscription/unlock-month',async(req,res)=>res.status(403).json({success:false,message:'Course access is controlled by the administrator or verified payment. Self-unlocking is disabled.'}));

router.post('/profile/photo',upload.single('photo'),async(req,res,next)=>{try{
 if(!req.file)return res.status(400).json({success:false,message:'Please select a JPG, PNG, WEBP or GIF image up to 2MB.'});
 req.user.profilePhoto=req.file.buffer;
 req.user.profilePhotoMimeType=req.file.mimetype;
 req.user.avatar='';
 await req.user.save();
 res.json({success:true,user:toUser(req.user)});
}catch(e){next(e)}});
router.patch('/profile',async(req,res,next)=>{try{
 const allowed=['name','phone','bio'];for(const key of allowed)if(req.body[key]!==undefined)req.user[key]=String(req.body[key]).trim();
 if(!req.user.name)return res.status(400).json({success:false,message:'Name is required.'});await req.user.save();res.json({success:true,user:toUser(req.user)});
}catch(e){next(e)}});

router.patch('/settings',async(req,res,next)=>{try{
 if(req.body.emailNotifications!==undefined)req.user.emailNotifications=!!req.body.emailNotifications;
 await req.user.save();res.json({success:true,user:toUser(req.user)});
}catch(e){next(e)}});

router.post('/live-sessions/:id/register',async(req,res,next)=>{try{const s=await LiveSession.findOne({id:req.params.id});if(!s)return res.status(404).json({success:false,message:'Live session not found.'});if(!s.registeredUserIds.some(x=>x.toString()===req.user._id.toString())){s.registeredUserIds.push(req.user._id);s.registeredCount=(s.registeredCount||0)+1;await s.save();}res.json({success:true,session:s})}catch(e){next(e)}});

router.post('/community/posts',async(req,res,next)=>{try{if(!req.body.title||!req.body.content)return res.status(400).json({success:false,message:'Title and content are required.'});const p=await ForumPost.create({id:'post-'+Date.now(),author:{userId:req.user._id,name:req.user.name,role:req.user.role==='admin'?'Founder Director':'Student Member',avatar:req.user.avatar||''},title:req.body.title,category:req.body.category||'General',content:req.body.content,createdAt:new Date().toISOString(),likes:0,replies:[]});res.status(201).json({success:true,post:{...p.toObject(),likedByMe:false}})}catch(e){next(e)}});

router.post('/community/posts/:id/replies',async(req,res,next)=>{try{if(!req.body.content)return res.status(400).json({success:false,message:'Reply is required.'});const p=await ForumPost.findOne({id:req.params.id});if(!p)return res.status(404).json({success:false,message:'Post not found.'});p.replies.push({id:'rep-'+Date.now(),author:{userId:req.user._id,name:req.user.name,role:req.user.role==='admin'?'Founder Director':'Student Member',avatar:req.user.avatar||''},content:req.body.content,createdAt:new Date().toISOString(),likes:0});await p.save();res.json({success:true,post:p})}catch(e){next(e)}});

router.post('/community/posts/:id/like',async(req,res,next)=>{try{const p=await ForumPost.findOne({id:req.params.id});if(!p)return res.status(404).json({success:false,message:'Post not found.'});const uid=req.user._id.toString();const idx=(p.likedByUserIds||[]).findIndex(x=>x.toString()===uid);if(idx>=0){p.likedByUserIds.splice(idx,1);p.likes=Math.max(0,p.likes-1)}else{p.likedByUserIds.push(req.user._id);p.likes+=1}await p.save();res.json({success:true,likedByMe:idx<0,likes:p.likes})}catch(e){next(e)}});

router.post('/chat/:threadId/messages',async(req,res,next)=>{try{if(!req.body.text)return res.status(400).json({success:false,message:'Message cannot be empty.'});const th=await ChatThread.findOne({id:req.params.threadId,$or:[{participantUserId:req.user._id},{participantUserId:null}]});if(!th)return res.status(404).json({success:false,message:'Chat thread not found.'});const msg={id:'msg-'+Date.now(),senderId:req.user._id.toString(),text:req.body.text,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),isSender:true};th.messages.push(msg);th.lastMessage=req.body.text;th.lastMessageTime='Just now';await th.save();res.json({success:true,thread:th})}catch(e){next(e)}});

router.patch('/notifications/:id/read',async(req,res,next)=>{try{const n=await Notification.findOneAndUpdate({_id:req.params.id,userId:req.user._id},{read:true},{new:true});res.json({success:true,notification:n})}catch(e){next(e)}});
router.post('/notifications/read-all',async(req,res,next)=>{try{await Notification.updateMany({userId:req.user._id},{read:true});res.json({success:true})}catch(e){next(e)}});

module.exports=router;
