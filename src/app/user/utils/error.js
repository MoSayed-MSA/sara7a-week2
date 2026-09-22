import { appError } from "../../../common/utils/error.js";

export const userExist = appError('user already exist', 409)
export const userNotExist = appError('user is not exist', 404)
export const userVerified = appError('You are already verified', 400)
export const userNotVerified = appError('You are not verified yet', 400)
export const userNotSignUp = appError('You need to sign up first', 400)