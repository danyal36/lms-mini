import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireAuth, requireRole } from '../middleware/auth';
import { getLesson, updateLesson, deleteLesson } from '../controllers/lessonController';

const router = Router();

const instructorOnly = [requireAuth, requireRole('instructor')];

router.get('/:id', asyncHandler(getLesson));
router.put('/:id', ...instructorOnly, asyncHandler(updateLesson));
router.delete('/:id', ...instructorOnly, asyncHandler(deleteLesson));

export default router;
