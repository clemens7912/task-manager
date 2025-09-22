import { isBoardMember, isBoardOwner } from './../middleware/authorizationMiddleware';
import { verifyToken } from './../middleware/authMiddleware';
import { createBoard, getBoard, getUserBoards, addMember, deleteMember, checkAccess } from './../controllers/boardController';
import { Router } from "express";

const router = Router();

router.get('/:id/member-access', [verifyToken, isBoardMember], checkAccess);

router.get('/', verifyToken, getUserBoards);
router.post('/', verifyToken, createBoard);
router.get('/:id', [verifyToken, isBoardMember], getBoard);

router.post('/members', [verifyToken, isBoardOwner], addMember);
router.post('/members/delete', [verifyToken, isBoardOwner], deleteMember);


export default router;