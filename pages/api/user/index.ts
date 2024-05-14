import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import { apiHandler, formatResponse } from "@/lib/apiHelper";
import { getActiveUser } from "@/utils/fetchData";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken: any = verifyToken(token);
    if (!decodedToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();

    const user = await User.findById(decodedToken.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    try {
        const moodTrackerUser = await getActiveUser();
        if (!moodTrackerUser) {
            return res.status(500).json({ error: "Failed to fetch mood tracker user details" });
        }

        const userDetails = {
            username: user.username,
            email: user.email,
            moodTrackerDetails: moodTrackerUser
        };

        formatResponse(res, userDetails);
    } catch (error) {
        console.error('Error fetching user details', error);
        res.status(500).json({ error: "Failed to fetch user details" });
    }
};

export default apiHandler(handler);