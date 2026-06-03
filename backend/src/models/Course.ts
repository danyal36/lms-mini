import { Schema, model, Document, Types } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: Types.ObjectId;
  category: string;
  published: boolean;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true, trim: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Course = model<ICourse>('Course', courseSchema);
