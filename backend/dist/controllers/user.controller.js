"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const hash_util_1 = require("../utils/hash.util");
const auth_1 = require("../middleware/auth");
const getUsers = (req, res) => {
    const users = user_model_1.default.findAll();
    res.json(users);
};
const getUserById = (req, res) => {
    const { id } = req.params;
    const user = user_model_1.default.findById(id);
    if (!user) {
        res.status(404).send("User not found!");
        return;
    }
    res.json(user);
};
const getUserByUsername = (req, res) => {
    const { username } = req.params;
    const user = user_model_1.default.findByUsername(username);
    if (user) {
        res.json(user);
        return;
    }
    res.status(404).send("User not found!");
}; // no direct route
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, firstname, lastname } = req.body;
    const hashedPassword = yield (0, hash_util_1.hashed)(password);
    const user = user_model_1.default.create({
        username, password: hashedPassword, firstname, lastname
    });
    res.status(201).json(user);
});
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, firstname, lastname, password } = req.body;
    const hashedPassword = yield (0, hash_util_1.hashed)(password);
    const user = user_model_1.default.update(id, { username, firstname, lastname, password: hashedPassword });
    if (!user) {
        res.status(404).json({ message: 'User not found!' });
        return;
    }
    res.status(200).json(user);
});
const deleteUserById = (req, res) => {
    const { id } = req.params;
    const isDeleted = user_model_1.default.delete(id);
    if (!isDeleted) {
        res.status(404).json({ message: 'User not found!' });
    }
    res.status(200).send("User deleted!");
};
const checkAuth = (req, res) => {
    const userId = req.signedCookies.userId;
    const user = user_model_1.default.findById(userId);
    if (!user) {
        res.status(404).json({ message: 'User not found!' });
        return;
    }
    console.log(user);
    res.status(200).json({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname
    });
};
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, username, password, firstname, lastname } = req.body;
    const user = user_model_1.default.findByUsername(username);
    if (!user) {
        res.status(404).json({ message: 'User not found!' });
        return;
    }
    const isMatch = yield (0, hash_util_1.comparHash)(password, user.password);
    if (!isMatch) {
        res.status(404).json({ message: 'Password Invalid' });
        return;
    }
    // res.cookie('isAuthenticated', true, {
    //     httpOnly: true,
    //     maxAge: 3 * 60 * 1000,
    //     signed: true
    // })
    // res.cookie('userId', user.id, {
    //     httpOnly: true,
    //     maxAge: 3 * 60 * 1000,
    //     signed: true
    // })
    ///////////////////////
    const token = (0, auth_1.generateToken)({ id: user.id, username: user.username, password: user.password, firstname: user.firstname, lastname: user.lastname });
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3 * 60 * 1000,
    });
    res.status(200).json({ message: 'Login authenticated' });
});
const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
};
exports.default = {
    getUsers,
    getUserById,
    getUserByUsername,
    addUser,
    updateUserById,
    deleteUserById,
    checkAuth,
    loginUser,
    logoutUser,
};
