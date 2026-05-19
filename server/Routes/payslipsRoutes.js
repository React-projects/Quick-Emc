import { Router } from 'express';
import { adminOnly, protect } from '../middleware/auth.js';
import { createPayslips, getPayslips, getPayslipsById } from '../Controllers/payslipsController.js';
const payslipsRouter = Router();

payslipsRouter.post('/', protect, adminOnly, createPayslips);
payslipsRouter.get('/', protect, getPayslips);
payslipsRouter.get('/:id', protect, getPayslipsById);

export default payslipsRouter;
