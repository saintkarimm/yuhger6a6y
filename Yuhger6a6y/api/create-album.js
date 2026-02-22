// API endpoint for creating albums
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
    const { name, artist, description, cover } = req.body;

    if (!name || !artist) {
      return res.status(400).json({ error: 'Album name and artist are required' });
    }

    // Define the path for the albums data file
    const albumsFilePath = path.join(process.cwd(), 'deployment-package', 'albums.json');

    // Read existing albums
    let existingAlbums = [];
    try {
      const albumsContent = await fs.readFile(albumsFilePath, 'utf8');
      existingAlbums = JSON.parse(albumsContent);
    } catch (error) {
      // If albums file doesn't exist, start with empty array
      if (error.code !== 'ENOENT') {
        console.error('Error reading albums file:', error);
      }
    }

    // Create new album object
    const newAlbum = {
      id: Date.now(), // Simple ID generation
      name,
      artist,
      description: description || '',
      cover: cover || '/images/album-3girls.jpeg', // Default cover if none provided
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add the new album to the array
    existingAlbums.push(newAlbum);

    // Write updated albums back to file
    await fs.writeFile(albumsFilePath, JSON.stringify(existingAlbums, null, 2));

    res.status(200).json({
      message: 'Album created successfully',
      album: newAlbum
    });
  } catch (error) {
    console.error('Create album API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};