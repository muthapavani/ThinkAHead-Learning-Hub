require('dotenv').config();
const mongoose=require('mongoose');const bcrypt=require('bcryptjs');
const {COURSES_DATA}=require('./data/courses');const mock=require('./data/mockData');
const User=require('./models/User');const Course=require('./models/Course');const Progress=require('./models/Progress');const Certificate=require('./models/Certificate');const LiveSession=require('./models/LiveSession');const ForumPost=require('./models/ForumPost');const ChatThread=require('./models/ChatThread');const Notification=require('./models/Notification');const Achievement=require('./models/Achievement');const Payment=require('./models/Payment');const Content=require('./models/Content');

async function run(){
 await mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/thinkahead');
 console.log('Connected to MongoDB');
 await Promise.all([Course.deleteMany({}),LiveSession.deleteMany({}),ForumPost.deleteMany({}),ChatThread.deleteMany({}),Notification.deleteMany({}),Achievement.deleteMany({}),Payment.deleteMany({}),Certificate.deleteMany({}),Content.deleteMany({}),Progress.deleteMany({})]);
 await Course.insertMany(COURSES_DATA.map(c=>({...c,resources:(c.resources||[]).map(r=>({...r,published:false}))})));
 await Achievement.insertMany(mock.INITIAL_ACHIEVEMENTS.map(a=>({...a})));
 await LiveSession.insertMany(mock.INITIAL_LIVE_SESSIONS.map(s=>({...s,registeredUserIds:[]})));
 await Content.insertMany([...mock.INITIAL_TESTIMONIALS.map(payload=>({kind:'testimonial',payload})),...mock.INITIAL_FAQS.map(payload=>({kind:'faq',payload}))]);
 const admin=await User.create({name:mock.INITIAL_ADMIN_USER.name,email:'admin@ihcdr.org',phone:mock.INITIAL_ADMIN_USER.phone,passwordHash:await bcrypt.hash('admin123',12),role:'admin',emailVerified:true,avatar:mock.INITIAL_ADMIN_USER.avatar,bio:mock.INITIAL_ADMIN_USER.bio,enrolledCourseIds:[],completedCourseIds:[],subscription:mock.INITIAL_ADMIN_USER.subscription,points:mock.INITIAL_ADMIN_USER.points||0});
 const student=await User.create({name:mock.INITIAL_STUDENT_USER.name,email:'student@ihcdr.org',phone:mock.INITIAL_STUDENT_USER.phone,passwordHash:await bcrypt.hash('student123',12),role:'student',emailVerified:true,avatar:'',bio:mock.INITIAL_STUDENT_USER.bio,enrolledCourseIds:['course-1','course-2'],completedCourseIds:[],subscription:{active:false,plan:'Free Trial',startDate:new Date().toISOString().slice(0,10),expiresDate:'',unlockedMonths:1,amount:0},streakDays:0,totalHours:0,points:0,unlockedBadgeIds:['badge-1']});
 const rohit=await User.create({name:'Rohit Mehta',email:'rohit.mehta@email.com',passwordHash:await bcrypt.hash('student123',12),role:'student',emailVerified:true,avatar:'',subscription:{active:false,plan:'Free Trial',unlockedMonths:1}});
 const karthik=await User.create({name:'Karthik Reddy',email:'karthik.r@email.com',passwordHash:await bcrypt.hash('student123',12),role:'student',emailVerified:true,avatar:'',subscription:{active:false,plan:'Free Trial',unlockedMonths:1}});
 await Progress.create({userId:rohit._id,courseId:'course-2',percent:40,completedLessonIds:['les-2-1'],assignmentSubmissions:{'asg-2':{submittedAt:new Date().toISOString(),fileName:'Rohit_Pitch_Framework.docx',status:'submitted',textResponse:'Executive pitch draft.'}}});
 await Progress.create({userId:karthik._id,courseId:'course-5',percent:60,completedLessonIds:[],assignmentSubmissions:{'asg-5':{submittedAt:new Date().toISOString(),fileName:'Karthik_RCA_Sheet.pdf',status:'submitted',textResponse:'Root cause analysis matrix.'}}});
 await ForumPost.insertMany(mock.INITIAL_COMMUNITY_POSTS.map(p=>({...p,author:{...p.author,userId:student._id},replies:(p.replies||[]).map(r=>({...r,author:{...r.author,userId:admin._id}})),likedByUserIds:p.likedByMe?[student._id]:[]})));
 await ChatThread.insertMany(mock.INITIAL_CHAT_THREADS.map(t=>({...t,participantUserId:student._id, messages:t.messages.map(m=>({...m,isSender:m.senderId==='usr-student-1'}))})));
 await Notification.insertMany(mock.INITIAL_NOTIFICATIONS.map(n=>({...n,userId:student._id})));
 await Payment.insertMany(mock.INITIAL_PAYMENTS.map(p=>({...p,userId:student._id})));
 console.log('Seed complete. Demo accounts: student@ihcdr.org / student123 and admin@ihcdr.org / admin123');
 await mongoose.disconnect();
}
run().catch(e=>{console.error(e);process.exit(1)});
