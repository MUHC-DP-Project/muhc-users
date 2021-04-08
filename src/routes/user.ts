import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { userController } from "../controllers/user";
import { userValidator } from "../validators/user";

const userRouter: Router = Router();

userRouter.get(
    "/healthcheck",
    userController.healthcheck
);

userRouter.post(
    "/findidsbyemail",
    authMiddleware,
    userValidator("POST /users/findidsbyemail"),
    userController.getallbyemail
);

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
userRouter.post(
    '/setPrivileges',
    authMiddleware,
    userValidator("POST /users/setPrivileges"),
    userController.setPrivileges
)
export {userRouter};