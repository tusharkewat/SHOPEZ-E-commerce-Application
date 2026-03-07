import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    image_url: { type: String, required: true },
  },
  { timestamps: true }
);

export const Banner = mongoose.model('Banner', bannerSchema);
