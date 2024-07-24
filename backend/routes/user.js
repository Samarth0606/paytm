const express = require('express');
const router = express.Router();
const zod = require('zod');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware');


let signinSchema = zod.object({
    email:zod.string().email().trim().toLowerCase(),
    firstName:zod.string().min(3).max(50).trim(),
    lastName:zod.string().min(3).max(50).trim(),
    password:zod.string().min(6).trim(),
})
router.post('/signup' , async(req,res)=>{
    try{
        let response = signinSchema.safeParse(req.body);
        let existingUser , mail=null;
        if(!response.success){
            return res.status(500).json({msg:"INVALID ZOD DATA"})
        }else{
            mail = response.data.email;
        }
        if(mail && mail.length){
           existingUser = await User.findOne({email:mail})
        }
        if(existingUser){
            return res.status(500).json({msg:"USER ALREADY EXISTS"})
        }else{
            await User.create(req.body);
            res.status(201).json({msg:"User created successfully"})
        }
    }
    catch(err){
        res.status(500).json({msg:err})
    }
})

let signupSchema = zod.object({
    email:zod.string().email().trim().toLowerCase(),
    password:zod.string().min(6).trim(),
})
router.post('/signin' , async(req,res)=>{
    try{
        let response = signupSchema.safeParse(req.body);
        let existingUser , userId , mail=null;
        if(!response.success){
            return res.status(500).json({msg:"INVALID INPUT"})
        }else{
            mail = response.data.email;
        }
        if(mail && mail.length){
           existingUser = await User.findOne({email:mail})
        }
        if(!existingUser){
            return res.status(500).json({msg:"USER DOESNOT EXISTS"})
        }else{
            let foundUser = await User.findOne({email:mail});
            userId = foundUser._id;
            let token = jwt.sign({foundUser} , process.env.JWT_TOKEN);
            res.status(200).json({foundUser , token})
        }
    }
    catch(err){
        res.status(500).json({msg:err})
    }
})

let editSchema = zod.object({
    firstName:zod.string().min(3).max(50).trim(),
    lastName:zod.string().min(3).max(50).trim(),
    password:zod.string().min(6).trim(),
})
// updating
router.put('/' , authMiddleware ,  async(req,res)=>{
    let response = editSchema.safeParse(req.body);
    if(!response.success){
        return res.status(411).json({msg:"INVALID INPUT"})
    }else{
        try{
            let {firstName , password , lastName} = req.body;
            let foundUser = await User.findByIdAndUpdate(req.user , {firstName , password , lastName});
            res.send(foundUser)
        }
        catch(err){
            res.status(500).json({msg:err})
        }
    }
})

// findAll
router.get('/bulk', async(req,res)=>{
   let filter = req.query.filter || " ";
   const users = await User.find({
    $or: [{
        firstName: {
            "$regex": filter
        }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })
    // console.log(users)
    res.status(200).json({users});
})




module.exports = router;