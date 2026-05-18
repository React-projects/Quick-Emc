import { Router } from 'express';
import { adminOnly, protect } from '../middleware/auth.js';
import { clockInOut, getAttendance } from '../Controllers/attendeesController.js';

const attendeesRouter = Router();

attendeesRouter.get('/', protect, getAttendance);
attendeesRouter.post('/', protect, clockInOut);

export default attendeesRouter;
