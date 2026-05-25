import { Router } from 'express';
import { adminOnly, protect } from '../middleware/auth.js';
import { createLeave, getLeaves, UpdateLeaveStatus } from '../Controllers/leaveController.js';

const leaveRouter = Router();

leaveRouter.post('/', protect, createLeave);
leaveRouter.get('/', protect, getLeaves);
leaveRouter.patch('/:id', protect, adminOnly, UpdateLeaveStatus);
export default leaveRouter;
