import { Schema, model, Document, Types } from 'mongoose';

export interface IEnrollment extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  progress: number;
  completedLessons: Types.ObjectId[];
  enrolledAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Enrollment = model<IEnrollment>('Enrollment', enrollmentSchema);
