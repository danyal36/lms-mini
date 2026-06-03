import { Schema, model, Document, Types } from 'mongoose';

export interface ILesson extends Document {
  courseId: Types.ObjectId;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
}

const lessonSchema = new Schema<ILesson>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    videoUrl: { type: String },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Lesson = model<ILesson>('Lesson', lessonSchema);
