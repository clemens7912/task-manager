import { Router } from "express";
import { getUsers, login, logout, refreshSession, register } from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";


const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/refresh-session', verifyToken, refreshSession);
router.post('/logout', verifyToken, logout);
router.get('/users', verifyToken, getUsers);

export default router;