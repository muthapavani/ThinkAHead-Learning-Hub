const express=require('express');
const User=require('../models/User');
const Course=require('../models/Course');
const Progress=require('../models/Progress');
const Certificate=require('../models/Certificate');
const Payment=require('../models/Payment');
const Notification=require('../models/Notification');
const Achievement=require('../models/Achievement');
const multer=require('multer');
const Media=require('../models/Media');
const {requireAuth,requireRole,requireVerifiedEmail}=require('../middleware/auth');
// Images are held in memory only long enough to store them; nothing touches disk,
// which matters on hosts with an ephemeral filesystem.
const imageUpload=multer({
  storage:multer.memoryStorage(),
  limits:{fileSize:3*1024*1024},
  fileFilter:(req,file,cb)=>cb(null,/^image\/(jpeg|png|webp|gif|avif)$/.test(file.mimetype))
});
// PDFs are course handouts, so they get more room than an image but are still
// capped - anything larger belongs on a file host, not in the database.
const pdfUpload=multer({
  storage:multer.memoryStorage(),
  limits:{fileSize:10*1024*1024},
  fileFilter:(req,file,cb)=>cb(null,file.mimetype==='application/pdf')
});
const router=express.Router();router.use(requireAuth,requireVerifiedEmail,requireRole('admin'));

// Upload an image and get back a public URL to paste into a course field.
// Returns an absolute URL so it resolves from the frontend's own domain.
// Upload a PDF handout and get back a public URL for the resource record.
router.post('/uploads/pdf', pdfUpload.single('file'), async (req,res,next)=>{
  try {
    if(!req.file) return res.status(400).json({success:false,message:'Choose a PDF file under 10MB.'});
    const media=await Media.create({
      data:req.file.buffer,
      mimeType:'application/pdf',
      name:req.file.originalname||'document.pdf',
      size:req.file.size,
      uploadedBy:req.user._id
    });
    const base=(process.env.PUBLIC_API_URL||`${req.protocol}://${req.get('host')}`).replace(/\/$/,'');
    res.status(201).json({
      success:true,
      url:`${base}/api/public/media/${media._id}`,
      id:media._id,
      fileName:media.name,
      // Most handouts are well under a megabyte; "0.0 MB" reads like a failure.
      fileSize: media.size>=1048576 ? `${(media.size/1048576).toFixed(1)} MB` : `${Math.max(1,Math.round(media.size/1024))} KB`
    });
  } catch(e){next(e)}
});

router.post('/uploads/image', imageUpload.single('image'), async (req,res,next)=>{
  try {
    if(!req.file) return res.status(400).json({success:false,message:'Choose a JPG, PNG, WebP, GIF or AVIF image under 3MB.'});
    const media=await Media.create({
      data:req.file.buffer,
      mimeType:req.file.mimetype,
      name:req.file.originalname||'',
      size:req.file.size,
      uploadedBy:req.user._id
    });
    const base=(process.env.PUBLIC_API_URL||`${req.protocol}://${req.get('host')}`).replace(/\/$/,'');
    res.status(201).json({success:true,url:`${base}/api/public/media/${media._id}`,id:media._id});
  } catch(e){next(e)}
});


const userDto=u=>({id:u._id.toString(),name:u.name,email:u.email,phone:u.phone||'',role:u.role,avatar:u.profilePhoto?.length ? `data:${u.profilePhotoMimeType||'image/jpeg'};base64,${Buffer.from(u.profilePhoto).toString('base64')}` : '',bio:u.bio||'',enrolledCourseIds:u.enrolledCourseIds||[],completedCourseIds:u.completedCourseIds||[],subscription:u.subscription,streakDays:u.streakDays||0,totalHours:u.totalHours||0,points:u.points||0,unlockedBadgeIds:u.unlockedBadgeIds||[]});

router.get('/dashboard',async(req,res,next)=>{try{
 const [students,courses,activeMembers,payments,certificates,completed,assignments,quizAttempts,quizPassed,avgProgress,studyAgg]=await Promise.all([
  User.countDocuments({role:'student'}),
  Course.countDocuments(),
  User.countDocuments({role:'student','subscription.active':true}),
  Payment.aggregate([{$match:{status:'Successful'}},{$group:{_id:null,total:{$sum:'$amount'}}}]),
  Certificate.countDocuments(),
  Progress.countDocuments({isCompleted:true}),
  Progress.countDocuments({'assignmentSubmissions':{$exists:true}}),
  Progress.countDocuments({'quizResult.percentage':{$exists:true}}),
  Progress.countDocuments({'quizResult.passed':true}),
  Progress.aggregate([{$group:{_id:null,avg:{$avg:'$percent'}}}]),
  User.aggregate([{$match:{role:'student'}},{$group:{_id:null,hours:{$sum:'$totalHours'}}}])
 ]);
 const totalCollections=payments[0]?.total||0;
 res.json({success:true,stats:{
   students,courses,annualMembers:activeMembers,revenue:totalCollections,certificates,
   completedCourses:completed,assignments,quizAttempts,quizPassed,
   quizPassRate:quizAttempts?Math.round(quizPassed/quizAttempts*100):0,
   averageProgress:Math.round(avgProgress[0]?.avg||0),
   totalStudyHours:Math.round(studyAgg[0]?.hours||0)
 }})
}catch(e){next(e)}});

router.patch('/students/:id/access',async(req,res,next)=>{try{const months=Math.max(1,Math.min(12,Number(req.body.unlockedMonths)||1));const u=await User.findOne({_id:req.params.id,role:'student'});if(!u)return res.status(404).json({success:false,message:'Student not found.'});u.subscription={...(u.subscription?.toObject?.()||u.subscription||{}),active:true,plan:'Monthly Premium',unlockedMonths:months,startDate:u.subscription?.startDate||new Date().toISOString().slice(0,10)};await u.save();res.json({success:true,user:userDto(u)})}catch(e){next(e)}});

router.get('/students',async(req,res,next)=>{try{const q=(req.query.search||'').trim();const filter={role:'student',...(q?{$or:[{name:{$regex:q,$options:'i'}},{email:{$regex:q,$options:'i'}}]}:{})};const students=await User.find(filter).sort({createdAt:-1}).lean();res.json({success:true,students:students.map(userDto)})}catch(e){next(e)}});

router.get('/courses',async(req,res,next)=>{try{res.json({success:true,courses:await Course.find().lean()})}catch(e){next(e)}});

// The course form submits every field as a string, so empty number inputs
// arrive as ''. Mongoose rejects those, which surfaced as "Validation failed".
// Blank numerics are dropped and the rest are coerced before saving.
const num=(v,fallback)=>{
  // Number('') is 0, which would silently turn an empty box into a real value.
  if(v===''||v===null||v===undefined||(typeof v==='string'&&v.trim()==='')) return fallback;
  const n=Number(v);
  return Number.isFinite(n)?n:fallback;
};
function normaliseCourse(body){
  const c={...body};
  for(const key of ['lessonsCount','monthUnlock','rating','reviewsCount']){
    if(c[key]===''||c[key]===null||c[key]===undefined) delete c[key];
    else c[key]=num(c[key],undefined);
    if(c[key]===undefined) delete c[key];
  }
  if(typeof c.isFree!=='undefined') c.isFree=c.isFree===true||c.isFree==='true';
  if(Array.isArray(c.modules)){
    c.modules=c.modules.map(m=>({...m,lessons:(m.lessons||[]).map(l=>{
      const lesson={...l};
      for(const key of ['durationSeconds','order']){
        if(lesson[key]===''||lesson[key]===null||lesson[key]===undefined) delete lesson[key];
        else lesson[key]=num(lesson[key],undefined);
        if(lesson[key]===undefined) delete lesson[key];
      }
      lesson.videoUrls=Array.isArray(lesson.videoUrls)?lesson.videoUrls.filter(Boolean):[];
      return lesson;
    })}));
    // lessonsCount should follow the modules rather than be typed by hand.
    c.lessonsCount=c.modules.reduce((t,m)=>t+(m.lessons||[]).length,0);
  }
  if(c.quiz&&Array.isArray(c.quiz.questions)){
    c.quiz={...c.quiz,
      durationMinutes:num(c.quiz.durationMinutes,undefined),
      passingScorePercentage:num(c.quiz.passingScorePercentage,undefined),
      questions:c.quiz.questions.map(q=>({...q,
        options:Array.isArray(q.options)?q.options.filter(o=>String(o).trim()!==''):[],
        correctAnswer:num(q.correctAnswer,0)
      }))
    };
    if(c.quiz.durationMinutes===undefined) delete c.quiz.durationMinutes;
    if(c.quiz.passingScorePercentage===undefined) delete c.quiz.passingScorePercentage;
  }
  return c;
}

router.post('/courses',async(req,res,next)=>{try{if(!req.body.title)return res.status(400).json({success:false,message:'Course title is required.'});const slug=(req.body.slug||req.body.title).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-');const c=await Course.create({...normaliseCourse(req.body),id:req.body.id||'course-'+Date.now(),slug});res.status(201).json({success:true,course:c})}catch(e){next(e)}});
router.patch('/courses/:id',async(req,res,next)=>{try{const c=await Course.findOneAndUpdate({id:req.params.id},normaliseCourse(req.body),{new:true,runValidators:true});if(!c)return res.status(404).json({success:false,message:'Course not found.'});res.json({success:true,course:c})}catch(e){next(e)}});

router.get('/resources',async(req,res,next)=>{try{const courses=await Course.find().lean();const resources=courses.flatMap(c=>(c.resources||[]).map(r=>({...r,courseId:c.id,courseTitle:c.title})));res.json({success:true,resources})}catch(e){next(e)}});
router.post('/courses/:courseId/resources',async(req,res,next)=>{try{const c=await Course.findOne({id:req.params.courseId});if(!c)return res.status(404).json({success:false,message:'Course not found.'});if(!req.body.title||!req.body.fileName)return res.status(400).json({success:false,message:'title and fileName are required.'});const resource={id:req.body.id||`res-${Date.now()}`,title:String(req.body.title).trim(),type:req.body.type||'pdf',fileName:String(req.body.fileName).trim(),fileSize:req.body.fileSize||'',category:req.body.category||'Handbook',downloadUrl:req.body.downloadUrl||'',contentSummary:req.body.contentSummary||'',published:req.body.published===true};c.resources.push(resource);await c.save();res.status(201).json({success:true,resource:c.resources[c.resources.length-1]})}catch(e){next(e)}});
router.patch('/courses/:courseId/resources/:resourceId',async(req,res,next)=>{try{const c=await Course.findOne({id:req.params.courseId});if(!c)return res.status(404).json({success:false,message:'Course not found.'});const r=c.resources.find(x=>x.id===req.params.resourceId || x._id.toString()===req.params.resourceId);if(!r)return res.status(404).json({success:false,message:'Resource not found.'});Object.assign(r,req.body);await c.save();res.json({success:true,resource:r})}catch(e){next(e)}});

router.get('/assignments',async(req,res,next)=>{try{
 const rows=await Progress.find({'assignmentSubmissions':{$exists:true}}).populate('userId','name email').lean();const output=[];
 for(const p of rows){const subs=p.assignmentSubmissions||{};for(const [assignmentId,s] of Object.entries(subs)){const course=await Course.findOne({id:p.courseId}).lean();const assignment=course?.assignments?.find(a=>a.id===assignmentId);output.push({id:`${p._id}-${assignmentId}`,progressId:p._id,courseId:p.courseId,studentName:p.userId?.name||'Learner',studentEmail:p.userId?.email||'',courseName:course?.title||p.courseId,assignmentId,assignmentTitle:assignment?.title||assignmentId,submittedDate:s.submittedAt,fileName:s.fileName||'',textResponse:s.textResponse||'',status:s.status==='graded'?'Graded':'Pending',score:s.score??null,feedback:s.feedback||''});}}
 res.json({success:true,submissions:output});
}catch(e){next(e)}});

router.patch('/assignments/:progressId/:assignmentId/grade',async(req,res,next)=>{try{const p=await Progress.findById(req.params.progressId);if(!p)return res.status(404).json({success:false,message:'Submission not found.'});const sub=p.assignmentSubmissions.get(req.params.assignmentId);if(!sub)return res.status(404).json({success:false,message:'Assignment submission not found.'});const score=Number(req.body.score);if(!Number.isFinite(score)||score<0||score>100)return res.status(400).json({success:false,message:'Score must be between 0 and 100.'});sub.status='graded';sub.score=score;sub.feedback=String(req.body.feedback||'');p.assignmentSubmissions.set(req.params.assignmentId,sub);await p.save();res.json({success:true,progress:p})}catch(e){next(e)}});

router.get('/payments',async(req,res,next)=>{try{res.json({success:true,payments:await Payment.find().sort({createdAt:-1}).lean()})}catch(e){next(e)}});
router.patch('/payments/:id',async(req,res,next)=>{try{if(!['Successful','Pending','Failed'].includes(req.body.status))return res.status(400).json({success:false,message:'Invalid payment status.'});const p=await Payment.findOneAndUpdate({id:req.params.id},{status:req.body.status},{new:true});if(!p)return res.status(404).json({success:false,message:'Payment not found.'});res.json({success:true,payment:p})}catch(e){next(e)}});

router.get('/certificates',async(req,res,next)=>{try{const q=(req.query.search||'').trim();const filter=q?{$or:[{certificateNumber:{$regex:q,$options:'i'}},{studentName:{$regex:q,$options:'i'}},{studentEmail:{$regex:q,$options:'i'}}]}:{};res.json({success:true,certificates:await Certificate.find(filter).sort({createdAt:-1}).lean()})}catch(e){next(e)}});

router.post('/notifications/broadcast',async(req,res,next)=>{try{const title=String(req.body.title||'').trim();const message=String(req.body.message||'').trim();if(!title||!message)return res.status(400).json({success:false,message:'Title and message are required.'});if(title.length>120||message.length>500)return res.status(400).json({success:false,message:'Title or message is too long.'});const users=await User.find({role:'student'}).select('_id').lean();const now=new Date();const docs=users.map(u=>({userId:u._id,category:req.body.category||'Course Updates',title,message,time:'Just now',read:false,actionUrl:req.body.actionUrl,source:'admin_broadcast',createdAt:now,updatedAt:now}));if(docs.length)await Notification.insertMany(docs);res.status(201).json({success:true,count:docs.length,createdAt:now.toISOString()})}catch(e){next(e)}});
router.get('/notifications/broadcasts',async(req,res,next)=>{try{const [audience,rows]=await Promise.all([User.countDocuments({role:'student'}),Notification.aggregate([{$match:{userId:{$ne:null},source:'admin_broadcast'}},{$group:{_id:{title:'$title',message:'$message',category:'$category'},recipientCount:{$sum:1},createdAt:{$max:'$createdAt'}}},{$sort:{createdAt:-1}},{$limit:20}])]);const broadcasts=rows.map((r,i)=>({id:`broadcast-${i}-${new Date(r.createdAt||Date.now()).getTime()}`,title:r._id.title,message:r._id.message,category:r._id.category||'Course Updates',recipientCount:r.recipientCount,createdAt:r.createdAt}));res.json({success:true,audience,broadcasts})}catch(e){next(e)}});

router.get('/analytics',async(req,res,next)=>{try{const [learners,courses,certificates,progressRows,quizRows]=await Promise.all([User.countDocuments({role:'student'}),Course.countDocuments(),Certificate.countDocuments(),Progress.aggregate([{$group:{_id:'$courseId',learners:{$sum:1},avgProgress:{$avg:'$percent'},completed:{$sum:{$cond:['$isCompleted',1,0]}},startingAttempts:{$sum:{$cond:[{$ne:[{$ifNull:['$startingQuizResult.percentage',null]},null]},1,0]}},avgStartingQuiz:{$avg:'$startingQuizResult.percentage'},finalAttempts:{$sum:{$cond:[{$ne:[{$ifNull:['$quizResult.percentage',null]},null]},1,0]}},avgFinalQuiz:{$avg:'$quizResult.percentage'},finalPassed:{$sum:{$cond:[{$eq:['$quizResult.passed',true]},1,0]}}}},{$sort:{avgProgress:-1}}]),Progress.aggregate([{$match:{'quizResult.percentage':{$ne:null}}},{$group:{_id:null,attempts:{$sum:1},passed:{$sum:{$cond:['$quizResult.passed',1,0]}},avg:{$avg:'$quizResult.percentage'}}}])]);const courseIds=progressRows.map(r=>r._id);const courseDocs=await Course.find({id:{$in:courseIds}}).select('id title').lean();const names=new Map(courseDocs.map(c=>[c.id,c.title]));const courseProgress=progressRows.map(r=>({...r,courseTitle:names.get(r._id)||r._id,avgProgress:Number(r.avgProgress||0),avgStartingQuiz:Number(r.avgStartingQuiz||0),avgFinalQuiz:Number(r.avgFinalQuiz||0),finalPassRate:r.finalAttempts?Math.round(r.finalPassed/r.finalAttempts*100):0}));const overall=await Progress.aggregate([{$group:{_id:null,avgProgress:{$avg:'$percent'},startingAvg:{$avg:'$startingQuizResult.percentage'},finalAvg:{$avg:'$quizResult.percentage'},completed:{$sum:{$cond:['$isCompleted',1,0]}}}}]);const q=quizRows[0]||{};res.json({success:true,analytics:{summary:{learners,courses,certificates,averageProgress:Math.round(overall[0]?.avgProgress||0),averageStartingQuiz:Math.round(overall[0]?.startingAvg||0),averageFinalQuiz:Math.round(overall[0]?.finalAvg||0),finalQuizAttempts:q.attempts||0,finalQuizPassRate:q.attempts?Math.round(q.passed/q.attempts*100):0,completedCourses:overall[0]?.completed||0},courseProgress}})}catch(e){next(e)}});

router.get('/achievements',async(req,res,next)=>{try{res.json({success:true,achievements:await Achievement.find().sort({createdAt:1}).lean()})}catch(e){next(e)}});
router.patch('/achievements/:id',async(req,res,next)=>{try{const a=await Achievement.findOneAndUpdate({id:req.params.id},{$set:{title:req.body.title,description:req.body.description,icon:req.body.icon,category:req.body.category}},{new:true,runValidators:true});if(!a)return res.status(404).json({success:false,message:'Achievement not found.'});res.json({success:true,achievement:a})}catch(e){next(e)}});

router.get('/settings',async(req,res)=>res.json({success:true,settings:{certificateDirectorName:'G. Satyanarayana',instituteName:'The Institute of Human Capability Development and Research'}}));
router.patch('/settings',async(req,res)=>res.json({success:true,message:'Portal configuration saved.',settings:req.body}));

module.exports=router;
