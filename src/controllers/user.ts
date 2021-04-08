import {Request, Response} from "express";
import {validationResult} from "express-validator/check";
import {IUserModel} from "../database/models/Users";
import {statusCodes} from "../config/statusCodes";
import {userDBInteractions} from "../database/interactions/user";
import {errorMessage} from "../config/errorFormatter";
import {IUser} from "../interfaces/IUser";
import {v1 as uuidv1} from "uuid";

const userController = {

    healthcheck: async (req: Request, res: Response) => {
        res.status(200).send("Success");
    },

    getall: async (req: Request, res: Response) => {

        try {
            const users = await userDBInteractions.all();
            res
                .status(statusCodes.SUCCESS)
                .json(users);
        } catch (err) {
            res
                .status(statusCodes.SERVER_ERROR)
                .json(err);
        }
    },

    getallbyemail: async (req : Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res
                .status(statusCodes.MISSING_PARAMS)
                .json({status: 422, message: `Error: there are missing parameters.`});
        } else {
            try {
                const emails = req.body.emails;

                const userIds = await Promise.all(emails.map(async (email) =>
                    userDBInteractions.findByEmail(email).then((user) => {
                        return user._id;
                    })
                ));

                res.status(statusCodes.SUCCESS).json(userIds);
            } catch (err) {
                res.status(statusCodes.SERVER_ERROR).json(err);
            }
        }
    },

    show: async(req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res
                .status(statusCodes.MISSING_PARAMS)
                .json({status: 422, message: `Error: there are missing parameters.`});
        } else {
            try {
                const {userId} = req.params;

                const user : IUserModel = await userDBInteractions.find(userId);

                user
                    ? res
                        .status(statusCodes.SUCCESS)
                        .json(user)
                    : res
                        .status(statusCodes.NOT_FOUND)
                        .json({status: statusCodes.NOT_FOUND, message: "Problem not found"});

            } catch (error) {
                res
                    .status(statusCodes.SERVER_ERROR)
                    .json(error);
            }
        }
    },

    update: async(req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res
                .status(statusCodes.MISSING_PARAMS)
                .json({status: 422, message: `Error: updating was done incorrectly.`});
        } else {
            try {
                const {userId} = req.params;
                const user : IUserModel = await userDBInteractions.find(userId);

                if (!user)
                    res.status(statusCodes.NOT_FOUND).json({status: statusCodes.NOT_FOUND, message: "User not found"});
                else {
                    const updatedUserBody : IUser = {
                        ...req.body
                    };

                    const updatedUser : IUserModel = await userDBInteractions.update(userId, updatedUserBody);

                    const {
                        password,
                        ...updatedUserWithoutPassword
                    } = updatedUser.toJSON();

                    res
                        .status(statusCodes.SUCCESS)
                        .json(updatedUserWithoutPassword);

                }
            } catch (error) {
                res
                    .status(statusCodes.SERVER_ERROR)
                    .json(error);
            }
        }
    },

    delete: async(req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res
                .status(statusCodes.MISSING_PARAMS)
                .json({status: 422, message: `Error: there are missing parameters.`});
        } else {
            try {
                const user : IUserModel= await userDBInteractions.find(req.params.userId);
                if (!user) {
                    res
                        .status(statusCodes.NOT_FOUND)
                        .json({status: statusCodes.NOT_FOUND, message: "User not found"});
                }
                const projectListOfUser = {
                    PIListOfProjects: user.PIListOfProjects || [],
                    CoIListOfProjects: user.CoIListOfProjects || [],
                    ColListOfProjects: user.ColListOfProjects || []
                };

                user.delete();
                res.status(statusCodes.SUCCESS).json(projectListOfUser);
            } catch(err) {
                res.status(statusCodes.SERVER_ERROR).send(err);
            }

        }
    },
    setPrivileges: async(req : Request, res : Response) => {
        const errors = validationResult(req);
        const allowedUserRoles = ['User', 'Admin', 'ClinicManager'];
        if (!errors.isEmpty()) {
            res
                .status(statusCodes.MISSING_PARAMS)
                .json({status: 422, message: "Missing Parameters"});
        } else {
            const userRole = req.body.userRole || 'Admin';
            const userId = req.body.userId;


            try {
                const resquester : IUserModel = await userDBInteractions.find(res.locals._id);
                if(!allowedUserRoles.includes(userRole)) {
                    throw new Error('User role you are trying to set is invalid');
                } else if(!resquester || resquester.userRole !== 'Admin') {
                    throw new Error('Invalid Permission');
                }
                const user : IUserModel= await userDBInteractions.find(userId);

                if(!user) {
                    throw new Error('User not found');
                }

                user.userRole = userRole;
                await userDBInteractions.update(userId, user);
            } catch (err) {
                res
                    .status(statusCodes.SERVER_ERROR)
                    .send(err.message);
            }

            res.status(statusCodes.SUCCESS).send();
        }
    },
    connectToProjects: async(req : Request, res : Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res
                .status(statusCodes.MISSING_PARAMS)
                .json({status: 422, message: `Error: Connecting users to projects was done incorrectly.`});
        } else {
            try {
                const projectId = req.params.projectId;
                const ownerEmail = req.params.ownerEmail;
                const pIListOfProjects = req.body.PIListOfProjects;
                const coIListOfProjects = req.body.CoIListOfProjects;
                const colListOfProjects = req.body.ColListOfProjects;

                const userProjectList= userDBInteractions.linkProject(ownerEmail, projectId, "userListOfProjects");

                const piList = pIListOfProjects.map((x) => {
                    return userDBInteractions.linkProject(x, projectId, "PIListOfProjects")
                });

                const coList = coIListOfProjects.map((x) => {
                    return userDBInteractions.linkProject(x, projectId, "CoIListOfProjects")
                });

                const colList = colListOfProjects.map((x) => {
                    return userDBInteractions.linkProject(x, projectId, "ColListOfProjects")
                });

                await Promise.all(userProjectList+piList + coList + colList);

                res
                    .status(statusCodes.SUCCESS)
                    .send();

            } catch (err) {
                res
                    .status(statusCodes.SERVER_ERROR)
                    .send(err);
            }

        }
    },
    setPrivileges: async(req : Request, res : Response) => {
        const errors = validationResult(req);
        const allowedUserRoles = ['User', 'Admin', 'ClinicManager'];
        if (!errors.isEmpty()) {
            res
                .status(statusCodes.MISSING_PARAMS)
                .json({status: 422, message: "Missing Parameters"});
        } else {
            const userRole = req.body.userRole || 'Admin';
            const userId = req.body.userId;


            try {
                const resquester : IUserModel = await userDBInteractions.find(res.locals._id);
                if(!allowedUserRoles.includes(userRole)) {
                    throw new Error('User role you are trying to set is invalid');
                } else if(!resquester || resquester.userRole !== 'Admin') {
                    throw new Error('Invalid Permission');
                } 
                const user : IUserModel= await userDBInteractions.find(userId);

                if(!user) {
                    throw new Error('User not found');
                }

                user.userRole = userRole;
                await userDBInteractions.update(userId, user);
            } catch (err) {
                res
                    .status(statusCodes.SERVER_ERROR)
                    .send(err.message);
            }

            res.status(statusCodes.SUCCESS).send();
        }
    }
};
export {userController};