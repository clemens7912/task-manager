import { createColumn, getColumns } from './../controllers/columnController';
import { verifyToken } from './../middleware/authMiddleware';
import { Router } from "express";


const router = Router()

router.post('/', verifyToken, createColumn);
router.get('/', verifyToken, getColumns);

export default router;