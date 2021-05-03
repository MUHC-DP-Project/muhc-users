import { request, Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { IUserModel } from "../database/models/Users";
import { userDBInteractions } from "../database/interactions/user";
import { IUser } from "../interfaces/IUser";
import {hashPassword, compareHash } from "../utils/password-hash";
import { statusCodes } from "../config/statusCodes";
import jwt from 'jsonwebtoken';
import {sendVerifyEmail, sendApprovalEmail, sendForgotPasswordEmail, isApprovedEmail} from '../services/email-sender';

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
                    res.status(statusCodes.SERVER_ERROR).json(
                        {
                            status: statusCodes.SERVER_ERROR,
                            message: "User email already exists!"
                        }
                    );
                    return;
                }

                // HERE IS WHERE WE PROCESS INPUT AND CONVERT INTO OBJECT
                const userData: IUser = {
                    ...user
                };

                // hash password
                userData.password = await hashPassword(userData.password);
                userData.isApproved = false;
                userData.isEmailVerified = false;
                const isPreApproved = isApprovedEmail(userData);

                // create user and get _id
                const newUser: IUserModel = await userDBInteractions.create(
                    userData
                );

                if(!isPreApproved){
                    sendApprovalEmail(newUser);
                }
                sendVerifyEmail(newUser);

                const {password, ...newUserWithoutPassword} = newUser.toJSON();

                res.status(200).json(newUserWithoutPassword);
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
                    res.status(statusCodes.SERVER_ERROR).json(
                        {
                            status: statusCodes.SERVER_ERROR,
                            message: "User email is not found in system."
                        }
                    );
                    return;
                }

                const passwordHash = user.password;

                // compare hash password
                // TODO WE CAN SIGN IN WITHOUT THE RIGHT PASSWORD. THIS THROWS AN EXCEPTION
                const isCorrectPassword = await compareHash(userInfo.password, passwordHash);

                if(!isCorrectPassword){
                    res.status(statusCodes.SERVER_ERROR).json(
                        {
                            status: statusCodes.SERVER_ERROR,
                            message: "Incorrect password"
                        }
                    );
                    return;
                }
                // generate session token
                const token = jwt.sign({_id : user._id.toString(), isApproved: user.isApproved, isEmailVerified: user.isEmailVerified}, process.env.JWT_SECRET, {algorithm: 'HS256', expiresIn: '2d'});
                user.password = undefined;

                res.status(200).json({
                    user,
                    token,
                    expiresIn: '2d'
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
    localApproveUser:async (req: Request,res:Response)=>{
        const errors=validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: there are missing parameters.`
                }
            );
        }else{
            const userId=req.params.userId;
            let userData : IUser;
            try {
                userData = await userDBInteractions.find(userId);
                userData.isApproved = true;
                await userDBInteractions.update(userId, userData);
                res.status(statusCodes.SUCCESS).send();
            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).json(error);
            }

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
    },

    resetPassword: async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: there are missing parameters.`
                }
            );
        } else {
            const oldPassword = req.body.oldPassword;
            const newPassword = req.body.newPassword;
            const jwtToken = req.headers?.authorization.split(" ")[1];

            jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    res.status(statusCodes.BAD_REQUEST).json(
                        {
                            status: 422,
                            message: err
                        }
                    );
                } else {
                    let userData : IUserModel;
                    const userId = decoded._id;
                    try {
                        userData = await userDBInteractions.findWithPassword(userId);
                        const result = await compareHash(oldPassword, userData.password);;
                        if (!result) {
                            throw { "error" : "Wrong old password" };
                        }
                        userData.password = await hashPassword(newPassword);
                        await userDBInteractions.update(userId, userData);
                        res.status(statusCodes.SUCCESS).send();
                    } catch (error) {
                        console.log(error);
                        res.status(statusCodes.SERVER_ERROR).json(error);
                    }
                }
            });
        }
    },

    forgotPassword: async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: there are missing parameters.`
                }
            );
        } else {
            const email = req.body.email;
            let user : IUserModel;

            try {
                user = await userDBInteractions.findByEmail(email);

                if(user == null) {
                    res.status(statusCodes.SERVER_ERROR).json(
                        {
                            status: statusCodes.SERVER_ERROR,
                            message: "User email is not found in system."
                        }
                    );
                    return;
                }

                sendForgotPasswordEmail(user);
                res.status(statusCodes.SUCCESS).send("Message sent");

            } catch (error) {
                console.log(error);
                res.status(statusCodes.SERVER_ERROR).json(error);
            }
        }
    },

    forgotPasswordApproval: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        const html = '<h1>Your password has been changed</h1>'

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
                if (err) {
                    res.status(statusCodes.BAD_REQUEST).json(
                        {
                            status: 422,
                            message: err
                        }
                    );
                } else {
                    try {
                        if (decoded.type !== "forgotPassword") {
                            throw {"error" : "Wrong jwtToken"};
                        }
                        const userData : IUserModel = await userDBInteractions.findWithPassword(decoded._id);
                        userData.password = await hashPassword(decoded.newPassword);
                        await userDBInteractions.update(decoded._id, userData);

                        res.status(statusCodes.SUCCESS).send(html);
                    } catch (error) {
                        res.status(statusCodes.SERVER_ERROR).json(error);
                    }

                }
            });
        }
    },

    refreshToken : async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: there are missing parameters.`
                }
            );
        } else {
            const jwtToken = req.headers?.authorization.split(" ")[1];

            jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, _decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET, {ignoreExpiration: true} );
                        const newToken = jwt.sign({_id : payload._id, isApproved: payload.isApproved, isEmailVerified: payload.isEmailVerified}, process.env.JWT_SECRET, {algorithm: 'HS256', expiresIn: '2d'});
                        res.status(statusCodes.SUCCESS).json({jwtToken: newToken});
                    } else {
                        res.status(statusCodes.BAD_REQUEST).json(
                            {
                                status: 422,
                                message: err
                            }
                        );
                    }
                } else {
                    res.status(statusCodes.SUCCESS).json({jwtToken})
                }
            });
        }
    }
}

export { userAuthController };
