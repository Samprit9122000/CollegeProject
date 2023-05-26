import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    otp:
    {
        type:String,
        require:true
    }
})

const OTPSchema = mongoose.model("otpSchema",otpSchema);
export default OTPSchema;