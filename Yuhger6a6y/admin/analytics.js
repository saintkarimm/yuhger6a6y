// Google Analytics 4 Integration for Admin Dashboard
class GoogleAnalyticsService {
    constructor() {
        this.measurementId = 'G-YDP7BENSY6'; // Your GA4 Measurement ID
        this.apiSecret = null; // Will be set from environment
        this.accessToken = null;
        this.propertyId = null;
        this.init();
    }

    init() {
        // Initialize Google Analytics
        this.loadGAScript();
        this.setupEventListeners();
    }

    // Load Google Analytics script
    loadGAScript() {
        // Check if gtag is already loaded
        if (typeof gtag !== 'undefined') {
            console.log('Google Analytics already loaded');
            return;
        }

        // Create and load GA script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(script, firstScript);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.measurementId);

        window.gtag = gtag;
        console.log('Google Analytics loaded successfully');
    }

    // Setup event tracking
    setupEventListeners() {
        // Track admin dashboard page view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Admin Dashboard',
                page_location: window.location.href,
                page_path: '/admin/'
            });
        }

        // Track dashboard interactions
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn');
            if (button) {
                this.trackEvent('dashboard_interaction', 'button_click', button.textContent.trim());
            }
        });
    }

    // Track custom events
    trackEvent(category, action, label = '', value = null) {
        if (typeof gtag !== 'undefined') {
            const eventParams = {
                event_category: category,
                event_label: label
            };
            
            if (value !== null) {
                eventParams.value = value;
            }
            
            gtag('event', action, eventParams);
        }
    }

    // Fetch real analytics data (requires GA4 API setup)
    async fetchRealAnalyticsData(dateRange = 30) {
        try {
            // This would require:
            // 1. Google Cloud Project setup
            // 2. GA4 API credentials
            // 3. Proper authentication flow
            
            // For now, return enhanced mock data that simulates real GA behavior
            return this.generateRealisticAnalyticsData(dateRange);
            
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            // Fallback to mock data
            return this.generateRealisticAnalyticsData(dateRange);
        }
    }

    // Generate realistic analytics data based on actual GA patterns
    generateRealisticAnalyticsData(dateRange) {
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
                avgSessionDuration: Math.floor(90 + Math.random() * 180)
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
        const avgSessionDuration = Math.floor(dailyData.reduce((sum, day) => sum + day.avgSessionDuration, 0) / dailyData.length);

        return {
            summary: {
                visitors: totalVisitors,
                pageViews: totalPageViews,
                sessions: totalSessions,
                bounceRate: avgBounceRate,
                avgSessionDuration: avgSessionDuration,
                musicPlays: Math.floor(totalPageViews * 0.3), // Estimate music plays
                galleryViews: Math.floor(totalPageViews * 0.25) // Estimate gallery views
            },
            trafficData: dailyData,
            topPages: topPages,
            recentActivity: recentActivity.slice(0, 20),
            topReferrers: topReferrers
        };
    }

    // Format numbers for display
    formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) {
            return '0';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Get real-time data (simulated for now)
    getRealTimeData() {
        return {
            activeUsers: Math.floor(5 + Math.random() * 25),
            lastUpdated: new Date().toLocaleTimeString()
        };
    }
}

// Initialize GA service when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gaService = new GoogleAnalyticsService();
    
    // Make it available globally
    window.trackAdminEvent = (action, label = '', value = null) => {
        window.gaService.trackEvent('admin_dashboard', action, label, value);
    };
});

// Export for use in other modules
window.GoogleAnalyticsService = GoogleAnalyticsService;