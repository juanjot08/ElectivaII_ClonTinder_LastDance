import { Request, Response } from 'express'
import { injectable } from 'tsyringe';

@injectable()
class MessagesController {

    public sendMessage(req: Request, res: Response): void {
        const { matchId, senderId, message } = req.body;

        if (!matchId || !senderId || !message) {
            return void res.status(400).json({ error: 'All fields are required' });
        }

        // Simulación de envío de mensaje
        res.status(201).json({ message: 'Message sent successfully' });
    }

    public getChatMessages(req: Request, res: Response): void {
        const { matchId } = req.params;

        // Simulación de historial de chat
        const chatHistory = [
            { messageId: '98765', senderId: '12345', message: 'Hey! How are you?', timestamp: new Date().toISOString() },
        ];

        res.json(chatHistory);
    }

    public deleteMessage(req: Request, res: Response): void {
        const { messageId } = req.params;

        // Simulación de eliminación de mensaje
        res.json({ message: `Message ${messageId} deleted successfully` });
    }
}

export default MessagesController;