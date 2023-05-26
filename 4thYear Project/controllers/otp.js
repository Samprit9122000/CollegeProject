import express from 'express';
const router = express.Router()

import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import otpSchema from '../models/otpModel.js';
import userSchema from '../models/userModel.js';

router.post('/otprequest',async(req,res)=>{
    const email= req.body.email;
    console.log("Email:",email)
    const chkemail=await userSchema.findOne({ email});

    if(!chkemail)
        return res.status(200).json({ msg: "Email doesn't exist !!",status:400});

    var transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'sampritm67@gmail.com',
            pass:"blvdwodzborucaie"
        }
    });
    var OTP=otpGenerator.generate(6, { upperCase: true, specialChars: true ,alphabets :false,digits:true});
    var newdata=new otpSchema({
        "email":email,
        "otp":OTP
    });

    var mailOptions={
        from:"sampritm67@gmail.com",
        to:email,    
        subject:"MyShop Furniture : Your One Time Otp ",
        text:"Order Placing Otp is Shared to you. Your One Time 6 digit OTP is : [  "+OTP+"  ]"
    };

    var findemail=await otpSchema.findOne({ "email" : email});
    if(findemail)
    {
        await otpSchema.updateOne({ "email" : email},{ $set :{ "otp" : OTP}}).then(()=>{
            transporter.sendMail(mailOptions,function(error,info){
                if(error) {
                    console.log(error);
                    return res.status(200).json({ msg: "Email not sent !! ",status:400 })
                }
                else return res.status(200).json({ msg :"Email sent !! check OTP ..",status:200 })
                
            })
        }).catch(err=>{
            return res.status(200).json({ msg : err, status :400})
        })
    }
    else
    {
        await newdata.save().then(()=>{
            transporter.sendMail(mailOptions,function(error,info){
                if(error) return res.status(200).json({ msg: "Email not sent !! ",status:400 })
                else return res.status(200).json({ msg :"Email sent !! check OTP ..",status:200 })
                
            })
     
        }).catch(err=>{
         return res.status(200).json({ msg : err, status :400})
        })
    }
   


});

router.post('/validateotp',async(req,res)=>{
    const {otp,email}=req.body;
    const findemail=await otpSchema.findOne({ email});

    if(!findemail)
        return res.status(200).json({ msg:'Email not found !!',status:422});
    const chkotpvalid=await otpSchema.findOne({ email,otp});
    if(chkotpvalid)
        return res.status(200).json({ msg:'Otp Matched !!',status: 200});
    else
        return res.status(200).json({ msg:'OTP mismatch !!',status: 422});

});





export default router;