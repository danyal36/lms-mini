import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Course } from '../models/Course';
import type { ICourse } from '../models/Course';
import { Lesson } from '../models/Lesson';

function validId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}

interface CreateCourseBody {
  title?: string;
  description?: string;
  instructor?: string;
  category?: string;
  published?: boolean;
}

export async function createCourse(req: Request, res: Response): Promise<void> {
  const { title, description, instructor, category, published } = req.body as CreateCourseBody;

  if (!title || !description || !instructor || !category) {
    res.status(400).json({ error: 'title, description, instructor, and category are required' });
    return;
  }
  if (!validId(instructor)) {
    res.status(400).json({ error: 'instructor must be a valid ObjectId' });
    return;
  }

  const course = await Course.create({ title, description, instructor, category, published });
  res.status(201).json({ data: course });
}

export async function listCourses(req: Request, res: Response): Promise<void> {
  const published =
    req.query['published'] !== undefined ? req.query['published'] === 'true' : undefined;
  const category =
    typeof req.query['category'] === 'string' ? req.query['category'] : undefined;

  const courses = await Course.find({
    ...(published !== undefined && { published }),
    ...(category !== undefined && { category }),
  }).populate('instructor', 'name email');
  res.json({ data: courses });
}

export async function getCourse(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  if (!validId(id)) {
    res.status(400).json({ error: 'Invalid course id' });
    return;
  }

  const course = await Course.findById(id).populate('instructor', 'name email');
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  res.json({ data: course });
}

export async function updateCourse(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  if (!validId(id)) {
    res.status(400).json({ error: 'Invalid course id' });
    return;
  }

  const body = req.body as Partial<Pick<ICourse, 'title' | 'description' | 'category' | 'published' | 'instructor'>>;
  const course = await Course.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).populate('instructor', 'name email');

  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  res.json({ data: course });
}

export async function deleteCourse(req: Request, res: Response): Promise<void> {
  const id = req.params['id'] as string;
  if (!validId(id)) {
    res.status(400).json({ error: 'Invalid course id' });
    return;
  }

  const course = await Course.findByIdAndDelete(id);
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  const { deletedCount } = await Lesson.deleteMany({ courseId: id });
  res.json({ data: { message: 'Course and its lessons deleted', lessonsDeleted: deletedCount } });
}
