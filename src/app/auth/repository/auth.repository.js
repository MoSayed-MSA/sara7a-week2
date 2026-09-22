import User from "../../user/model/user.model.js";

export async function findUserByEmail(email) {
    return User.findOne({ email });
}

export async function createUser(userData) {
    return User.create(userData);
}

export async function updateUserStatus(email, isVerified) {
    return User.findOneAndUpdate(
        { email },
        { isVerified },
        { new: true }
    );
}