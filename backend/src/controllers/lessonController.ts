import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Lesson, ILesson } from '../models/Lesson';
import { Course } from '../models/Course';

function validId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}

async function ownsCourse(courseId: string, userId: string): Promise<boolean | null> {
  const course = await Course.findById(courseId);
  if (!course) return null;
  return course.instructor.toString() === userId;
}

interface CreateLessonBody {
  title?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
}

export async function createLesson(req: Request, res: Response): Promise<void> {
  const courseId = req.params['courseId'] as string;
  if (!validId(courseId)) {
    res.status(400).json({ error: 'Invalid courseId' });
    return;
  }

  const owns = await ownsCourse(courseId, req.user!.userId);
  if (owns === null) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  if (!owns) {
    res.status(403).json({ error: 'You do not own this course' });
    return;
  }

  const { title, content, videoUrl, order } = req.body as CreateLessonBody;
  if (!title || !content || order === undefined) {
    res.status(400).json({ error: 'title, content, and order are required' });
    return;
  }

  const lesson = await Lesson.create({ courseId, title, content, videoUrl, order });
  res.status(201).json({ data: lesson });
}

export async function listLessons(req: Request, res: Response): Promise<void> {
  const courseId = req.params['courseId'] as string;
  if (!validId(courseId)) {
    res.status(400).json({ error: 'Invalid courseId' });
    return;
  }

  const lessons = await Lesson.find({ courseId }).sort({ order: 1 });
  res.json({ data: lessons });
}

export async function getLesson(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  if (!validId(id)) {
    res.status(400).json({ error: 'Invalid lesson id' });
    return;
  }

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  res.json({ data: lesson });
}

export async function updateLesson(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  if (!validId(id)) {
    res.status(400).json({ error: 'Invalid lesson id' });
    return;
  }

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }

  const owns = await ownsCourse(lesson.courseId.toString(), req.user!.userId);
  if (owns === null) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  if (!owns) {
    res.status(403).json({ error: 'You do not own this course' });
    return;
  }

  const body = req.body as Partial<Pick<ILesson, 'title' | 'content' | 'videoUrl' | 'order'>>;
  const updated = await Lesson.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  res.json({ data: updated });
}

export async function deleteLesson(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  if (!validId(id)) {
    res.status(400).json({ error: 'Invalid lesson id' });
    return;
  }

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }

  const owns = await ownsCourse(lesson.courseId.toString(), req.user!.userId);
  if (owns === null) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  if (!owns) {
    res.status(403).json({ error: 'You do not own this course' });
    return;
  }

  await Lesson.findByIdAndDelete(id);
  res.json({ data: { message: 'Lesson deleted' } });
}
