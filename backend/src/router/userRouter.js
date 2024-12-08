import { Router } from "express";
import { createUser, login, verifyUser } from "../controller/userController.js";

const userRouter = Router();

userRouter.route("/create-user").post(createUser);
userRouter.route("/verify-user").patch(verifyUser);
userRouter.route("/login").post(login);

export default userRouter;
