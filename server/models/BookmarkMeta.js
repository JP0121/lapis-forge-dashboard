const mongoose = require('mongoose');

const bookmarkMetaSchema = new mongoose.Schema(
  {
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true, unique: true },
    tags: { type: [String], default: [] },
    notes: { type: String, maxlength: 2000, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BookmarkMeta', bookmarkMetaSchema);
