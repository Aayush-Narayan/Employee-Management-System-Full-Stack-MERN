import express from 'express';
import cors from 'cors';
import authRoutes from './Routes/authRoutes.js';
import adminRoutes from './Routes/adminRoutes.js';
import employeeRoutes from './Routes/employeeRoutes.js';
import dotenv from 'dotenv';
import db from './Models/db.js';

dotenv.config();

const app = express();
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

const PORT = process.env.PORT;

// 1) Auth routes (signup / login)
app.use('/api/auth', authRoutes);

// 2) Admin routes (approve signups, etc.)
app.use('/api/admin', adminRoutes);

// 3) Employee routes (profile, attendance, leaves, payroll)
app.use('/api/employee', employeeRoutes);

// Try connecting to the database first
(async () => {
  try {
    const connection = await db.getConnection();
    connection.release();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err: any) {
    console.error('Error while connecting with backend:', err.message);
    process.exit(1);
  }
})();
