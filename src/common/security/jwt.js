import jwt from 'jsonwebtoken'

export function generateToken(payload, expTime) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: expTime })
}

export function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
}