// API endpoint for adding users
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

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
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Validate role
    const validRoles = ['admin', 'editor', 'viewer'];
    const userRole = validRoles.includes(role) ? role : 'viewer';

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Define the path for the users data file
    const usersFilePath = path.join(process.cwd(), 'deployment-package', 'users.json');

    // Read existing users
    let existingUsers = [];
    try {
      const usersContent = await fs.readFile(usersFilePath, 'utf8');
      existingUsers = JSON.parse(usersContent);
    } catch (error) {
      // If users file doesn't exist, start with empty array
      if (error.code !== 'ENOENT') {
        console.error('Error reading users file:', error);
      }
    }

    // Check if user already exists
    const userExists = existingUsers.some(user => user.username === username || user.email === email);
    if (userExists) {
      return res.status(409).json({ error: 'User with this username or email already exists' });
    }

    // Create new user object
    const newUser = {
      id: Date.now(), // Simple ID generation
      username,
      email,
      password: hashedPassword, // Store hashed password
      role: userRole,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // Add the new user to the array
    existingUsers.push(newUser);

    // Write updated users back to file
    await fs.writeFile(usersFilePath, JSON.stringify(existingUsers, null, 2));

    // Return user info without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(200).json({
      message: 'User created successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Add user API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};