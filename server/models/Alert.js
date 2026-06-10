const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    type: { type: String, enum: ['keyword', 'price'], default: 'keyword' },
    keyword: { type: String, trim: true, default: '' },
    // Price alert fields
    tokenId: { type: String, default: '' },       // CoinGecko ID
    tokenSymbol: { type: String, default: '' },
    priceTarget: { type: Number, default: null },
    priceDirection: { type: String, enum: ['above', 'below'], default: 'above' },
    enabled: { type: Boolean, default: true },
    // Matches log
    lastTriggeredAt: { type: Date, default: null },
    triggerCount: { type: Number, default: 0 },
    recentMatches: [
      {
        articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
        title: String,
        url: String,
        matchedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
