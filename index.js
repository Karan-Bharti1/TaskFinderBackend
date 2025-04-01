const {initialiseDatabase}=require("./databse/database.connection")
const cors=require("cors")
const PORT=5000
const jwt=require("jsonwebtoken")
const express=require('express')
const app=express()
app.use(express.json())
const corsOptions={
    origin:"*",
    credentials:true,
    optionsSuccessStatus:200
}
app.use(cors(corsOptions))
initialiseDatabase()
const JWT_SECRET="your_jwt_secret"
const User=require("./models/Owner.models")
const Tags=require("./models/Tag.models")
const Project=require("./models/Project.models")
//Middleware to verify token
const verifyJWT=(req,res,next)=>{
    const token=req.headers['authorization']
    if(!token){
        res.status(401).json({message:"No token was found"})
    }
    try {

        const decodedToken=jwt.verify(token,JWT_SECRET)
        req.user=decodedToken;
        next()
        } catch (error) {
        res.status(402).json({message:"Invalid Token"})
        
    }
}

const ownerSignUp = async (data) => {
    try {
       
        const newUser=new User(data)
        const savedData = await newUser.save();
        return savedData;
    } catch (error) {
        throw error;
    }
};
app.post("/signup",async(req,res)=>{
try {
    const data=await ownerSignUp(req.body)
    if(data){
        res.status(200).json({message:"Account Created Successfully",data})
    }
} catch (error) {
    res.status(500).json({message:"Failed To add user to database"})
}
})
app.post("/login",async(req,res)=>{
    const user=req.body
    const Secret_Key=await User.findOne(user)
    if(Secret_Key.password===user.password && Secret_Key.email===user.email){
const token=jwt.sign({role:"admin"},JWT_SECRET,{expiresIn:"24h"})
res.json({token})
    }else{
res.json({message:"Invalid Secret"})
    }

})
app.get("/get/auth/me",verifyJWT,async(req,res)=>{
const {email}=req.body;
try {
    const userData=await User.findOne({email:email})
    if(userData){
        res.status(200).json({message:"User Details Fetched Successfully",userData})
    }else{
        res.status(400).json({message:"No User Found"})
    }
} catch (error) {
  res.status(500).json({message:"Failed to fetch user data"})  
}
})
app.post("/tags/auth",verifyJWT,async(req,res)=>{
    
    try {
        const newTag= new Tags(req.body)
        const saveTag=await newTag.save()
        if(saveTag){
            res.status(200).json({message:"Tag updated successfully",tag:saveTag})
        }
    } catch (error) {
       res.status(500).json({message:"Failed to create new tag"}) 
       console.log(error)
    }
})
app.get("/tags/auth",verifyJWT,async(req,res)=>{
    
    try {
        const tagdData= await Tags.find()
        if(tagdData && tagdData.length>0){
            res.status(200).json(tagdData)
        }else{
            res.status(400).json({message:"No tags found"})   
        }
    } catch (error) {
       res.status(500).json({message:"Failed to fetch tags data"}) 
    }
})
app.post("/projects/auth",verifyJWT,async(req,res)=>{
    const data =req.body
    try {
     const project=new Project(data)   
     const savedProject=await project.save()
     if(savedProject){
        res.status(200).json({message:"Project updated successfully",project:savedProject})
     }
    } catch (error) {
        console.log(error)
    res.status(500).json({message:"failed to add project"})  
    }
})
app.get("/projects/auth",async(req,res)=>{
    try {
       const projects=await Project.find() 
       if(projects){
        res.status(200).json(projects)
    }else{
        res.status(400).json({message:"No Projects found"})   
    }
    } catch (error) {
        res.status(500).json({message:"Failed to fetch Projects data"}) 
    }
})
app.listen(PORT,()=>{
  console.log( `App is running at ${PORT}`)
})