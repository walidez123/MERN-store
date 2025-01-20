import Settings from '../models/settings.model.js';

// Get website settings
// Get website settings
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      await createDefaultSettings(); // Ensure a default settings document is created
    }
    const updatedSettings = await Settings.findOne();
    res.status(200).json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update website settings
export const updateSettings = async (req, res) => {
  const { siteTitle,aboutUs, contactEmail, socialLinks, logoUrl, metaDescription, metaKeywords } = req.body;
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    // Update the settings fields
    settings.siteTitle = siteTitle || settings.siteTitle;
    settings.contactEmail = contactEmail || settings.contactEmail;
    settings.socialLinks = socialLinks || settings.socialLinks;
    settings.logoUrl = logoUrl || settings.logoUrl;
    settings.metaDescription = metaDescription || settings.metaDescription;
    settings.metaKeywords = metaKeywords || settings.metaKeywords;
    settings.aboutUs = aboutUs || settings.aboutUs;
    await settings.save();
    res.status(200).json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ensure only one settings document exists
export const createDefaultSettings = async () => {
  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    const defaultSettings = new Settings({
      siteTitle: 'Default Site Title',
      contactEmail: 'contact@example.com',
      aboutUs:'',
      socialLinks: [],
      logoUrl: '',
      metaDescription: '',
      metaKeywords: ''
    });
    await defaultSettings.save();
  }
};
