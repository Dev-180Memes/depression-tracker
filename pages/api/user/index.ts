import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";
import { apiHandler, formatResponse } from "@/lib/apiHelper";
import { getActiveUser } from "@/utils/fetchData";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req);

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        console.error("No token provided");
        return res.status(401).json({ error: "Unauthorized" });
    }

    // console.log("Token:", token);

    const decodedToken: any = verifyToken(token);
    // console.log("Decoded token:", decodedToken);
    if (!decodedToken) {
        console.error("Invalid token");
        return res.status(401).json({ error: "Unauthorized" });
    }

    await dbConnect();

    const user = await User.findById(decodedToken.id);
    if (!user) {
        console.error("User not found");
        return res.status(404).json({ error: "User not found" });
    }

    try {
        const moodTrackerUser = await getActiveUser(decodedToken.moodUserId);
        if (!moodTrackerUser) {
            console.error("Failed to fetch mood tracker user details");
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