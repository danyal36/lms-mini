import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { createCourse, listCourses, getCourse, updateCourse, deleteCourse } from '../controllers/courseController';
import { createLesson, listLessons } from '../controllers/lessonController';

const router = Router();

router.post('/', asyncHandler(createCourse));
router.get('/', asyncHandler(listCourses));
router.get('/:id', asyncHandler(getCourse));
router.put('/:id', asyncHandler(updateCourse));
router.delete('/:id', asyncHandler(deleteCourse));

router.post('/:courseId/lessons', asyncHandler(createLesson));
router.get('/:courseId/lessons', asyncHandler(listLessons));

export default router;
