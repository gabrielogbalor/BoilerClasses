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
  courseId: { 
    type: String, 
    required: true, 
    unique: true // This is the only unique index we want
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  credits: { type: Number, required: true },
  prerequisites: { type: [String], default: [] },
  restrictions: { type: String },
  semester: { type: [String], default: [] }
}, {
  // Add timestamps if you want to track creation/update times
  timestamps: true,
  // This will prevent adding fields that aren't in the schema
  strict: true
});

// Drop existing model if it exists during development
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Course;
}

// Create and export the model
export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
