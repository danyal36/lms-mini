import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { getLesson, updateLesson, deleteLesson } from '../controllers/lessonController';

const router = Router();

router.get('/:id', asyncHandler(getLesson));
router.put('/:id', asyncHandler(updateLesson));
router.delete('/:id', asyncHandler(deleteLesson));

export default router;
