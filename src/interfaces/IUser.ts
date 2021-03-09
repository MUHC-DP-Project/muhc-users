export interface IUser {
    // account
    userId:string;
    userPassword:string;
    // profile
    salutation:string;
    firstName:string;
    lastName:string;
    credentialsQualifications:string;
    gender:string;
    communicationSelect:string;
    communicationTextfield:string;
    principalUniversityAffiliation:string;
    principalClinic:string;
    secondaryClinic:string;

    // research&interests
    professionalOccupation:string;
    workStatus:string;
    role:string;
    researchInterests:string[];

    // submit
    levelOfResearch:string;
    motivationForJoining:string[];
    foundAboutUs:string[];

    // T&C
    acceptedTermsAndConditions:boolean;

}