import { Router, Request, Response } from "express";
import userController from "../controllers/user.controller";

const userRouter = Router()

userRouter.post('/signup', userController.addUser)

// - `POST /login` = check if username exist, return cookie/s with auth, id/username (sending id/username as a cookie with cookie-parser is not usually a good practice as it exposes the data! Using session-cookie, or JWT is safer.)
userRouter.post("/login", userController.loginUser)

userRouter.get("/logout", userController.logoutUser)
userRouter.get("/check-auth", userController.checkAuth);
userRouter.get("/users", userController.getUsers)
userRouter.get("/user/:id", userController.getUserById)
userRouter.put("/user/:id", userController.updateUserById)
userRouter.delete("/user/:id", userController.deleteUserById)

export default userRouter