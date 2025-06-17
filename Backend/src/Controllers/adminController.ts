// Backend/src/Controllers/adminController.ts
import { Request, Response } from "express";
import db from "../Models/db.js";
import dotenv from "dotenv";
dotenv.config();

// Approve a pending signup
export const approveSignup = async (
  req: Request,
  res: Response
): Promise<any> => {
  const signupId = Number(req.params.signupId);

  try {
    // 1. Fetch user from notVerified
    const [rows]: any[] = await db.query(
      "SELECT * FROM notVerified WHERE id = ?",
      [signupId]
    );
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "Signup request not found" });
    }

    // 2. Generate unique employeeID
    const yearFull = new Date(user.dateOfJoining).getFullYear();
    const yearTwoDigits = String(yearFull).slice(-2);
    const [countRows]: any[] = await db.query(
      "SELECT COUNT(*) AS cnt FROM verified WHERE YEAR(dateOfJoining) = ?",
      [yearFull]
    );
    const nextSerial = countRows[0].cnt + 1;
    const serialPadded = String(nextSerial).padStart(4, "0");
    const employeeID = `${yearTwoDigits}${serialPadded}`;

    // 3. Insert into `users` table (for login/auth)
    await db.query(
      `INSERT INTO users (employeeID, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [employeeID.trim(), user.email, user.password, "employee"]
    );

    // 4. Insert into `verified` (profile table)
    await db.query(
      `INSERT INTO verified (
        employeeID, firstName, lastName, gender, bloodGroup, dateOfBirth,
        dateOfJoining, phoneNo, email, education, qualification, designation,
        attendance, salary, rating, paidLeavesLeft
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeID,
        user.firstName,
        user.lastName,
        user.gender,
        user.bloodGroup,
        user.dateOfBirth,
        user.dateOfJoining,
        user.phoneNo,
        user.email,
        user.education,
        user.qualification,
        user.designation,
        0, // attendance
        0.0, // salary
        0.0, // rating
        12, // paidLeavesLeft
      ]
    );

    // 5. Delete from `notVerified`
    await db.query("DELETE FROM notVerified WHERE id = ?", [signupId]);

    res.status(200).json({ message: "Signup approved", employeeID });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ message: "Failed to approve signup" });
  }
};

// Decline and remove signup request
export const declineSignup = async (
  req: Request,
  res: Response
): Promise<any> => {
  const signupId = req.params.signupId;

  try {
    const [result]: any[] = await db.query(
      "DELETE FROM notVerified WHERE id = ?",
      [signupId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Signup not found" });
    }
    res.status(200).json({ message: "Signup declined" });
  } catch (err) {
    console.error("Decline error:", err);
    res.status(500).json({ message: "Failed to decline signup" });
  }
};

// Get all pending signups
export const getPendingSignups = async (_req: Request, res: Response) => {
  try {
    const [rows]: any[] = await db.query(
      "SELECT * FROM notVerified ORDER BY requestedAt DESC"
    );
    const formattedRows = rows.map((row: any) => ({
      ...row,
      requestedAt: formatISODate(row.requestedAt),
    }));
    res.status(200).json(formattedRows);
  } catch (err) {
    console.error("Fetching pending signups failed:", err);
    res.status(500).json({ message: "Failed to load pending signups" });
  }
};

// Get all verified employees
export const getEmployees = async (_req: Request, res: Response) => {
  try {
    const [rows]: any[] = await db.query(
      "SELECT id, employeeID, firstName, lastName, gender, email, phoneNo, dateOfJoining, paidLeavesLeft FROM verified ORDER BY dateOfJoining DESC"
    );
    const formattedRows = rows.map((row: any) => ({
      ...row,
      dateOfJoining: formatISODate(row.dateOfJoining),
    }));
    res.status(200).json(formattedRows);
  } catch (err) {
    console.error("Failed to fetch employees:", err);
    res.status(500).json({ message: "Failed to load employees" });
  }
};

function formatISODate(isoDate: string | Date): string {
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .format(date)
      .replace(",", "");
  } catch (error) {
    console.error("Error formatting date:", error);
    return typeof isoDate === "string" ? isoDate : isoDate.toString();
  }
}

// Get attendance records for an employee
export const getAttendanceByEmployee = async (req: Request, res: Response) => {
  const employeeID = String(req.params.employeeID);

  try {
    const [rows]: any[] = await db.query(
      "SELECT date, status, punchedInAt, punchedOutAt FROM attendanceRecords WHERE employeeID = ? ORDER BY date DESC",
      [employeeID.trim()]
    );
    const formattedRows = rows.map((row: any) => ({
      ...row,
      date: formatISODate(row.date),
      punchedInAt: row.punchedInAt ? formatISODate(row.punchedInAt) : null,
      punchedOutAt: row.punchedOutAt ? formatISODate(row.punchedOutAt) : null,
    }));

    res.status(200).json(formattedRows);
  } catch (err) {
    console.error("Failed to fetch attendance records:", err);
    res.status(500).json({ message: "Failed to load attendance records" });
  }
};

// Get salary records for an employee
export const getSalaryByEmployee = async (req: Request, res: Response) => {
  const employeeID = String(req.params.employeeID);

  try {
    const [rows]: any[] = await db.query(
      "SELECT id, employeeID, month, basicSalary, allowances, deductions, netPay, generatedAt, payslipURL FROM payroll WHERE employeeID = ? ORDER BY month DESC",
      [employeeID.trim()]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Failed to fetch salary records:", err);
    res.status(500).json({ message: "Failed to load salary records" });
  }
};

// Get all leave requests
export const getLeaveRequests = async (_req: Request, res: Response) => {
  try {
    const [rows]: any[] = await db.query(
      "SELECT l.id, l.employeeID, v.firstName, v.lastName, l.startDate, l.endDate, l.type, l.reason, l.status, l.requestedAt, l.reviewedBy, l.reviewedAt FROM leaveRequests l JOIN verified v ON l.employeeID = v.employeeID ORDER BY l.requestedAt DESC"
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Failed to fetch leave requests:", err);
    res.status(500).json({ message: "Failed to load leave requests" });
  }
};

// Get today's attendance summary
export const getTodayAttendanceSummary = async (
  _req: Request,
  res: Response
) => {
  const today = new Date().toISOString().split("T")[0];

  try {
    const [presentRows]: any[] = await db.query(
      "SELECT COUNT(*) AS count FROM attendanceRecords WHERE date = ? AND status = 'present'",
      [today]
    );
    const [absentRows]: any[] = await db.query(
      "SELECT COUNT(*) AS count FROM verified WHERE employeeID NOT IN (SELECT employeeID FROM attendanceRecords WHERE date = ?)",
      [today]
    );

    res.status(200).json({
      present: presentRows[0].count,
      absent: absentRows[0].count,
    });
  } catch (err) {
    console.error("Failed to fetch today's attendance summary:", err);
    res.status(500).json({ message: "Failed to load attendance summary" });
  }
};

// Get today's salary summary
export const getTodaySalarySummary = async (_req: Request, res: Response) => {
  const today = new Date().toISOString().split("T")[0];

  try {
    const [paidRows]: any[] = await db.query(
      "SELECT COUNT(*) AS count FROM payroll WHERE DATE(generatedAt) = ?",
      [today]
    );
    const [unpaidRows]: any[] = await db.query(
      "SELECT COUNT(*) AS count FROM verified WHERE employeeID NOT IN (SELECT employeeID FROM payroll WHERE DATE(generatedAt) = ?)",
      [today]
    );

    res.status(200).json({
      paid: paidRows[0].count,
      unpaid: unpaidRows[0].count,
    });
  } catch (err) {
    console.error("Failed to fetch today's salary summary:", err);
    res.status(500).json({ message: "Failed to load salary summary" });
  }
};
