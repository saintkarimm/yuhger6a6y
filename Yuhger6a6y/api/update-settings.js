// API endpoint for updating site settings
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({ error: 'Type and data are required' });
    }

    // Define paths for the settings files (both deployment and main directories)
    const settingsFilePath = path.join(process.cwd(), 'deployment-package', 'settings.json');
    const mainSettingsFilePath = path.join(process.cwd(), 'settings.json');

    // Read existing settings from deployment directory first
    let existingSettings = {};
    try {
      const settingsContent = await fs.readFile(settingsFilePath, 'utf8');
      existingSettings = JSON.parse(settingsContent);
    } catch (error) {
      // If settings file doesn't exist in deployment dir, try main directory
      if (error.code === 'ENOENT') {
        try {
          const mainSettingsContent = await fs.readFile(mainSettingsFilePath, 'utf8');
          existingSettings = JSON.parse(mainSettingsContent);
        } catch (mainError) {
          // If neither exists, start with empty object
          if (mainError.code !== 'ENOENT') {
            console.error('Error reading settings file:', mainError);
          }
        }
      } else {
        console.error('Error reading settings file:', error);
      }
    }

    // Update the specific setting type
    existingSettings[type] = { ...existingSettings[type], ...data };

    // Write updated settings to both files to keep them in sync
    await fs.writeFile(settingsFilePath, JSON.stringify(existingSettings, null, 2));
    await fs.writeFile(mainSettingsFilePath, JSON.stringify(existingSettings, null, 2));

    // For immediate effect, you might also want to update related configuration files
    // depending on the type of setting that was changed
    switch (type) {
      case 'general':
        // Update any general site configuration if needed
        break;
      case 'appearance':
        // Update theme-related configurations if needed
        break;
      case 'integrations':
        // Update integration-related configurations if needed
        break;
      default:
        // Unknown setting type
        break;
    }

    res.status(200).json({
      message: 'Settings updated successfully',
      updatedType: type
    });
  } catch (error) {
    console.error('Update settings API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};