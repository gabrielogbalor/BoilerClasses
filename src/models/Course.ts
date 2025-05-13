import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  courseId: string;
  title: string;
  description: string;
  credits: number;
  prerequisites?: string[];
  restrictions?: string;
  semester?: string[];
}

const CourseSchema = new Schema<ICourse>({
  courseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  credits: { type: Number, required: true },
  prerequisites: { type: [String], default: [] },
  restrictions: { type: String },
  semester: { type: [String], default: [] }
});

// Prevent duplicate model initialization
export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
