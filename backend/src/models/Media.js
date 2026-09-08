const mongoose=require('mongoose');

// Images uploaded from the admin panel (course thumbnails, banners).
// The bytes live here rather than on the Course document so that listing
// courses stays small - the API returns a URL and the browser fetches and
// caches the image separately.
const mediaSchema=new mongoose.Schema({
  data:{type:Buffer,required:true},
  mimeType:{type:String,required:true},
  name:{type:String,default:''},
  size:{type:Number,default:0},
  uploadedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
},{timestamps:true});

module.exports=mongoose.model('Media',mediaSchema);
