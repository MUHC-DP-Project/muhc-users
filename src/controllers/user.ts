 import { Request, Response } from "express";
import { validationResult } from "express-validator/check";
import { IUserModel } from "../database/models/Users";
import { statusCodes } from "../config/statusCodes";
import { userDBInteractions } from "../database/interactions/user";
import { errorMessage } from "../config/errorFormatter";
import { IUser } from "../interfaces/IUser";
import { v1 as uuidv1 } from "uuid";

const userController = {
    getall: async (req: Request, res: Response) => {
        try {
            const users = await userDBInteractions.all();
            res.status(statusCodes.SUCCESS).json(users);
        } catch (err) {
            res.status(statusCodes.SERVER_ERROR).json(err);
        }
    },

    show: async (req: Request, res: Response) => {
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
                const { userId } = req.params;

                const user: IUserModel = await userDBInteractions.find(
                    userId
                );

                user
                    ? res.status(statusCodes.SUCCESS).json(user)
                    : res.status(statusCodes.NOT_FOUND).json({
                          status: statusCodes.NOT_FOUND,
                          message: "Problem not found"
                      });

            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).json(error);
            }
        }
    },

    update: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: updating was done incorrectly.`
                }
            );
        } else {
            try {
                const { userId } = req.params;
                const user: IUserModel = await userDBInteractions.find(userId);

                if(!user)
                    res.status(statusCodes.NOT_FOUND).json({
                        status: statusCodes.NOT_FOUND,
                        message: "User not found"
                    });
                else{
                    const updatedUserBody: IUser = {
                        ...req.body,
                    };

                    const updatedUser: IUserModel = await userDBInteractions.update(
                        userId,
                        updatedUserBody
                    );

                    const {password, ...updatedUserWithoutPassword} = updatedUser.toJSON();

                    res.status(statusCodes.SUCCESS).json(updatedUserWithoutPassword);

                }
            } catch (error) {
                res.status(statusCodes.SERVER_ERROR).json(error);
            }
        }
    },

    delete: async (req: Request, res: Response) => {
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

                if (res.locals._id !== req.params.userId) {
                    let message = undefined;
                    const userOfRequest : IUserModel = await userDBInteractions.find(res.locals._id);
                    if(!userOfRequest) {
                       message = "User that performed the request is not found";
                    } else if (userOfRequest.) {

                    }
                    
                }
                const user = await userDBInteractions.find(req.params.userId);
                if (!user) {
                    res.status(statusCodes.NOT_FOUND).json(
                        {
                            status: statusCodes.NOT_FOUND,
                            message: "User not found"
                        }
                    );
                }
                user.delete();
                res.status(statusCodes.SUCCESS).send();
            } catch(err) {
                res.status(statusCodes.SERVER_ERROR).send(err);
            }

        }
    },

    connectToProjects: async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(statusCodes.MISSING_PARAMS).json(
                {
                    status: 422,
                    message: `Error: Connecting users to projects was done incorrectly.`
                }
            );
        } else {
            try{
                const projectId = req.params.projectId;
                const pIListOfProjects = req.body.PIListOfProjects;
                const coIListOfProjects = req.body.CoIListOfProjects;
                const colListOfProjects = req.body.ColListOfProjects;

                const piList = pIListOfProjects.map(
                    (x) => { return userDBInteractions.linkProject(x, projectId, "PIListOfProjects")}
                );

                const coList = coIListOfProjects.map(
                    (x) => { return userDBInteractions.linkProject(x, projectId, "CoIListOfProjects")}
                );

                const colList = colListOfProjects.map(
                    (x) => { return userDBInteractions.linkProject(x, projectId, "ColListOfProjects")}
                );

                await Promise.all(piList + coList + colList);

                res.status(statusCodes.SUCCESS).send();

            }catch(err){
                res.status(statusCodes.SERVER_ERROR).send(err);
            }

        }
    }
};
export { userController };