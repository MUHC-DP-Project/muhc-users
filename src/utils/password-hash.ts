import bcrypt from 'bcrypt';

const hashPassword = async (plainTextPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    return hashedPassword;
}

export default hashPassword;