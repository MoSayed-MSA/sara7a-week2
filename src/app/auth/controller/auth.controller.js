import { successResponse } from "../../../common/utails/successRes.js";
import { timeToMS } from "../../../common/utails/time.js";
import * as authService from "../service/auth.service.js";

export async function register(req, res, next) {
    // get user data from req body
    const { name, email, password } = req.body;

    // get user data from service
    try {
        const createdUser = await authService.register({ name, email, password });
        successResponse(res, 201, "User registered successfully", createdUser);
    } catch (error) {
        next(error);
    }
}

export async function verifyOtp(req, res, next) {

    // get user data from req body
    const { email, otp } = req.body;

    try {
        const user = await authService.verifyOTP(email, otp)
        successResponse(res, 201, "User verified successfully", user);
    } catch (error) {
        next(error)
    }
}

export async function signIn(req, res, next) {

    // get user data from req body
    const { email, password } = req.body;

    try {
        const token = await authService.login(email, password)
        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: timeToMS(1, 'h')
        })
        successResponse(res, 201, "User looged in successfully",);

    } catch (error) {
        next(error)
    }
}

export async function sendOtp(req, res, next) {
    try {
        const { email } = req.body;
        await authService.send0tp(email);
        successResponse(res, 200, "OTP sent successfully");

    } catch (err) {
        next(err);
    }
}