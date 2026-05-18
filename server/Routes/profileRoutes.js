import { Router } from 'express';
import { adminOnly, protect } from '../middleware/auth.js';
import { getProfile, updateProfile } from '../Controllers/ProfileController.js';

const profileRouter = Router();

profileRouter.get('/', protect, getProfile);
profileRouter.post('/', protect, updateProfile);

export default employeeRouter;
