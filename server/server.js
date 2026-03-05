const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()


const app = express()
const PORT = process.env.PORT || 5001
const DB_URL = process.env.DB_URL

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname,"../client")))
mongoose.connect(DB_URL)

/* USER MODEL */

const UserSchema = new mongoose.Schema({
 username:String,
 password:String,
 role:String
})

const User = mongoose.model("User",UserSchema)

/* VIDEO MODEL */

const VideoSchema = new mongoose.Schema({

 title:String,
 description:String,
 filename:String,
 views:{type:Number,default:0},
 uploadDate:{type:Date,default:Date.now}

})

const Video = mongoose.model("Video",VideoSchema)

/* DEFAULT USERS */

async function createDefaultUsers(){

 const host = await User.findOne({username:"host"})

 if(!host){
  await User.create({
   username:"host",
   password:"123",
   role:"host"
  })
 }

 const user = await User.findOne({username:"user"})

 if(!user){
  await User.create({
   username:"user",
   password:"123",
   role:"user"
  })
 }

}

createDefaultUsers()

/* STORAGE */

const storage = multer.diskStorage({
 destination:(req,file,cb)=>{
  cb(null,path.join(__dirname,"uploads"))
 },
 filename:(req,file,cb)=>{
  cb(null,Date.now()+path.extname(file.originalname))
 }
})

const upload = multer({storage})

/* LOGIN */

app.post("/login",async(req,res)=>{

 const {username,password} = req.body

 const user = await User.findOne({username,password})

 if(!user){
  return res.json({success:false})
 }

 res.json({
  success:true,
  role:user.role
 })

})

/* UPLOAD */

app.post("/upload",upload.single("video"),async(req,res)=>{

 const video = new Video({

  title:req.body.title,
  description:req.body.description,
  filename:req.file.filename

 })

 await video.save()

 res.json({message:"Uploaded"})

})

/* GET VIDEOS */

app.get("/videos",async(req,res)=>{

 const videos = await Video.find().sort({uploadDate:1})

 res.json(videos)

})

/* STREAM VIDEO */

app.get("/video/:name",(req,res)=>{

 const videoPath = path.join(__dirname,"uploads",req.params.name)

 res.sendFile(videoPath)

})

/* DOWNLOAD */

app.get("/download/:name",(req,res)=>{

 const videoPath = path.join(__dirname,"uploads",req.params.name)

 res.download(videoPath)

})

/* VIEW COUNT */

app.post("/view/:id",async(req,res)=>{

 await Video.findByIdAndUpdate(req.params.id,{
  $inc:{views:1}
 })

 res.json({message:"view added"})
})

/* DELETE VIDEO */


app.delete("/delete/:id",async(req,res)=>{

 const video = await Video.findById(req.params.id)

 if(video){

  const videoPath = path.join(__dirname,"uploads",video.filename)

  if(fs.existsSync(videoPath)){
   fs.unlinkSync(videoPath)
  }

  await Video.findByIdAndDelete(req.params.id)

 }

 res.json({message:"Deleted"})

})

app.listen(PORT,()=>{
 console.log("Server running on http://localhost:"+PORT)
})