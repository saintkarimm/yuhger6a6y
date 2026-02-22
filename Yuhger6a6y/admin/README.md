# Yuhger6a6y Admin Dashboard

This is the administration panel for the Yuhger6a6y website with integrated Google Analytics support.

## Access

Visit `yuhger6a6y.vercel.app/admin` or `yuhger6a6y.live/admin` to access the admin dashboard.

## Features

- **Website Analytics**: View real visitor statistics and engagement metrics from Google Analytics
- **Content Management**: Manage gallery images, music tracks, and pages
- **User Management**: Manage admin accounts and permissions
- **Settings**: Configure website settings and preferences

## Google Analytics Integration

The admin dashboard includes real-time Google Analytics integration for monitoring website performance. To enable real analytics data:

### Prerequisites

1. Google Analytics 4 (GA4) property set up for your website
2. Google Cloud Service Account with access to the GA4 property
3. Vercel deployment (recommended) to use server-side API

### Setup

1. Create a Google Cloud Service Account:
   - Go to Google Cloud Console
   - Create a new project or select existing one
   - Enable the Google Analytics API
   - Create a Service Account
   - Download the JSON key file

2. Configure permissions in Google Analytics:
   - Go to Admin → Account/Property/User Management
   - Add the Service Account email with "Viewer" permissions

3. Set environment variables in your hosting platform (Vercel):
   - `GA_PRIVATE_KEY`: Private key from the service account JSON (include full key with newlines)
   - `GA_CLIENT_EMAIL`: Service account email address
   - `GA_PROPERTY_ID`: Your GA4 Property ID (format: "123456789")

4. Deploy your application

### API Endpoint

The analytics data is served through `/api/ga` endpoint which securely handles authentication server-side.

## Current Status

This is version 2.0 of the admin dashboard. The Website Analytics feature is now fully functional when properly configured with Google Analytics credentials. Other features are currently in development and will be implemented in future updates.

## Keyboard Shortcuts

- **R**: Refresh statistics
- **A**: Refresh analytics data specifically
- **H**: Show help

## Development

The dashboard is built with:
- HTML5
- CSS3 (with modern layout features)
- Vanilla JavaScript (no frameworks)

All files are served statically and designed to work with Vercel deployment. The Google Analytics API integration uses server-side authentication to securely access your analytics data.