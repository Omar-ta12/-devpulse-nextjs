import mongoose from 'mongoose';

const savedPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Number, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  userId: { type: Number }, // original userId from jsonplaceholder post
}, { timestamps: true });

// Prevent the same user from saving the same post twice
savedPostSchema.index({ user: 1, postId: 1 }, { unique: true });

// Handle Next.js hot reloading
const SavedPost = mongoose.models.SavedPost || mongoose.model('SavedPost', savedPostSchema);

export default SavedPost;
