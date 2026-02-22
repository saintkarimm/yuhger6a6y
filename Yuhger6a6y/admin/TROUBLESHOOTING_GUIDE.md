# Google Analytics Integration Troubleshooting Guide

## Issue: Analytics button shows "Feature coming soon" instead of loading data

### Root Cause
The admin dashboard had a generic handler that showed "Feature coming soon" for all buttons, including the "View Analytics" button.

### Solution Applied
Modified the button handler in `admin.js` to differentiate between the "View Analytics" button and other feature buttons.

---

## Issue: Real data not displaying, falling back to simulated data

### Potential Causes & Solutions

#### 1. Environment Variables Not Set
Ensure these environment variables are set in your Vercel project:
- `GA_PRIVATE_KEY`: Your Google Service Account private key
- `GA_CLIENT_EMAIL`: Your Google Service Account email
- `GA_PROPERTY_ID`: Your GA4 Property ID

To set in Vercel:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the three variables listed above

#### 2. Service Account Permissions
Ensure your Google Service Account has:
- "Viewer" role for your GA4 property
- Proper access to Google Analytics API

#### 3. API Endpoint Not Accessible
The dashboard tries to reach `/api/ga` endpoint. In a Vercel deployment, this should work automatically if:
- The `/api/ga.js` file is in the correct location
- The project is deployed to Vercel
- Dependencies are properly installed (`googleapis`)

#### 4. Check Browser Console
Open browser developer tools and check for:
- Network tab: Look for requests to `/api/ga` and their responses
- Console tab: Look for error messages related to API calls

---

## Verification Steps

1. Deploy your project to Vercel
2. Set the environment variables in Vercel dashboard
3. Visit your admin dashboard
4. Open browser console (F12)
5. Click "View Analytics" button
6. Check for successful API response in Network tab
7. Look for real data instead of simulated data

---

## Debugging Tips

If still experiencing issues:

1. Check Vercel logs for API errors
2. Verify the GA4 Property ID is correct
3. Ensure the service account has proper permissions
4. Confirm the private key is properly formatted (with newlines)
5. Test the API endpoint directly: `https://your-project.vercel.app/api/ga`

---

## Testing the API Directly

You can test your API endpoint by visiting:
```
https://your-domain.vercel.app/api/ga?range=7
```

If you get a JSON response with analytics data, the API is working.
If you get an error, check the environment variables and service account setup.