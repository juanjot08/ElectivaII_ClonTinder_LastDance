import { injectable } from "tsyringe";
import { Request, Response } from 'express'

@injectable()
export class SwipesController {

    public recordSwipe(req: Request, res: Response): void {
        // Simulación de registro de un swipe
        res.status(200).json({ message: 'Swipe recorded successfully' });
    }

    public getSwipeHistory(req: Request, res: Response): void {
        const { userId } = req.query;

        if (!userId) {
            return void res.status(400).json({ error: 'UserId is required' });
        }

        // Simulación de historial de swipes
        const history = [
            { userId: '67890', swipeType: 'like', timestamp: new Date().toISOString() },
        ];

        res.json(history);
    }
}