// todo: add validation

import { Router } from "express";
import { userAuthController } from '../controllers/userAuth';
import { userValidator } from "../validators/user";

const userAuthRouter: Router = Router();

userAuthRouter.post(
    "/signUp",
    userAuthController.signUp
);

userAuthRouter.post(
    "/signIn",
    userAuthController.signIn
);

export { userAuthRouter };