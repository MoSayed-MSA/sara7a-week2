import * as authRepo from "../repository/auth.repository.js";
import * as otpRepo from "../repository/otp.repository.js";
import { timeToMS } from "../../../common/utils/time.js";
import { sendEmail } from "../../../common/email/email.js";
import { generate0TPCode } from "../../../common/utils/otps.js";
import { appError } from "../../../common/utils/error.js";
import { userExist, userNotExist, userNotSignUp, userNotVerified, userVerified } from "../../user/utils/error.js";
import { generateToken } from "../../../common/security/jwt.js";
import { comparePassword, hashPassword } from "../../../common/security/bcrypt.js";
import { OtpExpired, OtpNotMatch } from "../utils/error.js";

export async function register(userData) {
    // check if user already exists
    const user = await authRepo.findUserByEmail(userData.email);

    // if user exists, throw error
    if (user) {
        throw userExist
    }

    // hash password
    userData.password = await hashPassword(userData.password)

    // create user
    const createdUser = await authRepo.createUser(userData);

    // create OTP for email verification
    const otp = await generate0TPCode()
    await otpRepo.createOTP({
        code: otp,
        email: userData.email,
        expiredAt: new Date(Date.now() + timeToMS(5, "min"))
    })

    //verify OTP from email 
    await sendEmail(userData.email, "Verify your email", `<p>Your OTP is: <h1>${otp}</h1></p>`);

    return createdUser;
}

export async function verifyOTP(email, otp) {
    // check user exist
    const userExist = await authRepo.findUserByEmail(email)
    if (!userExist) {
        throw userExist
    }

    //check if user verified
    if (userExist.isVerified === true) {
        throw userVerified

    }

    //check OTP exist
    const OTP = await otpRepo.findOtpByEmail(email)
    if (!OTP) {
        throw userNotSignUp
    }


    // make user verified
    if (OTP.code == otp) {
        await authRepo.updateUserStatus(userExist.email, userExist.isVerified = true)
    }

    // notify user of his verificatin
    await sendEmail(userExist.email,
        "verificaton completed",
        `<h2>Your accout has been Verified Successfully</h2> <br> <p>Now you can login welcome to our community <b>${userExist.name}</b> , ENJOY❤️</p>`
    );



    await otpRepo.deleteOTP(email)

    return userExist

}

export async function login(email, password) {

    //check if user exist and ferified
    const checkUser = await authRepo.findUserByEmail(email)
    if (!checkUser) {
        throw userNotExist
    }
    if (checkUser.isVerified == false) {
        throw userNotVerified

    }

    //check pasword
    const checkPass = await comparePassword(password, checkUser.password)
    if (!checkPass) {
        throw new appError("password is not correct", 400)
    }
    //generate JWT token
    const payload = {
        userId: checkUser._id,
        email: checkUser.email
    };
    const token = await generateToken(payload, '1h')

    return token

}

export async function send0tp(email) {
    // 1. check user existence
    const user = await authRepo.findUserByEmail(email);// {} | null
    if (!user) throw userNotExist

    // delete old OTPs
    await otpRepo.deleteOTP(email)

    // 2. generate OTP and save it into DB
    const code = await generate0TPCode();
    await otpRepo.createOTP({
        code: code,
        email: user.email,
        expiredAt: new Date(Date.now() + timeToMS(5, "min"))
    })
    // 3. send otp email
    await sendEmail(user.email, "Verify your email", `<p>Your OTP is: <h1>${code}</h1></p>`);

}

export async function forgetPassword(email, code, newPassword) {
    // 1. check OTP
    const CheckOtpCode = await otpRepo.findOtpByEmail(email)
    if (!CheckOtpCode) throw OtpExpired
    if (CheckOtpCode.code !== code) throw OtpNotMatch

    // 2. update user password
    const hashPass = await hashPassword(newPassword)
    await authRepo.updateUserByEmail(email, { password: hashPass })

    //3. delete OTPs 
    await otpRepo.deleteOTP(email)
}