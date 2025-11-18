const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("./logger");
const otpGenerator = require('otp-generator')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587, // or 587
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.EMAIL,
    pass: config.APP_PASSWORD
  },
})

const generateOtp = (userData)=>{
      if (!userData) {
        throw new Error('User data is missing for OTP generation')
      }
       const otp = otpGenerator.generate(6,{
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false
       })
       const otpExp = Date.now()+30*60*1000
       return {
        code: otp,
        expiresAt: otpExp
  }
}

// send email for verification
const sendOtpEmail = (userId, name, email, otp)=>{
    try {
        const mailOptions =
        {
            from: '"Ventaro" <config.EMAIL>',
            to: email,
            subject: "Email verification",
            text: "Hello world?", // plain‑text body
            html: `<b>hello ${name}! please click on the link below and enter OTP to verify 
            <a href=http://localhost:3000/api/auth/user/verify-account?userId=${userId}>Verify Email</a><br><br><br>
            <h1>${otp}</h1>
            </b>`, // HTML body
          }
     
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            logger.error('OTP email sending failed')
            throw error
        }
        else {
          logger.info("Email has been sent",info.response)
        }
      });
    } catch (error) {
        logger.error('catch:',error.message)
        throw error
    }
}

module.exports = {
  generateOtp,
  sendOtpEmail
}