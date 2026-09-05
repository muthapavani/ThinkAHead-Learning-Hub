const express = require('express');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');
const LiveSession = require('../models/LiveSession');
const Content = require('../models/Content');
const { Contact, Newsletter } = require('../models/Contact');
const { sendAdminNotification, sendContactAcknowledgement } = require('../utils/email');
const router=express.Router();

router.get('/bootstrap', async (req,res,next)=>{
  try {
    const [courses,testimonials,faqs,certificates,liveSessions]=await Promise.all([
      Course.find().lean(), Content.find({kind:'testimonial'}).lean(), Content.find({kind:'faq'}).lean(),
      Certificate.find().limit(10).lean(), LiveSession.find().lean()
    ]);
    res.json({success:true,data:{courses,testimonials:testimonials.map(x=>x.payload),faqs:faqs.map(x=>x.payload),certificates,liveSessions}});
  } catch(e){next(e)}
});
router.get('/courses', async(req,res,next)=>{try{res.json({success:true,courses:await Course.find().lean()})}catch(e){next(e)}});
router.get('/courses/:id', async(req,res,next)=>{try{const course=await Course.findOne({$or:[{id:req.params.id},{slug:req.params.id}]}).lean();if(!course)return res.status(404).json({success:false,message:'Course not found.'});res.json({success:true,course})}catch(e){next(e)}});
router.get('/verify/:certificateNumber', async(req,res,next)=>{try{const cert=await Certificate.findOne({certificateNumber:req.params.certificateNumber}).lean();if(!cert)return res.status(404).json({success:false,message:'Certificate not found.'});res.json({success:true,certificate:cert})}catch(e){next(e)}});

router.post('/contact', async(req,res,next)=>{try{if(!req.body.name||!req.body.email||!req.body.message)return res.status(400).json({success:false,message:'Name, email and message are required.'});const contact=await Contact.create({name:req.body.name.trim(),email:req.body.email.trim().toLowerCase(),message:req.body.message.trim()});await sendAdminNotification('New Contact Us message', `<p><strong>${String(contact.name).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}</strong> (${contact.email}) sent a new message.</p><div style="padding:14px;background:#f8fafc;border-radius:10px;white-space:pre-wrap">${String(contact.message).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]))}</div>`, `New contact message from ${contact.name} (${contact.email}): ${contact.message}`);await sendContactAcknowledgement(contact);res.status(201).json({success:true,message:'Message received. We sent it to our support team.'})}catch(e){next(e)}});
router.post('/newsletter', async(req,res,next)=>{try{if(!req.body.email)return res.status(400).json({success:false,message:'Email is required.'});await Newsletter.updateOne({email:req.body.email.toLowerCase().trim()},{$setOnInsert:{email:req.body.email.toLowerCase().trim()}},{upsert:true});res.status(201).json({success:true,message:'Subscribed successfully.'})}catch(e){next(e)}});
module.exports=router;
