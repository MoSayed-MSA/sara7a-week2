import jwt from "jsonwebtoken";
import { appError } from "../utils/error.js";
import { verifyToken } from "../security/jwt.js";

export function authenticate(req, res, next) {
    const token = req.cookies?.access_token

    if (!token) {
        return next(new appError("Unauthorized: Token missing", 401));
    }

    try {
        const decoded = verifyToken(token)
        req.user = decoded; // { userId, email }
        next();
    } catch (error) {
        return next(new appError("Invalid or expired token", 401));
    }
}