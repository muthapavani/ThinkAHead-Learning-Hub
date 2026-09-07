require('dotenv').config();
const express=require('express');const mongoose=require('mongoose');const cors=require('cors');const helmet=require('helmet');const morgan=require('morgan');const rateLimit=require('express-rate-limit');
const authRoutes=require('./routes/auth');const publicRoutes=require('./routes/public');const studentRoutes=require('./routes/student');const adminRoutes=require('./routes/admin');const {notFound,errorHandler}=require('./middleware/error');
const { verifyEmailTransport } = require('./utils/email');
const { startScheduler } = require('./utils/scheduler');
const app=express();
const PORT=Number(process.env.PORT||5000);
app.use(helmet());app.use(cors({credentials:true,origin:(origin,cb)=>{const allowed=[...(process.env.CLIENT_URL||'').split(','),'http://localhost:3000','http://127.0.0.1:3000','http://localhost:5173','http://127.0.0.1:5173','http://localhost:5174','http://127.0.0.1:5174'].map(x=>x.trim()).filter(Boolean);if(!origin||allowed.includes(origin))return cb(null,true);return cb(new Error(`CORS origin not allowed: ${origin}`));}}));
app.use(express.json({limit:'2mb'}));app.use(express.urlencoded({extended:true}));app.use(morgan(process.env.NODE_ENV==='production'?'combined':'dev'));
const path=require('path');
app.use('/uploads',express.static(path.join(__dirname,'../uploads')));
// Public branding assets used by HTML emails. Served by URL, not attached to emails.
// /brand lives inside the backend folder, so it keeps working when only the
// backend is deployed. The /assets/images mount below is a convenience for
// running the whole repo locally and may not exist on a backend-only deploy.
app.use('/brand',express.static(path.join(__dirname,'assets'),{maxAge:'7d'}));
app.use('/assets/images',express.static(path.join(__dirname,'../../public/assets/images')));
app.use('/api',rateLimit({windowMs:15*60*1000,max:300,standardHeaders:true,legacyHeaders:false}));
app.get('/api/health',async(req,res)=>res.json({success:true,status:'ok',service:'thinkahead-api',timestamp:new Date().toISOString()}));
app.use('/api/auth',authRoutes);app.use('/api/public',publicRoutes);app.use('/api/student',studentRoutes);app.use('/api/admin',adminRoutes);
app.use(notFound);app.use(errorHandler);
async function start(){await mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/thinkahead');console.log('MongoDB connected');if(String(process.env.EMAIL_VERIFY_ON_START||'true').toLowerCase()!=='false') await verifyEmailTransport();startScheduler();app.listen(PORT,()=>console.log(`ThinkAHead API listening on http://localhost:${PORT}`));}
if(require.main===module)start().catch(e=>{console.error('Startup failed:',e);process.exit(1)});
module.exports=app;
