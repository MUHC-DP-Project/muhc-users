import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { IUserModel } from "../database/models/Users";
import { userDBInteractions } from "../database/interactions/user";
import { IUser } from "../interfaces/IUser";
import {hashPassword, compareHash } from "../utils/password-hash";
import { statusCodes } from "../config/statusCodes";
import jwt from 'jsonwebtoken';
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

                const userInDb: IUserModel = await userDBInteractions.findByEmail(
                    user.email
                );

                if (userInDb != null){
                    throw new Error("User already exists!");
                }

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

                sendVerifyEmail(newUser);
                sendApprovalEmail(newUser);

                res.status(200).json(newUser);
            }
            catch (error) {
                res.status(statusCodes.SERVER_ERROR).json(error);
            }
        }

    },

    signIn: async (req: Request, res: Response) => {
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

                const userInfo = req.body;

                // get user by email
                const user: IUserModel = await userDBInteractions.findByEmail(
                    userInfo.email
                );

                if(user == null){
                    throw new Error("User email is not found in system.")
                }

                const passwordHash = user.password;

                // compare hash password
                // TODO WE CAN SIGN IN WITHOUT THE RIGHT PASSWORD. THIS THROWS AN EXCEPTION
                const isCorrectPassword = await compareHash(userInfo.password, passwordHash);

                if(!isCorrectPassword){
                    throw new Error("Incorrect Password")
                }

                // generate session token
                const token = jwt.sign({_id : user._id.toString(), isApproved: user.isApproved, isEmailVerified: user.isEmailVerified}, process.env.JWT_SECRET, {algorithm: 'HS256', expiresIn: '2d'});

                res.status(200).json({
                    user,
                    token
                });
            }
            catch (error) {
                res.status(statusCodes.SERVER_ERROR).json(error);
            }
        }
    },

    approveUser: async (req: Request, res: Response) => {
        const approvedHtml = '<h1>This user has been approved. You may close this window</h1>'

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: there are missing parameters.`
                }
            );
        } else {
            const jwtToken = req.params.jwtToken;

            jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, decoded) => {
                if (err || decoded.type !== "approve") {
                    res.status(statusCodes.BAD_REQUEST).json(
                        {
                            status: 422,
                            message: err
                        }
                    );
                } else {
                    let userData : IUser;
                    const userId = decoded._id;
                    try {
                        userData = await userDBInteractions.find(userId);
                        userData.isApproved = true;
                        await userDBInteractions.update(userId, userData);
                        res.status(statusCodes.SUCCESS).send(approvedHtml);
                    } catch (error) {
                        res.status(statusCodes.SERVER_ERROR).json(error);
                    }
                }
            });
        }
    },

    verifyEmail: async (req: Request, res: Response) => {
        const verifiedHtml = '<h1>You have been verified! You may close this window.</h1>'

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: there are missing parameters.`
                }
            );
        } else {
            const jwtToken = req.params.jwtToken;

            jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, decoded) => {
                if (err || decoded.type !== "verify") {
                    res.status(statusCodes.BAD_REQUEST).json(
                        {
                            status: 422,
                            message: err
                        }
                    );
                } else {
                    let userData : IUser;
                    const userId = decoded._id;
                    try {
                        userData = await userDBInteractions.find(userId);
                        userData.isEmailVerified = true;
                        await userDBInteractions.update(userId, userData);
                        res.status(statusCodes.SUCCESS).send(verifiedHtml);
                    } catch (error) {
                        res.status(statusCodes.SERVER_ERROR).json(error);
                    }
                }
            });
        }
    }
}

export { userAuthController };