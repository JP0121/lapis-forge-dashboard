const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    url: {
      type: String,
      required: true,
      unique: true, // Deduplication key
    },
    urlHash: {
      type: String,
      unique: true, // MD5 of URL for fast dedup lookups
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['depin', 'ai', 'crypto', 'tech'],
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    publishedAt: {
      type: Date,
      required: true,
      index: true,
    },
    fetchedAt: {
      type: Date,
      default: Date.now,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast category + date queries
articleSchema.index({ category: 1, publishedAt: -1 });
articleSchema.index({ isRead: 1, publishedAt: -1 });
articleSchema.index({ isBookmarked: 1, publishedAt: -1 });

module.exports = mongoose.model('Article', articleSchema);
