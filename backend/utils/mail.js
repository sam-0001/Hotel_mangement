import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendOtpMail=async (to,otp) => {
    try {
        console.log(`[DEV] Password Reset OTP for ${to}: ${otp}`);
        if (!process.env.EMAIL || !process.env.PASS) return;
        await transporter.sendMail({
            from:process.env.EMAIL,
            to,
            subject:"Reset Your Password",
            html:`<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
        })
    } catch(err) {
        console.log("Error sending email:", err.message);
    }
}


export const sendDeliveryOtpMail=async (user,otp) => {
    try {
        console.log(`[DEV] Delivery OTP for ${user.email}: ${otp}`);
        if (!process.env.EMAIL || !process.env.PASS) return;
        await transporter.sendMail({
            from:process.env.EMAIL,
            to:user.email,
            subject:"Delivery OTP",
            html:`<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`
        })
    } catch (err) {
        console.log("Error sending email:", err.message);
    }
}
