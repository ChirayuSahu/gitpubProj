import bcrypt from "bcryptjs";

export const hashPass = async (pass: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(pass, salt);
    return hashedPass;
}

export const comparePass = async (password: string, hashedPass: string) => {
    const isMatch = await bcrypt.compare(password, hashedPass);
    return isMatch;
}