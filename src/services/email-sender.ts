import { IUserModel } from "../database/models/Users";
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pbrnnetwork@gmail.com',
      pass: 'pbrn121212'
    }
  });

const sendVerifyEmail = async (user: IUserModel) => {
    const userEmail = user.email;
    const mailOptions = {
        from: 'pbrnnetwork@gmail.com',
        to: userEmail,
        subject: 'PBRN Email verification',
        text: 'Please verify your email!!'
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