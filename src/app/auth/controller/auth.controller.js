import { successResponse } from "../../../common/utils/successRes.js";
import { timeToMS } from "../../../common/utils/time.js";
import { validateBody } from "../../../common/validation/validation.js";
import { forgetPassDto, loginDto, registerDto, sendOtpDto, verifyOtpDto } from "../dto/auth.dto.js";
import * as authService from "../service/auth.service.js";

export async function register(req, res, next) {
    try {
        const { name, email, password } = validateBody(registerDto, req.body);

        const createdUser = await authService.register({ name, email, password });
        successResponse(res, 201, "User registered successfully", createdUser);
    } catch (error) {
        next(error);
    }
}

export async function verifyOtp(req, res, next) {
    try {
        const { email, otp } = validateBody(verifyOtpDto, req.body);

        const user = await authService.verifyOTP(email, otp);
        successResponse(res, 200, "User verified successfully", user);
    } catch (error) {
        next(error);
    }
}

export async function signIn(req, res, next) {
    try {
        const { email, password } = validateBody(loginDto, req.body);

        const token = await authService.login(email, password);
        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: timeToMS(1, 'h')
        });
        successResponse(res, 200, "User logged in successfully");

    } catch (error) {
        next(error);
    }
}

export async function sendOtp(req, res, next) {
    try {
        const { email } = validateBody(sendOtpDto, req.body);

        await authService.send0tp(email);
        successResponse(res, 200, "OTP sent successfully");

    } catch (err) {
        next(err);
    }
}

export async function forgetPassword(req, res, next) {
    try {
        const { email, code, newPassword } = validateBody(forgetPassDto, req.body);

        await authService.forgetPassword(email, code, newPassword);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}