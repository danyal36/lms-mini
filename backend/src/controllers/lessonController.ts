import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Lesson, ILesson } from '../models/Lesson';
import { Course } from '../models/Course';

function validId(id: string): boolean {
  return mongoose.isValidObjectId(id);
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

  const exists = await Course.exists({ _id: courseId });
  if (!exists) {
    res.status(404).json({ error: 'Course not found' });
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

  const body = req.body as Partial<Pick<ILesson, 'title' | 'content' | 'videoUrl' | 'order'>>;
  const lesson = await Lesson.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  res.json({ data: lesson });
}

export async function deleteLesson(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  if (!validId(id)) {
    res.status(400).json({ error: 'Invalid lesson id' });
    return;
  }

  const lesson = await Lesson.findByIdAndDelete(id);
  if (!lesson) {
    res.status(404).json({ error: 'Lesson not found' });
    return;
  }
  res.json({ data: { message: 'Lesson deleted' } });
}
