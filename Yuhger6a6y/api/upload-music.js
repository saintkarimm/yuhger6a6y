// API endpoint for uploading music tracks
import fs from 'fs/promises';
import path from 'path';
import formidable from 'formidable';

// Disable default body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

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
    // Parse the form data
    const form = new formidable.IncomingForm({
      multiples: true,
      uploadDir: path.join(process.cwd(), 'deployment-package', 'player'),
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // 50MB max file size for music
    });

    // Only allow audio file types
    form.on('fileBegin', (name, file) => {
      // Check file extension
      const ext = path.extname(file.originalFilename).toLowerCase();
      const allowedExtensions = ['.mp3', '.m4a', '.wav', '.flac', '.aac'];
      
      if (!allowedExtensions.includes(ext)) {
        throw new Error(`File type not allowed: ${ext}`);
      }
    });

    // Parse the form and handle the uploaded files
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(500).json({ error: 'Error processing upload' });
      }

      // Handle the uploaded files
      const uploadedFiles = files.tracks; // 'tracks' is the field name from the form
      
      if (!uploadedFiles) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // Ensure uploadedFiles is an array
      const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
      
      // Copy files to the main player directory as well
      for (const file of fileArray) {
        const fileName = path.basename(file.filepath);
        const mainPlayerPath = path.join(process.cwd(), 'player', fileName);
        
        try {
          // Copy file to main player directory as well
          await fs.copyFile(file.filepath, mainPlayerPath);
        } catch (copyErr) {
          // If copying to main player fails, it's not critical, just log it
          console.warn('Warning: Could not copy file to main player:', copyErr.message);
        }
      }

      res.status(200).json({
        message: 'Music tracks uploaded successfully',
        fileCount: fileArray.length,
        files: fileArray.map(file => ({
          name: path.basename(file.filepath),
          size: file.size,
          type: file.mimetype
        }))
      });
    });
  } catch (error) {
    console.error('Upload music API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}