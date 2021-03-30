// todo: add validation

import { Router } from "express";
import { userAuthController } from '../controllers/userAuth';
import { authValidator } from "../validators/auth";

const userAuthRouter: Router = Router();

userAuthRouter.post(
    "/signUp",
    authValidator('POST /signUp'),
    userAuthController.signUp
);

userAuthRouter.post(
    "/signIn",
    authValidator('POST /signIn'),
    userAuthController.signIn
);

userAuthRouter.get(
    "/verifyEmail/:jwtToken",
    authValidator('GET /verifyEmail'),
    userAuthController.verifyEmail
);

userAuthRouter.get(
    "/approveUser/:jwtToken",
    authValidator('GET /approveUser'),
    userAuthController.approveUser
);

userAuthRouter.post(
    "/passwordReset",
    authValidator('POST /passwordReset'),
    userAuthController.resetPassword
);

userAuthRouter.post(
    "/forgotPassword",
    authValidator('POST /forgotPassword'),
    userAuthController.forgotPassword
);

userAuthRouter.get(
    "/forgotPasswordApproval/:jwtToken",
    authValidator('GET /forgotPasswordApproval'),
    userAuthController.forgotPasswordApproval
)

export { userAuthRouter };