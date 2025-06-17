// Backend\src\Controllers\authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../Models/db.js";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET not set in environment variables");
}
const jwtSecret = process.env.JWT_SECRET;
const tokenExpiry = "1h";

export const signup = async (req: Request, res: Response): Promise<any> => {
  const {
    firstName,
    lastName,
    gender,
    bloodGroup,
    dateOfBirth,
    dateOfJoining,
    phone,
    email,
    education,
    qualification,
    designation,
    password,
  } = req.body;

  // 1) Parse the year from dateOfJoining and compute prefix (last two digits)
  //    Assuming dateOfJoining is in 'YYYY-MM-DD' format (ISO).
  const doj = new Date(dateOfJoining);
  if (isNaN(doj.getTime())) {
    return res.status(400).json({ message: "Invalid dateOfJoining format." });
  }
  const yearFull = doj.getUTCFullYear(); // e.g. 2025
  const yearTwoDigits = String(yearFull).slice(-2); // e.g. '25'

  try {
    // 2) Count how many employees are already in `verified` for that year
    const countQuery = `
      SELECT COUNT(*) AS cnt 
        FROM verified 
       WHERE YEAR(dateOfJoining) = ?
    `;
    const [countRows]: any[] = await db.query(countQuery, [yearFull]);
    const existingCount = (countRows[0]?.cnt as number) || 0;
    const nextSerial = existingCount + 1; // e.g. 27 if existingCount was 26

    // 3) Zero-pad nextSerial to 4 digits
    const serialPadded = String(nextSerial).padStart(4, "0"); // e.g. '0027'

    // 4) Build the final employeeID
    const employeeID = `${yearTwoDigits}${serialPadded}`; // e.g. '250027'

    // 5) Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // 6) Insert into notVerified (we store the candidate’s data + the generated employeeID)
    const insertQuery = `
      INSERT INTO notVerified (
        employeeID,
        firstName,
        lastName,
        gender,
        bloodGroup,
        dateOfBirth,
        dateOfJoining,
        phoneNo,
        email,
        education,
        qualification,
        designation,
        password
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db
      .query(insertQuery, [
        employeeID,
        firstName,
        lastName,
        gender,
        bloodGroup,
        dateOfBirth,
        dateOfJoining,
        phone,
        email,
        education,
        qualification,
        designation,
        hashedPassword,
      ]);

    return res.status(201).json({
      message: "Signup request submitted. Please wait for admin approval.",
      assignedEmployeeID: employeeID,
    });
  } catch (err) {
    console.error("Error during signup:", err);
    return res.status(500).json({
      message: "Error inserting data into notVerified",
      error: err,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const [users]: any = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const userRole = String(user.role).trim().toLowerCase();
    const allowedRoles = ["admin", "employee"];
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Unauthorized role detected." });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: userRole },
      jwtSecret,
      { expiresIn: tokenExpiry }
    );

    res.status(200).json({
      accessToken: token,
      role: userRole,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
