import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  _id: string;
  courseCode: string;
  name: string;
  comment: string;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>({
  courseCode: { type: String, required: true },
  name: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true }
}, { 
  timestamps: true 
});

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
