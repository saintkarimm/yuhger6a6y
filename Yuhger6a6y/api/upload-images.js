// API endpoint for uploading images
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
      uploadDir: path.join(process.cwd(), 'deployment-package', 'gallery'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB max file size
    });

    // Parse the form and handle the uploaded files
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(500).json({ error: 'Error processing upload' });
      }

      // Handle the uploaded files
      const uploadedFiles = files.images; // 'images' is the field name from the form
      
      if (!uploadedFiles) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // Ensure uploadedFiles is an array
      const fileArray = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];
      
      // Move files to the gallery directory in the main project as well
      for (const file of fileArray) {
        const fileName = path.basename(file.filepath);
        const mainGalleryPath = path.join(process.cwd(), 'gallery', fileName);
        
        try {
          // Copy file to main gallery directory as well
          await fs.copyFile(file.filepath, mainGalleryPath);
        } catch (copyErr) {
          // If copying to main gallery fails, it's not critical, just log it
          console.warn('Warning: Could not copy file to main gallery:', copyErr.message);
        }
      }

      res.status(200).json({
        message: 'Images uploaded successfully',
        fileCount: fileArray.length,
        files: fileArray.map(file => ({
          name: path.basename(file.filepath),
          size: file.size,
          type: file.mimetype
        }))
      });
    });
  } catch (error) {
    console.error('Upload images API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}