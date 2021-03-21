import { body, param, ValidationChain, CustomValidator } from "express-validator/check";

export function authValidator(method: string): ValidationChain[] {
    switch (method) {
        case "GET /verifyEmail": {
            return [body("jwtToken", "Invalid or missing 'jwtToken'").isString()];
        }
        case "GET /approveUser": {
            return [body("jwtToken", "Invalid or missing 'jwtToken'").isString()];
        }
        case "POST /signUp": {
            return [
                    body("email", "Invalid or missing 'email'").isString(),
                    body("password", "Invalid or missing 'password'").isString()
                ];
        }
        case "POST /signIn": {
            return [
                body("email", "Invalid or missing 'email'").isString(),
                body("password", "Invalid or missing 'password'").isString(),
            ];
        }
    }
}