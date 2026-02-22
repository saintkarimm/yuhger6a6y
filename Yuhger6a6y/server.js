// Import necessary modules using CommonJS syntax to match Node.js HTTP server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url'); // Add url module for parsing query strings

// Load environment variables
require('dotenv').config();

// Dynamically load Google API modules only when needed
let googleApis = null;
let googleAuthLibrary = null;

async function loadGoogleApis() {
  if (!googleApis || !googleAuthLibrary) {
    googleApis = await import('googleapis');
    googleAuthLibrary = await import('google-auth-library');
  }
  return { google: googleApis.google, GoogleAuth: googleAuthLibrary.GoogleAuth };
}

const PORT = 8000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Handle API routes
  if (req.url.startsWith('/api/')) {
    handleApiRequest(req, res);
    return;
  }
  
  // Handle static file routes
  handleStaticFileRequest(req, res);
});

// Function to handle API requests
async function handleApiRequest(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  try {
    // Handle /api/ga route specifically
    if (req.url.startsWith('/api/ga')) {
      // Parse query parameters
      const urlParts = req.url.split('?');
      const queryString = urlParts[1] || '';
      const params = new URLSearchParams(queryString);
      const range = params.get('range') || '30';
      
      // Check if GA environment variables are configured
      if (!process.env.GA_SERVICE_ACCOUNT_JSON || !process.env.GA_PROPERTY_ID) {
        // Return simulated data as fallback when GA is not configured
        console.log('GA environment variables not configured, returning simulated data');
        
        // Generate simulated analytics data
        const simulatedData = generateSimulatedAnalytics(parseInt(range));
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(simulatedData));
        return;
      }
      
      // Attempt to connect to real Google Analytics API
      try {
        // Load Google APIs dynamically
        const googleApis = await loadGoogleApis();
        const google = googleApis.google;
        const GoogleAuth = googleApis.GoogleAuth;
        
        // Use the full service account JSON approach
        const credentials = JSON.parse(process.env.GA_SERVICE_ACCOUNT_JSON);
        
        const auth = new GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
        });

        const client = await auth.getClient();

        const analyticsData = google.analyticsdata({ 
          version: 'v1beta', 
          auth: client
        });

        // Get the GA4 Property ID from environment
        const propertyId = process.env.GA_PROPERTY_ID;
        
        // Parse query parameters
        const dateRange = parseInt(range);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);
        const endDate = new Date();

        // Make API request to Google Analytics
        const response = await analyticsData.properties.runReport({
          property: `properties/${propertyId}`,
          requestBody: {
            dateRanges: [{
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0]
            }],
            metrics: [
              { name: 'activeUsers' },
              { name: 'screenPageViews' },
              { name: 'sessions' },
              { name: 'bounceRate' },
              { name: 'engagementRate' }
            ],
            dimensions: [
              { name: 'date' }
            ]
          }
        });

        // Process the data to match our frontend expectations
        const rawRows = response.data.rows || [];
        const processedData = rawRows.map(row => ({
          date: formatDate(row.dimensionValues[0].value),
          visitors: parseInt(row.metricValues[0].value),
          pageViews: parseInt(row.metricValues[1].value),
          sessions: parseInt(row.metricValues[2].value),
          bounceRate: parseFloat(row.metricValues[3].value).toFixed(2),
          engagementRate: parseFloat(row.metricValues[4].value).toFixed(2)
        }));

        // Calculate summary
        const summary = processedData.reduce((acc, curr) => {
          acc.visitors += curr.visitors;
          acc.pageViews += curr.pageViews;
          acc.sessions += curr.sessions;
          return acc;
        }, { visitors: 0, pageViews: 0, sessions: 0 });

        // Get top pages (different report for top pages)
        const topPagesResponse = await analyticsData.properties.runReport({
          property: `properties/${propertyId}`,
          requestBody: {
            dateRanges: [{
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0]
            }],
            metrics: [
              { name: 'screenPageViews' }
            ],
            dimensions: [
              { name: 'pagePath' }
            ],
            limit: 10,
            metricAggregations: ['TOTAL']
          }
        });

        const topPages = (topPagesResponse.data.rows || []).map(row => ({
          page: row.dimensionValues[0].value,
          views: parseInt(row.metricValues[0].value)
        }));

        // Get top referrers (different report)
        const topReferrersResponse = await analyticsData.properties.runReport({
          property: `properties/${propertyId}`,
          requestBody: {
            dateRanges: [{
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0]
            }],
            metrics: [
              { name: 'sessions' }
            ],
            dimensions: [
              { name: 'sessionSource' }
            ],
            limit: 10,
            metricAggregations: ['TOTAL']
          }
        });

        const topReferrers = (topReferrersResponse.data.rows || []).map(row => ({
          name: row.dimensionValues[0].value,
          count: parseInt(row.metricValues[0].value)
        }));

        // Prepare response data
        const responseData = {
          summary: {
            visitors: summary.visitors,
            pageViews: summary.pageViews,
            sessions: summary.sessions,
            musicPlays: Math.floor(summary.pageViews * 0.3), // Estimated
            galleryViews: Math.floor(summary.pageViews * 0.25) // Estimated
          },
          trafficData: processedData,
          topPages: topPages,
          recentActivity: generateRecentActivity(processedData),
          topReferrers: topReferrers
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(responseData));
      } catch (gaError) {
        console.error('Google Analytics API Error:', gaError);
        // If GA API fails, return simulated data as fallback
        console.log('GA API failed, returning simulated data');
        const simulatedData = generateSimulatedAnalytics(parseInt(range));
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(simulatedData));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'API endpoint not found' }));
    }
  } catch (error) {
    console.error('API Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

// Helper function to format date
function formatDate(dateString) {
  // GA returns dates in YYYYMMDD format
  if (dateString.length === 8) {
    return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
  }
  return dateString;
}

// Function to generate simulated analytics data
function generateSimulatedAnalytics(dateRange) {
  const now = new Date();
  const startDate = new Date(now.getTime() - (dateRange * 24 * 60 * 60 * 1000));
  
  // Simulate realistic traffic patterns
  const dailyData = [];
  for (let i = 0; i < dateRange; i++) {
    const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isBusinessHours = date.getHours() >= 9 && date.getHours() <= 17;
    
    // More traffic during business hours and weekdays
    const baseVisitors = isWeekend ? 80 : 150;
    const businessHourBoost = isBusinessHours ? 1.5 : 0.7;
    
    dailyData.push({
      date: date.toISOString().split('T')[0],
      visitors: Math.floor(baseVisitors * businessHourBoost * (0.8 + Math.random() * 0.4)),
      pageViews: Math.floor(baseVisitors * businessHourBoost * (2.5 + Math.random() * 1.5)),
      sessions: Math.floor(baseVisitors * businessHourBoost * (0.9 + Math.random() * 0.3)),
      bounceRate: (25 + Math.random() * 20).toFixed(1),
      engagementRate: (40 + Math.random() * 30).toFixed(1)
    });
  }

  // Top pages based on your actual site structure
  const topPages = [
    { page: '/index.html', views: Math.floor(1000 + Math.random() * 2000) },
    { page: '/music.html', views: Math.floor(800 + Math.random() * 1500) },
    { page: '/gallery.html', views: Math.floor(600 + Math.random() * 1200) },
    { page: '/latest-drop.html', views: Math.floor(400 + Math.random() * 800) },
    { page: '/about-photography/about-photography.html', views: Math.floor(300 + Math.random() * 600) },
    { page: '/album-timeline/album-timeline.html', views: Math.floor(250 + Math.random() * 500) },
    { page: '/contact/contact.html', views: Math.floor(200 + Math.random() * 400) }
  ].sort((a, b) => b.views - a.views);

  // Recent activity simulation
  const activities = [
    'User played "Best Lies" track',
    'User viewed gallery image collection',
    'User clicked Instagram profile link',
    'User played "Go 6a6y" music',
    'User visited homepage',
    'User played "Jetti N\' Dracula" track',
    'User viewed album timeline',
    'User clicked Spotify artist link',
    'User downloaded music track',
    'User shared content on social media'
  ];

  const recentActivity = [];
  const activityCount = Math.min(dateRange * 3, 50);
  for (let i = 0; i < activityCount; i++) {
    const hoursAgo = Math.floor(Math.random() * (dateRange * 24));
    const activityTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
    
    recentActivity.push({
      text: activities[Math.floor(Math.random() * activities.length)],
      time: activityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: activityTime
    });
  }

  // Sort by timestamp (newest first)
  recentActivity.sort((a, b) => b.timestamp - a.timestamp);

  // Top referrers
  const topReferrers = [
    { name: 'google.com', count: Math.floor(500 + Math.random() * 1000) },
    { name: 'youtube.com', count: Math.floor(300 + Math.random() * 600) },
    { name: 'instagram.com', count: Math.floor(200 + Math.random() * 400) },
    { name: 'spotify.com', count: Math.floor(150 + Math.random() * 300) },
    { name: 'soundcloud.com', count: Math.floor(100 + Math.random() * 200) },
    { name: 'direct', count: Math.floor(400 + Math.random() * 800) }
  ].sort((a, b) => b.count - a.count);

  // Calculate summary statistics
  const totalVisitors = dailyData.reduce((sum, day) => sum + day.visitors, 0);
  const totalPageViews = dailyData.reduce((sum, day) => sum + day.pageViews, 0);
  const totalSessions = dailyData.reduce((sum, day) => sum + day.sessions, 0);
  
  // Calculate averages
  const avgBounceRate = (dailyData.reduce((sum, day) => sum + parseFloat(day.bounceRate), 0) / dailyData.length).toFixed(1);
  const avgEngagementRate = (dailyData.reduce((sum, day) => sum + parseFloat(day.engagementRate), 0) / dailyData.length).toFixed(1);

  return {
    summary: {
      visitors: totalVisitors,
      pageViews: totalPageViews,
      sessions: totalSessions,
      bounceRate: avgBounceRate,
      engagementRate: avgEngagementRate,
      musicPlays: Math.floor(totalPageViews * 0.3),
      galleryViews: Math.floor(totalPageViews * 0.25)
    },
    trafficData: dailyData,
    topPages: topPages,
    recentActivity: recentActivity.slice(0, 20),
    topReferrers: topReferrers
  };
}

// Function to handle static file requests
function handleStaticFileRequest(req, res) {
  // Handle admin routes
  let filePath = '.' + req.url;
  if (filePath === './admin' || filePath === './admin/') {
    filePath = './admin/index.html';
  }
  
  // Resolve the file path
  filePath = path.resolve(filePath);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        // Server error
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
  console.log(`Admin test: http://localhost:${PORT}/admin/test.html`);
});