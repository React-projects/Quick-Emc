import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getDashboard } from '../Controllers/dashboardController.js';
const dashboardRouter = Router();

dashboardRouter.get('/', protect, getDashboard);

export default dashboardRouter;
