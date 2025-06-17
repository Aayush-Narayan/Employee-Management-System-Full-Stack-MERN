// Backend\src\Routes\authRoutes.ts
import { Router } from 'express';
import { signup, login } from '../Controllers/authController.js';
import verifyToken from '../Middleware/verifyToken.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

// Example of a protected route
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected profile route', userId: req.userId, email: req.userEmail });
});

export default router;
