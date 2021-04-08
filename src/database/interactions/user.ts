import { IUser } from "../../interfaces/IUser";
import { User, IUserModel } from "../models/Users";

export const userDBInteractions = {
    // TODO: remove password
    create: (user: IUser): Promise<IUserModel> => {
        return User.create(user);
    },

    all: (): Promise<IUserModel[]> => {
        return User.find().sort({ createdAt: -1 }).exec();
    },

    find: (userId: string): Promise<IUserModel> => {
        return User.findOne({ _id : userId }).exec();
    },

    findWithPassword: (userId: string): Promise<IUserModel> => {
        return User.findOne({ _id : userId }).select('+password').exec();
    },

    findByEmail: (userEmail: string): Promise<IUserModel> => {
        return User.findOne({ email : userEmail }).select('+password').exec();
    },

    // todo: remove password
    update: (
        userId: string,
        newUser: IUser
    ): Promise<IUserModel> => {
        return User.findByIdAndUpdate(userId, newUser, {
            new: true
        }).exec();
    },

    linkProject: (
        userEmail: string,
        projectId: string,
        connectionType: string,

    ): Promise<IUserModel> => {
        console.log(userEmail + " " + projectId + " " + [connectionType]);
        return User.findOneAndUpdate(
            { email: userEmail},
            { $addToSet: { [connectionType]: projectId }}, {new : true}).exec();
    },

    removeProjectFromArray: (
        userEmail: string,
        projectId: string,
        connectionType: string,
        
    ) : Promise<{ ok: number; n: number; nModified: number; }> => {
        const toRemove = {};
        toRemove[connectionType] = [projectId]
        return User.updateOne({email: userEmail}, {$pullAll: toRemove}).exec();
    }

}