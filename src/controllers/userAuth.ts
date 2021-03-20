import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { IUserModel } from "../database/models/Users";
import { userDBInteractions } from "../database/interactions/user";
import { errorMessage } from "../config/errorFormatter";
import { IUser } from "../interfaces/IUser";import hashPassword from "../utils/password-hash";
import { statusCodes } from "../config/statusCodes";
import {jwt} from 'jsonwebtoken';
import {sendVerifyEmail, sendApprovalEmail} from '../services/email-sender';

const userAuthController = {
    signUp: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: there are missing parameters.`
                }
            );
        } else {
            try {

                const user = req.body;

                // HERE IS WHERE WE PROCESS INPUT AND CONVERT INTO OBJECT
                const userData: IUser = {
                    ...user
                };

                // hash password
                userData.password = await hashPassword(userData.password);

                // create user and get _id
                const newUser: IUserModel = await userDBInteractions.create(
                    userData
                );

                const id = newUser._id.toString();

                // token
                const token = jwt.sign({_id : id, isApproved: false, isEmailVerified: false}, process.env.JWT_SECRET, {algorithm: 'HS256', expiresIn: '5d'});

                sendVerifyEmail(newUser);
                sendApprovalEmail(newUser);

                res.status(200).json({
                    user : newUser,
                    token
                });
            }
            catch (error) {
                res.status(statusCodes.SERVER_ERROR).json(error);
            }
        }

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
