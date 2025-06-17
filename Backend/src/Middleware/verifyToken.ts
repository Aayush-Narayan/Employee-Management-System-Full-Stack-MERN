// Backend\src\Middleware\verifyToken.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
  role: 'admin' | 'employee';
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userEmail?: string;
      userRole?: 'admin' | 'employee';
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): any => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided!' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Malformed token!' });
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not set in environment variables');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token!' });
    }
    const payload = decoded as JwtPayload;
    req.userId = payload.id;
    req.userEmail = payload.email;
    req.userRole = payload.role;
    next();
  });
};

export default verifyToken;
