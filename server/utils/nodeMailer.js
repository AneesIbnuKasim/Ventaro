
const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("./logger");

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
// send email for verification
const sendOtpEmail = async(name='User', email, otp)=>{
    console.log('email:',config.EMAIL);
    console.log('user email:',email)
    console.log('otp:',otp);
    console.log('password:',config.APP_PASSWORD)
    
    
    try {
        const mailOptions =
        {
            from: '"Ventaro" <config.EMAIL>',
            to: email,
            subject: "Email verification",
            text: "Hello world?", // plain‑text body
            html: `<b>hello ${name}! please click on the link below and enter OTP to verify 
            <a href=http://localhost:3000/api/auth/user/verify-account>Verify Email</a><br><br><br>
            <h1>${otp}</h1>
            </b>`, // HTML body
          }
     
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            logger.error('OTP email sending failed')
            
        }
        else logger.info("Email has been sent",info.response)
      });
    } catch (error) {
        logger.error('catch:',error.message)
    }
}

module.exports = {
  sendOtpEmail
}