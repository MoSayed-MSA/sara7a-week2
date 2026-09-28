import { appError } from "../../../common/utils/error.js";

export const userExist = new appError('user already exist', 409)
export const userNotExist = new appError('user is not exist', 404)
export const userVerified = new appError('You are already verified', 400)
export const userNotVerified = new appError('You are not verified yet', 400)
export const userNotSignUp = new appError('You need to sign up first', 400)