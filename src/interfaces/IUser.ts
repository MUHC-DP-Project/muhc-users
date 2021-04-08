export interface IUser {

    // auth
    password:string;
    isApproved: boolean;
    isEmailVerified: boolean;
    email: string;
    verificationNotes: string;
    userRole: string,


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

    PIListOfProjects: [{type: string}];
    CoIListOfProjects: [{type: string}];
    ColListOfProjects: [{type: string}];

    // submit
    levelOfResearch:string;
    motivationForJoining:string[];
    foundAboutUs:string[];

    // T&C
    acceptedTermsAndConditions:boolean;

}