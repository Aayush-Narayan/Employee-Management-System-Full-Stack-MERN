// types/express/index.d.ts
import { JwtPayload } from "../../Controllers/employeeController";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: JwtPayload;
    }
  }
}
