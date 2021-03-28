import { Router } from "express";
import { userController } from "../controllers/user";
import { userValidator } from "../validators/user";

const userRouter: Router = Router();

userRouter.get(
    "/",
    userValidator("GET /users"),
    userController.getall
);

userRouter.get(
    "/:userId",
    userValidator("GET /users/:userId"),
    userController.show
);

userRouter.put(
    "/:userId",
    userValidator("PUT /users/:userId"),
    userController.update
);

userRouter.put(
    "/connectToProjects/:projectId",
    // userValidator("PUT /users/connectToProjects"),
    userController.connectToProjects
);

userRouter.delete(
    "/:userId",
    userValidator("DELETE /users/:userId"),
    userController.delete
);

export {userRouter};