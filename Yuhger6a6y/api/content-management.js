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
        const galleryFiles = await fs.readdir(galleryDir);
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
        
        // Verify the path is within the gallery directory to prevent directory traversal
        const resolvedImagePath = path.resolve(imagePath);
        const resolvedGalleryDir = path.resolve(path.join(deploymentDir, 'gallery'));
        
        if (!resolvedImagePath.startsWith(resolvedGalleryDir)) {
          return res.status(400).json({ error: 'Invalid file path' });
        }
        
        try {
          await fs.unlink(imagePath);
          
          // Also try to delete from the main gallery directory if it exists there
          const mainGalleryPath = path.join(baseDir, 'gallery', target);
          const resolvedMainGalleryPath = path.resolve(mainGalleryPath);
          
          if (resolvedMainGalleryPath.startsWith(path.resolve(path.join(baseDir, 'gallery')))) {
            try {
              await fs.unlink(mainGalleryPath);
            } catch (e) {
              // File might not exist in main gallery, which is fine
            }
          }
          
          return res.status(200).json({ message: 'Image deleted successfully' });
        } catch (error) {
          return res.status(500).json({ error: 'Failed to delete image: ' + error.message });
        }

      case 'get-music':
        // Return list of music tracks
        const musicDir = path.join(deploymentDir, 'player');
        const musicFiles = await fs.readdir(musicDir);
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
        
        // Verify the path is within the player directory to prevent directory traversal
        const resolvedTrackPath = path.resolve(trackPath);
        const resolvedPlayerDir = path.resolve(path.join(deploymentDir, 'player'));
        
        if (!resolvedTrackPath.startsWith(resolvedPlayerDir)) {
          return res.status(400).json({ error: 'Invalid file path' });
        }
        
        try {
          await fs.unlink(trackPath);
          
          // Also try to delete from the main player directory if it exists there
          const mainPlayerPath = path.join(baseDir, 'player', target);
          const resolvedMainPlayerPath = path.resolve(mainPlayerPath);
          
          if (resolvedMainPlayerPath.startsWith(path.resolve(path.join(baseDir, 'player')))) {
            try {
              await fs.unlink(mainPlayerPath);
            } catch (e) {
              // File might not exist in main player, which is fine
            }
          }
          
          return res.status(200).json({ message: 'Track deleted successfully' });
        } catch (error) {
          return res.status(500).json({ error: 'Failed to delete track: ' + error.message });
        }

      case 'get-albums':
        // Read albums from the albums.json file
        const albumsFilePath = path.join(deploymentDir, 'albums.json');
        try {
          const albumsContent = await fs.readFile(albumsFilePath, 'utf8');
          const albums = JSON.parse(albumsContent);
          return res.status(200).json({ albums });
        } catch (error) {
          if (error.code === 'ENOENT') {
            // If albums file doesn't exist, return an empty array
            return res.status(200).json({ albums: [] });
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
        try {
          let existingAlbums = [];
          try {
            const albumsContent = await fs.readFile(albumsFilePathDelete, 'utf8');
            existingAlbums = JSON.parse(albumsContent);
          } catch (error) {
            if (error.code !== 'ENOENT') {
              throw error;
            }
          }
          
          // Filter out the album to delete
          const updatedAlbums = existingAlbums.filter(album => album.id.toString() !== target);
          
          // Write updated albums back to file
          await fs.writeFile(albumsFilePathDelete, JSON.stringify(updatedAlbums, null, 2));
          
          return res.status(200).json({ message: 'Album deleted successfully' });
        } catch (error) {
          return res.status(500).json({ error: 'Failed to delete album: ' + error.message });
        }

      case 'delete-user':
        if (!target) {
          return res.status(400).json({ error: 'Target user not specified' });
        }
        
        const usersFilePathDelete = path.join(deploymentDir, 'users.json');
        try {
          let existingUsers = [];
          try {
            const usersContent = await fs.readFile(usersFilePathDelete, 'utf8');
            existingUsers = JSON.parse(usersContent);
          } catch (error) {
            if (error.code !== 'ENOENT') {
              throw error;
            }
          }
          
          // Filter out the user to delete
          const updatedUsers = existingUsers.filter(user => user.id.toString() !== target);
          
          // Write updated users back to file
          await fs.writeFile(usersFilePathDelete, JSON.stringify(updatedUsers, null, 2));
          
          return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
          return res.status(500).json({ error: 'Failed to delete user: ' + error.message });
        }

      case 'get-settings':
        // Return current site settings
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