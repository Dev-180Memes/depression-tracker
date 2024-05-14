import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "@/utils/auth";
import { apiHandler, formatResponse } from "@/lib/apiHelper";
import { getMoods, postMood } from "@/utils/fetchData";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decodedToken: any = verifyToken(token);
        if (!decodedToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { mood_score } = req.body;

        if (!mood_score || typeof mood_score !== 'number') {
            return res.status(400).json({ error: "Mood score is required and must be a number" });
        }

        try {
            const response = await postMood(mood_score);
            formatResponse(res, response);
        } catch (error) {
            console.error('Error posting mood', error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else if (req.method === 'GET') {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decodedToken: any = verifyToken(token);
        if (!decodedToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const moodData = await getMoods();
            formatResponse(res, moodData);
        } catch (error) {
            console.error('Error getting moods', error);
            res.status(500).json({ error: "Internal server error" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
};

export default apiHandler(handler);