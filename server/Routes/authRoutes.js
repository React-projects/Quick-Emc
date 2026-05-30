import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { login, getSession, changePassword } from '../Controllers/authController.js';
const authRouter = Router();

authRouter.post('/login', login);
authRouter.get('/session', protect, getSession);
authRouter.post('/change-password', protect, changePassword);

export default authRouter;
