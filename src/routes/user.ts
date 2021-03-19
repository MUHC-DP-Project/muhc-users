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

// TODO: Remove API to create:
userRouter.post(
    "/",
    userValidator("POST /users"),
    userController.create
);

userRouter.put(
    "/:userId",
    userValidator("PUT /users/:userId"),
    userController.update
);

userRouter.delete(
    "/:userId",
    userValidator("DELETE /users/:userId"),
    userController.delete
);

export {userRouter};