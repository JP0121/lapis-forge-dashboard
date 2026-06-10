const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, enum: ['depin', 'ai', 'crypto', 'infra'], default: 'depin' },
    status: { type: String, enum: ['active', 'watching', 'paused', 'retired'], default: 'watching' },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    website: { type: String, default: '' },
    docsUrl: { type: String, default: '' },
    dashboardUrl: { type: String, default: '' },
    tokenSymbol: { type: String, uppercase: true, trim: true, default: '' },
    tokenId: { type: String, default: '' }, // CoinGecko ID for price lookup
    keywords: { type: [String], default: [] }, // Used to match articles to this project
    notes: { type: String, maxlength: 2000, default: '' },
    roi: {
      invested: { type: Number, default: 0 },
      earned: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      notes: { type: String, default: '' },
    },
    nodeCount: { type: Number, default: 0 },
    hostingPlatform: { type: String, default: '' }, // e.g. "Oracle Cloud", "Hetzner"
    color: { type: String, default: '#7c3aed' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
