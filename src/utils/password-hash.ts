import bcrypt from 'bcrypt';

const hashPassword = async (plainTextPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    return hashedPassword;
}

const compareHash = async (plainTextPassword, hashedPassword) => {
    const result = await bcrypt.compare(plainTextPassword, hashedPassword);
    return result;
}

export {hashPassword, compareHash};