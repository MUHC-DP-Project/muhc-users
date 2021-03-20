import { Document, Model, Types, model, Schema } from "mongoose";
import { IUser } from '../../interfaces/IUser';
import {bcrypt} from 'bcrypt';

export interface IUserModel extends IUser, Document {
    password: string
}

const userSchema: Schema = new Schema(
    {
    // auth -- required when you first sign up
    email: String, // todo: make sure is unique
    password: {
        type: String,
        select: false
    },
    isApproved: Boolean,
    isEmailVerified: Boolean,
    firstName:String,
    lastName:String,
    professionalOccupation:String,
    verificationNotes: String,

    // additional fields
    salutation:String,
    credentialsQualifications:String,
    gender:String,
    communicationSelect:String,
    communicationTextfield:String,
    principalUniversityAffiliation:String,
    principalClinic:String,
    secondaryClinic:String,

    // research&interests
    workStatus:String,
    role:String,
    researchInterests:[{type: String}],

    // submit
    levelOfResearch:String,
    motivationForJoining:[{type: String}],
    foundAboutUs:[{type: String}],

    // T&C
    acceptedTermsAndConditions:Boolean,
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
