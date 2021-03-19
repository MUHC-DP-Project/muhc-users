import { body, param, ValidationChain } from "express-validator/check";

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
                body("salutation", "Invalid or missing 'salutation'").isString().exists(),
                body("firstName", "Invalid or missing 'firstName'").isString().exists(),
                body("lastName", "Invalid or missing 'lastName'").isString().exists(),
                body("credentialsQualifications", "Invalid or missing 'credentialsQualifications'").isString().exists(),
                body("gender", "Invalid or missing 'gender'").isString().exists(),
                body("communicationSelect", "Invalid or missing 'communicationSelect'").isString().exists(),
                body("communicationTextfield", "Invalid or missing 'communicationTextfield'").isString().exists(),
                body("principalUniversityAffiliation", "Invalid or missing 'principalUniversityAffiliation'").isString(),
                body("principalClinic", "Invalid or missing 'principalClinic'").isString().exists(),
                body("secondaryClinic", "Missing 'secondaryClinic'").isString().exists(),
                body("professionalOccupation", "Missing 'professionalOccupation'").isString().exists(),
                body("workStatus", "Missing 'workStatus'").isString().exists(),
                body("role", "Missing 'role'").isString().exists(),
                body("researchInterests", "Missing 'researchInterests'").isArray().exists(),
                body("levelOfResearch", "Missing 'levelOfResearch'").isString().exists(),
                body("motivationForJoining", "Missing 'motivationForJoining'").isArray().exists(),
                body("foundAboutUs", "Missing 'foundAboutUs'").isArray().exists(),
            ];
        }

        case "PUT /users/:userId": {
            return [
                param("userId", "Invalid or missing ':userId'")
                    .exists()
                    .isMongoId(),
                body("salutation", "Invalid or missing 'salutation'").isString().exists(),
                body("firstName", "Invalid or missing 'firstName'").isString().exists(),
                body("lastName", "Invalid or missing 'lastName'").isString().exists(),
                body("credentialsQualifications", "Invalid or missing 'credentialsQualifications'").isString().exists(),
                body("gender", "Invalid or missing 'gender'").isString().exists(),
                body("communicationSelect", "Invalid or missing 'communicationSelect'").isString().exists(),
                body("communicationTextfield", "Invalid or missing 'communicationTextfield'").isString().exists(),
                body("principalUniversityAffiliation", "Invalid or missing 'principalUniversityAffiliation'").isString(),
                body("principalClinic", "Invalid or missing 'principalClinic'").isString().exists(),
                body("secondaryClinic", "Missing 'secondaryClinic'").isString().exists(),
                body("professionalOccupation", "Missing 'professionalOccupation'").isString().exists(),
                body("workStatus", "Missing 'workStatus'").isString().exists(),
                body("role", "Missing 'role'").isString().exists(),
                body("researchInterests", "Missing 'researchInterests'").isArray().exists(),
                body("levelOfResearch", "Missing 'levelOfResearch'").isString().exists(),
                body("motivationForJoining", "Missing 'motivationForJoining'").isArray().exists(),
                body("foundAboutUs", "Missing 'foundAboutUs'").isArray().exists(),
                body("acceptedTermsAndConditions", "Missing 'acceptedTermsAndConditions'").isBoolean(),
                body("userPassword", "Missing 'userPassword'").isString().exists(),
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