import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { userController } from "../controllers/user";
import { userValidator } from "../validators/user";

const userRouter: Router = Router();

userRouter.get(
    "/",
    authMiddleware,
    userValidator("GET /users"),
    userController.getall
);

userRouter.get(
    "/:userId",
    authMiddleware,
    userValidator("GET /users/:userId"),
    userController.show
);

userRouter.put(
    "/:userId",
    authMiddleware,
    userValidator("PUT /users/:userId"),
    userController.update
);

userRouter.put(
    "/connectToProjects/:projectId/:ownerEmail",
    userValidator("PUT /users/connectToProjects"),
    userController.connectToProjects
);

userRouter.delete(
    "/:userId",
    authMiddleware,
    userValidator("DELETE /users/:userId"),
    userController.delete
);

export {userRouter};