import { NextApiRequest, NextApiResponse } from "next";

export const apiHandler = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            await handler(req, res);
        } catch (error) {
            console.error('API handler error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

export const formatResponse = (res: NextApiResponse, data: any) => {
    res.status(200).json({ data });
}