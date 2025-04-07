import { Router, Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { evaluateDecision } from '../controllers/evaluations';

const router = Router();

// POST /api/evaluations/
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    const { decisionNumber, decisionText } = req.body as { decisionNumber: number, decisionText: string };

    if (!decisionNumber || !decisionText) {
        next(createHttpError(400, 'Missing decision number or decision text'));
        return
    }

    const [error, evaluationText] = await evaluateDecision(decisionNumber, decisionText);

    if (error) {
        next(error);
    } else {
        res.send(evaluationText);
    }
});

export default router;
