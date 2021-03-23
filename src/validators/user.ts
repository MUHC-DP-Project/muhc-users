import { body, param, ValidationChain } from "express-validator/check";

// TODO: add validation for signUp call, signIn, etc.
export function userValidator(method: string): ValidationChain[] {
    switch (method) {
        case "GET /users": {
            return [];
        }
        case "GET /users/:userId": {
            return [
                param("userId", "Invalid or missing ':userId'").exists()
                .isMongoId()
            ];
        }
        case "POST /users": {
            return [
                body("salutation", "Invalid or missing 'salutation'").isString().optional(),
                body("firstName", "Invalid or missing 'firstName'").isString().optional(),
                body("lastName", "Invalid or missing 'lastName'").isString().optional(),
                body("credentialsQualifications", "Invalid or missing 'credentialsQualifications'").isString().optional(),
                body("gender", "Invalid or missing 'gender'").isString().optional(),
                body("communicationSelect", "Invalid or missing 'communicationSelect'").isString().optional(),
                body("communicationTextfield", "Invalid or missing 'communicationTextfield'").isString().optional(),
                body("principalUniversityAffiliation", "Invalid or missing 'principalUniversityAffiliation'").isString(),
                body("principalClinic", "Invalid or missing 'principalClinic'").isString().optional(),
                body("secondaryClinic", "Missing 'secondaryClinic'").isString().optional(),
                body("professionalOccupation", "Missing 'professionalOccupation'").isString().optional(),
                body("workStatus", "Missing 'workStatus'").isString().optional(),
                body("role", "Missing 'role'").isString().optional(),
                body("researchInterests", "Missing 'researchInterests'").isArray().optional(),
                body("levelOfResearch", "Missing 'levelOfResearch'").isString().optional(),
                body("motivationForJoining", "Missing 'motivationForJoining'").isArray().optional(),
                body("foundAboutUs", "Missing 'foundAboutUs'").isArray().optional(),
            ];
        }

        case "PUT /users/:userId": {
            return [
                param("userId", "Invalid or missing ':userId'")
                    .exists()
                    .isMongoId(),
                body("salutation", "Invalid or missing 'salutation'").isString().optional(),
                body("firstName", "Invalid or missing 'firstName'").isString().optional(),
                body("lastName", "Invalid or missing 'lastName'").isString().optional(),
                body("credentialsQualifications", "Invalid or missing 'credentialsQualifications'").isString().optional(),
                body("gender", "Invalid or missing 'gender'").isString().optional(),
                body("communicationSelect", "Invalid or missing 'communicationSelect'").isString().optional(),
                body("communicationTextfield", "Invalid or missing 'communicationTextfield'").isString().optional(),
                body("principalUniversityAffiliation", "Invalid or missing 'principalUniversityAffiliation'").isString(),
                body("principalClinic", "Invalid or missing 'principalClinic'").isString().optional(),
                body("secondaryClinic", "Missing 'secondaryClinic'").isString().optional(),
                body("professionalOccupation", "Missing 'professionalOccupation'").isString().optional(),
                body("workStatus", "Missing 'workStatus'").isString().optional(),
                body("role", "Missing 'role'").isString().optional(),
                body("researchInterests", "Missing 'researchInterests'").isArray().optional(),
                body("levelOfResearch", "Missing 'levelOfResearch'").isString().optional(),
                body("motivationForJoining", "Missing 'motivationForJoining'").isArray().optional(),
                body("foundAboutUs", "Missing 'foundAboutUs'").isArray().optional(),
                body("acceptedTermsAndConditions", "Missing 'acceptedTermsAndConditions'").isBoolean(),
                body("userPassword", "Missing 'userPassword'").isString().optional(),
            ];
        }

        case "DELETE /users/:userId": {
            return [
                param("userId", "Invalid or missing ':userId'")
                    .exists()
                    .isMongoId()
            ];
        }
    }
}