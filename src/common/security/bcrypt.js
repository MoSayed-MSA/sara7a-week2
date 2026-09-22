import { compare, hash } from "bcrypt";
export function comparePassword(password, hashedPass) {
    return compare(password, hashedPass)
}
export function hashPassword(password) {
    return hash(password, 10);
}
