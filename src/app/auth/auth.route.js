import { Router } from 'express';
import * as authController from './contoller/auth.controller.js';

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.patch('/verify', authController.verifyOtp);
authRouter.post('/signin', authController.signIn);
authRouter.post('/send-otp', authController.sendOtp);

export default authRouter;