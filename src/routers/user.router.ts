import { login, refreshTokens, register } from "../controllers/user.controller"
import express, { Router } from "express"

const userRouter = Router();
userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.post("/refreshToken", refreshTokens)

export default userRouter