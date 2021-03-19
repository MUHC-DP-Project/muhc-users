import { Request, Response } from "express";
import {sendVerifyEmail, sendApprovalEmail} from '../services/email-sender';

const userAuthController = { 
    signUp: async (req: Request, res: Response) => {
        /*
            --> hash password
            --> create the user and get the _id, 
            --> create a jwt token for 5 days with (user._id)
            --> send emails
        */
       sendVerifyEmail()
       sendApprovalEmail()
    },

    signIn: async (req: Request, res: Response) => {
        /*
            --> hash password
            --> find user with email and password
            --> create the jwt token (user._id, user.isApproved, user.isEmailVerified)
            --> send back token. 
            --> send back user as well.
        */
    },
    
    approveUser: async (req: Request, res: Response) => {
        /*
            --> /approve-user/_id/jwt token
            --> decode jwt token to _id
            --> then update user for .isApproved. 
        */
    }, 

    verifyEmail: async (req: Request, res: Response) => {
        /*
            --> /verify-email/jwt token
            --> decode to _id
            -=> update .isEmailVerified.
        */
    }
}
