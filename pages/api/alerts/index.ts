import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import Alert from "@/models/Alert";
import { verifyToken } from "@/utils/auth";
import { apiHandler, formatResponse } from "@/lib/apiHelper";
import { sendMoodDropAlert, lowMoodAlert } from "@/components/server/sendMail";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decodedToken: any = verifyToken(token);
        if (!decodedToken) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        await dbConnect();

        const alert = new Alert({
            userId: decodedToken.id,
            message,
        });

        await alert.save();

        // Check if message starts with "Sudden" or "Consistent" then send an email to the admin
        if (message.startsWith("Sudden")) {
            sendMoodDropAlert(
                decodedToken.id,
                `A sudden drop in mood has been detected for this student. Please check the student's mood data.`
            );
        } else if (message.startsWith("Consistent")) {
            lowMoodAlert(
                decodedToken.id,
                `This student has consistently had a low mood for the past few consecutive entries. Please check the student's mood data.`
            )
        }

        return formatResponse(res, { msg: "Alert created successfully", alert });
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
};

export default apiHandler(handler);