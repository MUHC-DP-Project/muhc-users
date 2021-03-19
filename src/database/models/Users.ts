import { Document, Model, Types, model, Schema } from "mongoose";
import { IUser } from '../../interfaces/IUser';

export interface IUserModel extends IUser, Document {}

const userSchema: Schema = new Schema(
    {
    // profile
    salutation:String,
    firstName:String,
    lastName:String,
    credentialsQualifications:String,
    gender:String,
    communicationSelect:String,
    communicationTextfield:String,
    principalUniversityAffiliation:String,
    principalClinic:String,
    secondaryClinic:String,

    // research&interests
    professionalOccupation:String,
    workStatus:String,
    role:String,
    researchInterests:[{type: String}],

    // submit
    levelOfResearch:String,
    motivationForJoining:[{type: String}],
    foundAboutUs:[{type: String}],

    // T&C
    acceptedTermsAndConditions:Boolean,
    userPassword:String,
    },
    {
        timestamps: true
    }
);

userSchema.index({
    createdAt: 1
});

const User: Model<IUserModel>= model("User",userSchema );

export { User };
