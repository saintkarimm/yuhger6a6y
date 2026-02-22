// API endpoint for content management operations
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

  try {
    const { operation, target } = req.query;
    const body = req.body || {};

    // Define base directory paths
    const baseDir = process.cwd();
    const deploymentDir = path.join(baseDir, 'deployment-package');
    
    switch (operation) {
      case 'get-gallery':
        // Return list of gallery images
        const galleryDir = path.join(deploymentDir, 'gallery');
        let galleryFiles = [];
        
        try {
          galleryFiles = await fs.readdir(galleryDir);
        } catch (error) {
          if (error.code === 'ENOENT') {
            // Directory doesn't exist, try the main directory
            const mainGalleryDir = path.join(baseDir, 'gallery');
            try {
              galleryFiles = await fs.readdir(mainGalleryDir);
            } catch (mainError) {
              if (mainError.code === 'ENOENT') {
                // Neither directory exists, return empty array
                return res.status(200).json({ images: [] });
              } else {
                throw mainError;
              }
            }
          } else {
            throw error;
          }
        }
        
        const galleryImages = galleryFiles.filter(file => 
          /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        ).map(file => ({
          id: file.split('.')[0], // Use filename without extension as ID
          name: file,
          url: `/gallery/${file}`,
          size: 0 // Will be populated if needed
        }));
        
        return res.status(200).json({ images: galleryImages });

      case 'delete-image':
        if (!target) {
          return res.status(400).json({ error: 'Target image not specified' });
        }
        
        const imagePath = path.join(deploymentDir, 'gallery', target);
        const mainImagePath = path.join(baseDir, 'gallery', target);
        
        // Verify the path is within the gallery directory to prevent directory traversal
        const resolvedImagePath = path.resolve(imagePath);
        const resolvedMainImagePath = path.resolve(mainImagePath);
        const resolvedGalleryDir = path.resolve(path.join(deploymentDir, 'gallery'));
        const resolvedMainGalleryDir = path.resolve(path.join(baseDir, 'gallery'));
        
        if (!resolvedImagePath.startsWith(resolvedGalleryDir)) {
          return res.status(400).json({ error: 'Invalid file path' });
        }
        
        if (!resolvedMainImagePath.startsWith(resolvedMainGalleryDir)) {
          return res.status(400).json({ error: 'Invalid file path' });
        }
        
        let imageDeletedCount = 0;
        let imageErrorMessages = [];
        
        // Try to delete from deployment directory
        try {
          await fs.unlink(imagePath);
          imageDeletedCount++;
        } catch (error) {
          imageErrorMessages.push(`Deployment gallery: ${error.message}`);
        }
        
        // Try to delete from main directory
        try {
          await fs.unlink(mainImagePath);
          imageDeletedCount++;
        } catch (error) {
          imageErrorMessages.push(`Main gallery: ${error.message}`);
        }
        
        if (imageDeletedCount === 0) {
          return res.status(500).json({ 
            error: 'Failed to delete image from both locations', 
            details: imageErrorMessages 
          });
        }
        
        return res.status(200).json({ 
          message: `Image deleted successfully from ${imageDeletedCount} location(s)` 
        });

      case 'get-music':
        // Return list of music tracks
        const musicDir = path.join(deploymentDir, 'player');
        let musicFiles = [];
        
        try {
          musicFiles = await fs.readdir(musicDir);
        } catch (error) {
          if (error.code === 'ENOENT') {
            // Directory doesn't exist, try the main directory
            const mainMusicDir = path.join(baseDir, 'player');
            try {
              musicFiles = await fs.readdir(mainMusicDir);
            } catch (mainError) {
              if (mainError.code === 'ENOENT') {
                // Neither directory exists, return empty array
                return res.status(200).json({ tracks: [] });
              } else {
                throw mainError;
              }
            }
          } else {
            throw error;
          }
        }
        
        const musicTracks = musicFiles.filter(file => 
          /\.(mp3|m4a|wav|flac)$/i.test(file)
        ).map(file => ({
          id: file.split('.')[0],
          title: file.replace(/\.[^/.]+$/, ""), // Remove extension for title
          url: `/player/${file}`,
          filename: file
        }));
        
        return res.status(200).json({ tracks: musicTracks });

      case 'delete-track':
        if (!target) {
          return res.status(400).json({ error: 'Target track not specified' });
        }
        
        const trackPath = path.join(deploymentDir, 'player', target);
        const mainTrackPath = path.join(baseDir, 'player', target);
        
        // Verify the path is within the player directory to prevent directory traversal
        const resolvedTrackPath = path.resolve(trackPath);
        const resolvedMainTrackPath = path.resolve(mainTrackPath);
        const resolvedPlayerDir = path.resolve(path.join(deploymentDir, 'player'));
        const resolvedMainPlayerDir = path.resolve(path.join(baseDir, 'player'));
        
        if (!resolvedTrackPath.startsWith(resolvedPlayerDir)) {
          return res.status(400).json({ error: 'Invalid file path' });
        }
        
        if (!resolvedMainTrackPath.startsWith(resolvedMainPlayerDir)) {
          return res.status(400).json({ error: 'Invalid file path' });
        }
        
        let trackDeletedCount = 0;
        let trackErrorMessages = [];
        
        // Try to delete from deployment directory
        try {
          await fs.unlink(trackPath);
          trackDeletedCount++;
        } catch (error) {
          trackErrorMessages.push(`Deployment player: ${error.message}`);
        }
        
        // Try to delete from main directory
        try {
          await fs.unlink(mainTrackPath);
          trackDeletedCount++;
        } catch (error) {
          trackErrorMessages.push(`Main player: ${error.message}`);
        }
        
        if (trackDeletedCount === 0) {
          return res.status(500).json({ 
            error: 'Failed to delete track from both locations', 
            details: trackErrorMessages 
          });
        }
        
        return res.status(200).json({ 
          message: `Track deleted successfully from ${trackDeletedCount} location(s)` 
        });

      case 'get-albums':
        // Read albums from the albums.json file
        const albumsFilePath = path.join(deploymentDir, 'albums.json');
        try {
          const albumsContent = await fs.readFile(albumsFilePath, 'utf8');
          const albums = JSON.parse(albumsContent);
          return res.status(200).json({ albums });
        } catch (error) {
          if (error.code === 'ENOENT') {
            // If albums file doesn't exist in deployment dir, try main directory
            const mainAlbumsPath = path.join(baseDir, 'albums.json');
            try {
              const mainAlbumsContent = await fs.readFile(mainAlbumsPath, 'utf8');
              const albums = JSON.parse(mainAlbumsContent);
              return res.status(200).json({ albums });
            } catch (mainError) {
              if (mainError.code === 'ENOENT') {
                // If neither file exists, return sample albums from the website structure
                const sampleAlbums = [
                  { id: 1, name: 'YugerLife', artist: 'Yuhger6a6y', year: '2026', cover: '/images/album-3girls.jpeg' },
                  { id: 2, name: 'World on drugs', artist: 'Yuhger6a6y', year: '2025', cover: '/images/World on drugs.jpeg' },
                  { id: 3, name: 'Breakthrough', artist: 'Yuhger6a6y', year: '2024', cover: '/images/breakthrough.JPG' }
                ];
                return res.status(200).json({ albums: sampleAlbums });
              } else {
                throw mainError;
              }
            }
          }
          throw error;
        }

      case 'get-users':
        // Read users from the users.json file
        const usersFilePath = path.join(deploymentDir, 'users.json');
        try {
          const usersContent = await fs.readFile(usersFilePath, 'utf8');
          const users = JSON.parse(usersContent);
          // Don't return passwords
          const usersWithoutPasswords = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
          });
          return res.status(200).json({ users: usersWithoutPasswords });
        } catch (error) {
          if (error.code === 'ENOENT') {
            // If users file doesn't exist, return an empty array
            return res.status(200).json({ users: [] });
          }
          throw error;
        }

      case 'delete-album':
        if (!target) {
          return res.status(400).json({ error: 'Target album not specified' });
        }
        
        const albumsFilePathDelete = path.join(deploymentDir, 'albums.json');
        const mainAlbumsFilePathDelete = path.join(baseDir, 'albums.json');
        
        // Try to read from deployment directory first, then main directory
        let existingAlbums = [];
        let albumSourcePath = null;
        
        try {
          const albumsContent = await fs.readFile(albumsFilePathDelete, 'utf8');
          existingAlbums = JSON.parse(albumsContent);
          albumSourcePath = albumsFilePathDelete;
        } catch (error) {
          if (error.code === 'ENOENT') {
            try {
              const mainAlbumsContent = await fs.readFile(mainAlbumsFilePathDelete, 'utf8');
              existingAlbums = JSON.parse(mainAlbumsContent);
              albumSourcePath = mainAlbumsFilePathDelete;
            } catch (mainError) {
              if (mainError.code === 'ENOENT') {
                // Neither file exists, return success (nothing to delete)
                return res.status(200).json({ message: 'Album deleted successfully' });
              } else {
                throw mainError;
              }
            }
          } else {
            throw error;
          }
        }
        
        // Filter out the album to delete
        const updatedAlbums = existingAlbums.filter(album => album.id.toString() !== target);
        
        // Write updated albums to both files if they exist
        await fs.writeFile(albumsFilePathDelete, JSON.stringify(updatedAlbums, null, 2));
        
        try {
          await fs.writeFile(mainAlbumsFilePathDelete, JSON.stringify(updatedAlbums, null, 2));
        } catch (mainWriteError) {
          // If writing to main directory fails, it's ok as long as deployment directory is updated
          console.warn('Warning: Could not update albums in main directory:', mainWriteError.message);
        }
        
        return res.status(200).json({ message: 'Album deleted successfully' });

      case 'delete-user':
        if (!target) {
          return res.status(400).json({ error: 'Target user not specified' });
        }
        
        const usersFilePathDelete = path.join(deploymentDir, 'users.json');
        const mainUsersFilePathDelete = path.join(baseDir, 'users.json');
        
        // Try to read from deployment directory first, then main directory
        let existingUsers = [];
        let userSourcePath = null;
        
        try {
          const usersContent = await fs.readFile(usersFilePathDelete, 'utf8');
          existingUsers = JSON.parse(usersContent);
          userSourcePath = usersFilePathDelete;
        } catch (error) {
          if (error.code === 'ENOENT') {
            try {
              const mainUsersContent = await fs.readFile(mainUsersFilePathDelete, 'utf8');
              existingUsers = JSON.parse(mainUsersContent);
              userSourcePath = mainUsersFilePathDelete;
            } catch (mainError) {
              if (mainError.code === 'ENOENT') {
                // Neither file exists, return success (nothing to delete)
                return res.status(200).json({ message: 'User deleted successfully' });
              } else {
                throw mainError;
              }
            }
          } else {
            throw error;
          }
        }
        
        // Filter out the user to delete
        const updatedUsers = existingUsers.filter(user => user.id.toString() !== target);
        
        // Write updated users to both files if they exist
        await fs.writeFile(usersFilePathDelete, JSON.stringify(updatedUsers, null, 2));
        
        try {
          await fs.writeFile(mainUsersFilePathDelete, JSON.stringify(updatedUsers, null, 2));
        } catch (mainWriteError) {
          // If writing to main directory fails, it's ok as long as deployment directory is updated
          console.warn('Warning: Could not update users in main directory:', mainWriteError.message);
        }
        
        return res.status(200).json({ message: 'User deleted successfully' });

      case 'get-settings':
        // First try to read from settings.json in deployment directory
        const settingsFilePath = path.join(deploymentDir, 'settings.json');
        try {
          const settingsContent = await fs.readFile(settingsFilePath, 'utf8');
          const settings = JSON.parse(settingsContent);
          return res.status(200).json(settings);
        } catch (error) {
          if (error.code === 'ENOENT') {
            // If settings file doesn't exist in deployment dir, try main directory
            const mainSettingsPath = path.join(baseDir, 'settings.json');
            try {
              const mainSettingsContent = await fs.readFile(mainSettingsPath, 'utf8');
              const settings = JSON.parse(mainSettingsContent);
              return res.status(200).json(settings);
            } catch (mainError) {
              if (mainError.code === 'ENOENT') {
                // If no settings file exists, return default settings
                const settings = {
                  general: {
                    siteTitle: 'Yuhger6a6y Creative Platform',
                    siteDescription: 'A creative platform for music and photography',
                    siteUrl: 'https://yuhger6a6y.vercel.app'
                  },
                  appearance: {
                    primaryColor: '#D4AF37',
                    secondaryColor: '#0B0B0D',
                    accentColor: '#f4e04d',
                    enableAnimations: true,
                    enableParticles: true
                  },
                  integrations: {
                    gaMeasurementId: 'G-YDP7BENSY6',
                    gaPropertyId: '',
                    instagramUrl: 'https://instagram.com/yuhger6a6y',
                    spotifyUrl: 'https://open.spotify.com/artist/yuhger6a6y',
                    youtubeUrl: 'https://youtube.com/@yuhger6a6y'
                  }
                };
                return res.status(200).json(settings);
              } else {
                throw mainError;
              }
            }
          }
          throw error;
        }

      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }
  } catch (error) {
    console.error('Content management API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};