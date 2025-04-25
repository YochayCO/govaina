import { Router } from 'express';

import { postChatSchema } from '../schemas/chatSchemas'
import { chatController } from '../controllers/chat';
import { validateData } from '../middleware/validationMiddleware';

const router = Router();

// POST /api/chat
router.post('/', validateData(postChatSchema), chatController);

export default router