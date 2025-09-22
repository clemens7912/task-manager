import { isBoardMember, isCardMember } from './../middleware/authorizationMiddleware';
import { createCard, deleteCard, getCards, updateCard, updateCardColumn } from './../controllers/cardsController';
import { verifyToken } from './../middleware/authMiddleware';
import { Router } from "express";

const router = Router();

router.get('/', [verifyToken], getCards);
router.post('/', [verifyToken, isCardMember], createCard);
router.put('/:id', [verifyToken, isCardMember], updateCard);
router.put('/:id/column', [verifyToken, isCardMember], updateCardColumn);

router.delete('/:id', [verifyToken, isCardMember], deleteCard);

export default router;