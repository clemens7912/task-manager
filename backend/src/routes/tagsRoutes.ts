import { createTag, deleteTag, getTags, updateTag } from './../controllers/tagController';
import { verifyToken } from './../middleware/authMiddleware';
import { Router } from "express";


const router = Router();

router.post('/', verifyToken, createTag);
router.put('/:id', verifyToken, updateTag);
router.get('/', verifyToken, getTags);
router.delete('/:id', verifyToken, deleteTag);

export default router;