import { Request, Response } from "express";
import db from "../Models/db.js";
import { format, startOfMonth, endOfMonth } from "date-fns";
import dotenv from "dotenv";
dotenv.config();

interface JwtPayload {
  id: number;
  email: string;
  role: "admin" | "employee";
  iat?: number;
  exp?: number;
}

// Helper: get employeeID from `users` table given req.userId
async function fetchEmployeeIDByUserId(userId: number): Promise<string | null> {
  const query = `SELECT employeeID FROM users WHERE id = ?`;
  const [rows]: [any[], any] = await db.query(query, [userId]);
  if (rows.length === 0) return null;
  return rows[0].employeeID as string;
}

// 1) GET /api/employee/profile
export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.userId!;
    const employeeID = await fetchEmployeeIDByUserId(userId);
    if (!employeeID) {
      return res.status(404).json({ message: "Employee profile not found." });
    }

    const query = `
      SELECT 
        v.employeeID,
        v.firstName,
        v.lastName,
        v.email,
        v.designation,
        v.dateOfJoining
      FROM verified v
      WHERE v.employeeID = ?
    `;
    const [rows]: any[] = await db.query(query, [employeeID]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee profile not found." });
    }

    const row = rows[0];
    const profileData = {
      employeeID: row.employeeID,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      designation: row.designation,
      department: "",
      dateOfJoining: format(new Date(row.dateOfJoining), "yyyy-MM-dd"),
    };

    return res.status(200).json(profileData);
  } catch (err) {
    console.error("Error in getProfile:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// 2) GET /api/employee/attendance/summary
export const getAttendanceSummary = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId!;
    const employeeID = await fetchEmployeeIDByUserId(userId);
    if (!employeeID) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // 2a) Count “present” days in attendanceRecords for this month
    const now = new Date();
    const monthStart = format(startOfMonth(now), "yyyy-MM-dd");
    const monthEnd = format(endOfMonth(now), "yyyy-MM-dd");

    const countQuery = `
      SELECT COUNT(*) AS daysThisMonth
      FROM attendanceRecords
      WHERE employeeID = ?
        AND date BETWEEN ? AND ?
        AND status = 'present'
    `;
    const [countRows]: any[] = await db
      
      .query(countQuery, [employeeID, monthStart, monthEnd]);
    const daysThisMonth = Number(countRows[0]?.daysThisMonth ?? 0);

    // 2b) Fetch paidLeavesLeft from verified
    const leaveLeftQuery = `
      SELECT paidLeavesLeft 
      FROM verified 
      WHERE employeeID = ?
    `;
    const [leaveRows]: any[] = await db
      
      .query(leaveLeftQuery, [employeeID]);
    const paidLeavesRemaining = Number(leaveRows[0]?.paidLeavesLeft ?? 0);

    return res.status(200).json({ daysThisMonth, paidLeavesRemaining });
  } catch (err) {
    console.error("Error in getAttendanceSummary:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// 3) POST /api/employee/attendance/mark
export const markAttendance = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId!;
    const employeeID = await fetchEmployeeIDByUserId(userId);
    if (!employeeID) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Use today's date in 'YYYY-MM-DD' format
    const today = format(new Date(), "yyyy-MM-dd");

    // Check if already marked today
    const existsQuery = `
      SELECT *
      FROM attendanceRecords
      WHERE employeeID = ? AND date = ?
    `;
    const [existsRows]: any[] = await db
      
      .query(existsQuery, [employeeID, today]);
    if (existsRows.length > 0) {
      return res
        .status(400)
        .json({ message: "Attendance already marked for today." });
    }

    // 3a) Insert into attendanceRecords (default status = 'present')
    const insertQuery = `
      INSERT INTO attendanceRecords (employeeID, date, status, punchedInAt)
      VALUES (?, ?, 'present', NOW())
    `;
    await db.query(insertQuery, [employeeID, today]);

    // 3b) Increment the attendance counter in verified
    const updateVerified = `
      UPDATE verified
      SET attendance = attendance + 1
      WHERE employeeID = ?
    `;
    await db.query(updateVerified, [employeeID]);

    return res.status(200).json({ message: "Attendance marked successfully." });
  } catch (err) {
    console.error("Error in markAttendance:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// 4) GET /api/employee/leaves/summary
export const getLeavesSummary = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId!;
    const employeeID = await fetchEmployeeIDByUserId(userId);
    if (!employeeID) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Count by status: pending, approved, rejected
    const summaryQuery = `
      SELECT
        COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
        COALESCE(SUM(status = 'approved'), 0) AS approved,
        COALESCE(SUM(status = 'rejected'), 0) AS rejected
      FROM leaveRequests
      WHERE employeeID = ?
    `;
    const [rows]: any[] = await db.query(summaryQuery, [employeeID]);
    const summary = {
      pending: Number(rows[0]?.pending ?? 0),
      approved: Number(rows[0]?.approved ?? 0),
      rejected: Number(rows[0]?.rejected ?? 0),
    };

    return res.status(200).json(summary);
  } catch (err) {
    console.error("Error in getLeavesSummary:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// 5) GET /api/employee/payroll/latest
export const getPayrollLatest = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId!;
    const employeeID = await fetchEmployeeIDByUserId(userId);
    if (!employeeID) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Get the most recent payroll row (by month) for this employee
    const query = `
      SELECT basicSalary, allowances, deductions, netPay, generatedAt
      FROM payroll
      WHERE employeeID = ?
      ORDER BY month DESC
      LIMIT 1
    `;
    const [rows]: any[] = await db.query(query, [employeeID]);
    if (rows.length === 0) {
      // If no payroll exists yet, return zeros:
      return res.status(200).json({
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        netPay: 0,
        payDate: "",
      });
    }

    const row = rows[0];
    // `generatedAt` is a TIMESTAMP; we’ll convert to YYYY-MM-DD for consistency
    const payDate = row.generatedAt ? format(new Date(row.generatedAt), "yyyy-MM-dd"): "";

    return res.status(200).json({
      basicSalary: Number(row.basicSalary),
      allowances: Number(row.allowances),
      deductions: Number(row.deductions),
      netPay: Number(row.netPay),
      payDate,
    });
  } catch (err) {
    console.error("Error in getPayrollLatest:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// 6) POST /api/employee/leaves/request
export const applyLeave = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.userId!;
    const employeeID = await fetchEmployeeIDByUserId(userId);
    if (!employeeID) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const { startDate, endDate, reason, type } = req.body;

    if (!startDate || !endDate || !reason || !type) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const query = `
      INSERT INTO leaveRequests (employeeID, startDate, endDate, reason, type, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;
    await db.query(query, [employeeID, startDate, endDate, reason, type]);

    return res.status(201).json({ message: "Leave request submitted." });
  } catch (err) {
    console.error("Error in applyLeave:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
// 7) GET /api/employee/attendance/today
export const getTodayAttendance = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.userId!;
    const employeeID = await fetchEmployeeIDByUserId(userId);
    if (!employeeID) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const today = format(new Date(), "yyyy-MM-dd");

    const query = `
      SELECT status, TIME(punchedInAt) AS punchedInAt
      FROM attendanceRecords
      WHERE employeeID = ? AND date = ?
    `;
    const [rows]: any[] = await db.query(query, [employeeID, today]);

    if (rows.length === 0) {
      return res.status(200).json({ status: "absent", punchedInAt: null });
    }

    return res.status(200).json({
      status: rows[0].status,
      punchedInAt: rows[0].punchedInAt,
    });
  } catch (err) {
    console.error("Error in getTodayAttendance:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
