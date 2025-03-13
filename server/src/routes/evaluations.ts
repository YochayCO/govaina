import { Router, Request, Response } from 'express';
import { evaluateDecision } from '../controllers/evaluations';

const router = Router();

// POST /api/evaluations/
router.post('/', async (req: Request, res: Response) => {
    const { decisionNumber, decisionText } = req.body as { decisionNumber: number, decisionText: string };

    // TODO: check if evaluation exists in database (by decisionNumber)
    if (!decisionNumber || !decisionText) {
        res.status(400).send('Missing decision number or decision text');
        return
    }

    console.log(`Evaluating decision number ${decisionNumber} with text: ${decisionText}`);

    const [error, evaluationText] = await evaluateDecision(decisionText);

    if (error) {
        res.status(400).send(error.toString());
    } else {
        res.send(evaluationText);
    }
});

export default router;
