// Backend\src\Middleware\checkRole.ts
import { Request, Response, NextFunction } from 'express';

export const checkRole = (requiredRole: 'admin' | 'employee'): any => {
  return (req: Request, res: Response, next: NextFunction) => {
    // We assume verifyToken stored the user’s role in req.userRole
    const userRole = (req as any).userRole as string;
    if (!userRole || userRole !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
    }
    next();
  };
};
