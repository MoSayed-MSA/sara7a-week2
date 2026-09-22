import * as authRepo from "../repository/auth.repository.js";
import * as otpRepo from "../repository/otp.repository.js";
import { timeToMS } from "../../../common/utils/time.js";
import { sendEmail } from "../../../common/email/email.js";
import { generate0TPCode } from "../../../common/utils/otps.js";
import { appError } from "../../../common/utils/error.js";
import { userExist, userNotExist, userNotSignUp, userVerified } from "../../user/utils/error.js";
import { generateToken } from "../../../common/security/jwt.js";
import { comparePassword, hashPassword } from "../../../common/security/bcrypt.js";

export async function register(userData) {
    // check if user already exists
    const user = await authRepo.findUserByEmail(userData.email);


    // if user exists, throw error
    if (user) {
        throw new userExist
    }

    // hash password
    userData.password = await hashPassword

    // create user
    const createdUser = await authRepo.createUser(userData);

    // create OTP for email verification
    const otp = await generate0TPCode
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
        throw new userExist
    }

    //check if user verified
    if (userExist.isVerified === true) {
        throw new userVerified

    }

    //check OTP exist
    const OTP = await otpRepo.findOtpByEmail(email)
    if (!OTP) {
        throw new userNotSignUp
    }


    // make user verified
    if (OTP.code == otp) {
        await authRepo.updateUserStatus(userExist.email, userExist.isVerified = true)
    }

    await otpRepo.deleteOTP(email)

    return userExist

}

export async function login(email, password) {

    //check if user exist and ferified
    const checkUser = await authRepo.findUserByEmail(email)
    if (!checkUser) {
        throw new appError("user is not exist", 404)
    }
    if (checkUser.isVerified == false) {
        throw new appError("user is not verified yet", 400)

    }

    //check pasword
    const checkPass = await comparePassword
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
    if (!user) throw new userNotExist

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

    return code
}