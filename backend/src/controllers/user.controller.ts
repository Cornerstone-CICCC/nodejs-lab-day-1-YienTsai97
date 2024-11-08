import { Request, Response } from "express";
import userModel from "../models/user.model";
import { User } from "../types/user";
import { comparHash, hashed } from "../utils/hash.util";
import { generateToken } from "../middleware/auth";

const getUsers = (req: Request, res: Response) => {
    const users = userModel.findAll()
    res.json(users)
}

const getUserById = (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    const user = userModel.findById(id)
    if (!user) {
        res.status(404).send("User not found!")
        return
    }
    res.json(user)
}

const getUserByUsername = (req: Request<{ username: string }>, res: Response) => {
    const { username } = req.params
    const user = userModel.findByUsername(username)
    if (user) {
        res.json(user)
        return
    }
    res.status(404).send("User not found!")
} // no direct route

const addUser = async (req: Request<{}, {}, User>, res: Response) => {
    const { username, password, firstname, lastname } = req.body
    const hashedPassword = await hashed(password)
    const user = userModel.create({
        username, password: hashedPassword, firstname, lastname
    })
    res.status(201).json(user)
}

const updateUserById = async (req: Request<{ id: string }, {}, User>, res: Response) => {
    const { id } = req.params
    const { username, firstname, lastname, password } = req.body
    const hashedPassword = await hashed(password)
    const user = userModel.update(id, { username, firstname, lastname, password: hashedPassword })
    if (!user) {
        res.status(404).json({ message: 'User not found!' })
        return
    }
    res.status(200).json(user)
}
const deleteUserById = (req: Request, res: Response) => {
    const { id } = req.params
    const isDeleted = userModel.delete(id)
    if (!isDeleted) {
        res.status(404).json({ message: 'User not found!' })
    }
    res.status(200).send("User deleted!")
}


const checkAuth = (req: Request, res: Response) => {
    const userId = req.signedCookies.userId
    const user = userModel.findById(userId)

    if (!user) {
        res.status(404).json({ message: 'User not found!' })
        return
    }
    console.log(user)
    res.status(200).json({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname
    },)
}



const loginUser = async (req: Request<{}, {}, User>, res: Response) => {
    const { id, username, password, firstname, lastname } = req.body
    const user = userModel.findByUsername(username)
    if (!user) {
        res.status(404).json({ message: 'User not found!' })
        return
    }
    const isMatch = await comparHash(password, user.password)
    if (!isMatch) {
        res.status(404).json({ message: 'Password Invalid' })
        return
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
    const token = generateToken({ id: user.id, username: user.username, password: user.password, firstname: user.firstname, lastname: user.lastname })
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3 * 60 * 1000,
    })
    res.status(200).json({ message: 'Login authenticated' })
}

const logoutUser = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
}



export default {
    getUsers,
    getUserById,
    getUserByUsername,
    addUser,
    updateUserById,
    deleteUserById,
    checkAuth,
    loginUser,
    logoutUser,
}