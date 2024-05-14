import jwt from 'jsonwebtoken';

const SECRET_KEY: string = process.env.SECRET_KEY || 'secret';

export const generateToken = (user: { id: string; username: string; email: string; moodUserId: string; }) => {
    return jwt.sign(user, SECRET_KEY, { expiresIn: '2h' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
};