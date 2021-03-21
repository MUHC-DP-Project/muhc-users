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
    "/verifyEmail",
    authValidator('GET /verifyEmail'),
    userAuthController.verifyEmail
);

userAuthRouter.get(
    "/approveUser",
    authValidator('GET /approveUser'),
    userAuthController.approveUser
)

export { userAuthRouter };