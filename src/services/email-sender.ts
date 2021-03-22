import { IUserModel } from "../database/models/Users";
import * as nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pbrnnetwork@gmail.com',
      pass: 'pbrn121212'
    }
  });

// go to https://html-online.com/editor/ to generate html for the email
const sendVerifyEmail = async (user: IUserModel) => {
    const userEmail = user.email;

    // generating link for "CLICK HERE" in verification email
    const token = jwt.sign({_id : user._id.toString(), type : "verify"}, process.env.JWT_SECRET, {algorithm: 'HS256', expiresIn: '365d'})
    const verificationLink = "http://localhost:8081/auth/verifyEmail/" + token;
    const verificationHTML = '<h1>Verify your account.</h1> <p>To get started on our platform please verify you account by clicking <a href="' + verificationLink + '">HERE</a>.</p> <p>Thanks,</p> <p>The PBRN team</p>';
    
    const mailOptions = {
        from: 'pbrnnetwork@gmail.com',
        to: userEmail,
        subject: 'PBRN Email verification',
        html: verificationHTML
      };

    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}

function sendApprovalEmail(user: IUserModel) {
    return;
}

export {sendApprovalEmail, sendVerifyEmail};