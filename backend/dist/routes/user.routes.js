"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware/middleware");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userRouter = (0, express_1.Router)();
userRouter.post('/signup', user_controller_1.default.addUser);
// - `POST /login` = check if username exist, return cookie/s with auth, id/username (sending id/username as a cookie with cookie-parser is not usually a good practice as it exposes the data! Using session-cookie, or JWT is safer.)
userRouter.post("/login", user_controller_1.default.loginUser);
userRouter.get("/logout", user_controller_1.default.logoutUser);
userRouter.get("/check-auth", middleware_1.authenticateJWT, (req, res) => {
    console.log(req.user);
    res.json({ user: req.user });
});
userRouter.get("/users", user_controller_1.default.getUsers);
userRouter.get("/user/:id", user_controller_1.default.getUserById);
userRouter.put("/user/:id", user_controller_1.default.updateUserById);
userRouter.delete("/user/:id", user_controller_1.default.deleteUserById);
exports.default = userRouter;
