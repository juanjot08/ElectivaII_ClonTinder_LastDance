import { injectable } from "tsyringe";
import { Request, Response } from 'express'

@injectable()
export class MatchController {

    public getMatches(req: Request, res: Response): void {
        const { userId } = req.query;

        if (!userId) {
            return void res.status(400).json({ error: 'UserId is required' });
        }

        // Simulación de lista de matches
        const matches = [{ userId: '67890', name: 'Jane Doe' }];

        res.status(200).json({ matches });
    }

    public unmatchUser(req: Request, res: Response): void {
        const { matchId } = req.params;

        // Simulación de eliminación de un match
        res.json({ message: `Match ${matchId} removed successfully` });
    }

    public getChatHistory(req: Request, res: Response): void {
        const { matchId } = req.params;

        // Simulación de historial de chat
        const chatHistory = [
            { messageId: '98765', senderId: '12345', message: 'Hey! How are you?', timestamp: new Date().toISOString() },
        ];

        res.json(chatHistory);
    }
}