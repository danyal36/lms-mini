import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { requireAuth, requireRole } from '../middleware/auth';
import { createCourse, listCourses, getCourse, updateCourse, deleteCourse } from '../controllers/courseController';
import { createLesson, listLessons } from '../controllers/lessonController';

const router = Router();

const instructorOnly = [requireAuth, requireRole('instructor')];

router.post('/', ...instructorOnly, asyncHandler(createCourse));
router.get('/', asyncHandler(listCourses));
router.get('/:id', asyncHandler(getCourse));
router.put('/:id', ...instructorOnly, asyncHandler(updateCourse));
router.delete('/:id', ...instructorOnly, asyncHandler(deleteCourse));

router.post('/:courseId/lessons', ...instructorOnly, asyncHandler(createLesson));
router.get('/:courseId/lessons', asyncHandler(listLessons));

export default router;
