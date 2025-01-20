import mongoose from 'mongoose';

const { Schema } = mongoose;

const settingsSchema = new Schema({
  siteTitle: { type: String, required: true , unique: true },
  aboutUs: { type: String, },
  contactEmail: { type: String, required: true , unique:true},
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
  },
  logoUrl: { type: String },  // URL to the site's logo
  metaDescription: { type: String },
  metaKeywords: { type: [String] },  // Array of meta keywords
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
