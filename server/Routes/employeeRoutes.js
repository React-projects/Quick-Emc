import { Router } from 'express';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from '../Controllers/employeeController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const employeeRouter = Router();

employeeRouter.get('/', protect, adminOnly, getEmployees);
employeeRouter.post('/', protect, adminOnly, createEmployee);
employeeRouter.put('/:id', protect, adminOnly, updateEmployee);
employeeRouter.delete('/:id', protect, adminOnly, deleteEmployee);
export default employeeRouter;
