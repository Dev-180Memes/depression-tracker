import jwt from 'jsonwebtoken';
import { decodeJWT } from '@/lib/decodeToken';

const SECRET_KEY: string = process.env.SECRET_KEY || 'secret';

export const generateToken = (user: { id: string; username: string; email: string; moodUserId: string; }) => {
    return jwt.sign(user, SECRET_KEY, { expiresIn: '2h' });
};

export const verifyToken = (token: string) => {
    try {
        // Decode the token
        const decodedToken = decodeJWT(token);

        if (!decodedToken) {
            return null;
        }

        // console.log("Decoded token:", decodedToken);
        return decodedToken;
    } catch (error) {
        return null;
    }
};