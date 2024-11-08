// Create your server
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config()

//create server
const app = express()

//Middleware
app.use(cors({
    origin: "http://localhost:4321",
    credentials: true,
}))
app.use(cookieParser(process.env.COOKIE_SIGNKEY)) //need to put on top because of the express.json() need to read it
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//Router
import userRouter from "./routes/user.routes";
app.use('/', userRouter)

//404 Fallback
app.use((req: Request, res: Response) => {
    res.status(404).send("Invalid route!")
})


//Start Server
const PORT: number = Number(process.env.PORT || 3000)
app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}...`)
})