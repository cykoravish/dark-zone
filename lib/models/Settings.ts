import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    upiId: {
      type: String,
      required: true,
      default: 'darkzone@upi',
    },
    qrCodeUrl: {
      type: String,
      default: '',
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 50,
    },
    gstPercentage: {
      type: Number,
      required: true,
      default: 18,
    },
    businessName: {
      type: String,
      required: true,
      default: 'Dark Zone',
    },
    contactEmail: {
      type: String,
      required: true,
      default: 'support@darkzone.com',
    },
  },
  { timestamps: true }
);

export const Settings =
  mongoose.models.Settings || mongoose.model('Settings', settingsSchema);