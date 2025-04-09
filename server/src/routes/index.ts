import { Router } from 'express';
import evaluationsRouter from './evaluations';

const router = Router();

router.use('/evaluations', evaluationsRouter);

export default router;
