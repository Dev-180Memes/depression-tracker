import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import Alert from "@/models/Alert";
import { verifyToken } from "@/utils/auth";
import { apiHandler, formatResponse } from "@/lib/apiHelper";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decodedToken: any = verifyToken(token);
        if (!decodedToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        await dbConnect();

        const alerts = await Alert.find({ userId: decodedToken.id }).sort({ createdAt: -1 });

        return formatResponse(res, { alerts });
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
};

export default apiHandler(handler);