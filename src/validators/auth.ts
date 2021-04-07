import { body, header, param, ValidationChain } from "express-validator/check";

export function authValidator(method: string): ValidationChain[] {
    switch (method) {
        case "GET /verifyEmail": {
            return [param("jwtToken", "Invalid or missing 'jwtToken'").isString().exists()];
        }
        case "GET /approveUser": {
            return [param("jwtToken", "Invalid or missing 'jwtToken'").isString().exists()];
        }
        case "POST /signUp": {
            return [
                body("email", "Invalid or missing 'email'").isString().exists(),
                body("password", "Invalid or missing 'password'").isString().exists(),
                body("firstName", "Invalid or missing firstName").isString().exists(),
                body("lastName", "Invalid or missing lastName").isString().exists(),
                body("verificationNotes", "Invalid or missing verificationNotes").isString().exists(),
            ];
        }
        case "POST /signIn": {
            return [
                body("email", "Invalid or missing 'email'").isString().exists(),
                body("password", "Invalid or missing 'password'").isString().exists(),
            ];
        }
        case "POST /passwordReset": {
            return [
                body("oldPassword", "Invalid or missing 'oldPassword'").isString().exists(),
                body("newPassword", "Invalid or missing 'newPassword'").isString().exists(),
                header("authorization", "Invalid or missing 'authorization'").isString().exists()
            ];
        }
        case "POST /forgotPassword" : {
            return [
                body("email", "Invalid or missing 'email'").isString().exists()
            ];
        }
        case "GET /forgotPasswordApproval" : {
            return [param("jwtToken", "Invalid or missing 'jwtToken'").isString().exists()];
        }

        case 'GET /localApproveUser/:userId':{
            return [param("userId", "Invalid or missing 'userId'").isString().exists()];
        }
        case "POST /refreshToken" : {
            return [header("authorization", "Invalid or missing 'authorization'").isString().exists()];

        }
    }
}
