import express from 'express';
const router = express.Router();


import OTP from '../controllers/otp.js';
router.use('/otp',OTP);


export default router;
