import { IUser } from "../../interfaces/IUser";
import { User, IUserModel } from "../models/Users";

export const userDBInteractions = {
    create: (user: IUser): Promise<IUserModel> => {
        return User.create(user);
    },

    all: (): Promise<IUserModel[]> => {
        return User.find().sort({ createdAt: -1 }).exec();
    },

    find: (userId: string): Promise<IUserModel> => {
        return User.findOne({ _id : userId }).exec();
    },

    findByEmail: (userEmail: string): Promise<IUserModel> => {
        return User.findOne({ email : userEmail }).exec();
    },

    update: (
        userId: string,
        newUser: IUser
    ): Promise<IUserModel> => {
        return User.findByIdAndUpdate(userId, newUser, {
            new: true
        }).exec();
    },

}