// Backend/src/Routes/adminRoutes.ts
import { Router } from 'express';
import { 
  approveSignup, 
  declineSignup, 
  getPendingSignups,
  getEmployees,
  getAttendanceByEmployee,
  getSalaryByEmployee,
  getLeaveRequests,
  getTodayAttendanceSummary,
  getTodaySalarySummary 
} from '../Controllers/adminController.js';
import verifyToken from '../Middleware/verifyToken.js';
import { checkRole } from '../Middleware/checkRole.js'; 

const router = Router();

// Signup routes
router.get("/not-verified", verifyToken, checkRole("admin"), getPendingSignups);
router.post("/not-verified/:signupId/approve", verifyToken, checkRole("admin"), approveSignup);
router.post("/not-verified/:signupId/decline", verifyToken, checkRole("admin"), declineSignup);

// Employees routes
router.get("/employees", verifyToken, checkRole("admin"), getEmployees);

// Attendance routes
router.get("/attendance/:employeeID", verifyToken, checkRole("admin"), getAttendanceByEmployee);

// Salary routes
router.get("/salary/:employeeID", verifyToken, checkRole("admin"), getSalaryByEmployee);

// Leave requests routes
router.get("/leave-requests", verifyToken, checkRole("admin"), getLeaveRequests);

// Today's statistics routes
router.get("/today-attendance-summary", verifyToken, checkRole("admin"), getTodayAttendanceSummary);
router.get("/today-salary-summary", verifyToken, checkRole("admin"), getTodaySalarySummary);

export default router;