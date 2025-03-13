import { Router } from 'express';
import evaluationsRoutes from './evaluations';

const router = Router();

router.use('/evaluations', evaluationsRoutes);

export default router;
