import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { loginUser } from '@/utils/moodTrackerIntegration';
import { apiHandler, formatResponse } from '@/lib/apiHelper';
import { generateToken } from '@/utils/auth';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        console.error('Please fill in all fields');
        return res.status(400).json({ error: "Please fill in all fields" });
    }

    await dbConnect();

    let user = await User.findOne({ email });

    if (!user) {
        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();
    } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }
    }

    try {
        const response = await loginUser(username, email, password);

        if (response.User) {
            const token = generateToken({ id: user._id, username, email, moodUserId: response.User.id });
            formatResponse(res, { msg: 'Succesfully logged in', token, user: response.User });
        } else {
            console.error('Failed to create user in mood tracker system:', response);
            res.status(500).json({ error: 'Failed to create user in mood tracker system' });
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default apiHandler(handler);