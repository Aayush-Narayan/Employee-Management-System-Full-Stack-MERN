import { Router } from 'express';
import verifyToken from '../Middleware/verifyToken.js';
import {
  getProfile,
  getAttendanceSummary,
  markAttendance,
  getLeavesSummary,
  getPayrollLatest,
  applyLeave,
  getTodayAttendance,
} from '../Controllers/employeeController.js';

const router = Router();

// All routes require a valid JWT (employee or admin—verifyToken will pass through either role)
router.get('/profile', verifyToken, getProfile);
router.get('/attendance/summary', verifyToken, getAttendanceSummary);
router.post('/attendance/mark', verifyToken, markAttendance);
router.get('/leaves/summary', verifyToken, getLeavesSummary);
router.get('/payroll/latest', verifyToken, getPayrollLatest);
router.post('/leaves/request', verifyToken, applyLeave);
router.get('/attendance/today', verifyToken, getTodayAttendance);

export default router;