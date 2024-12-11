import {Router} from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { getUserInfo, loginUser, logoutUser, registerUser } from '../controllers/auth.controller.js';


const userRouter = Router();

userRouter.route("/register").post(registerUser)
userRouter.route("/login").post(loginUser)
userRouter.route('/logout').get(verifyJWT, logoutUser)
userRouter.route('/user/:userId').get( getUserInfo);


export default userRouter