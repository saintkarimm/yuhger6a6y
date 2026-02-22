// Google Analytics API Integration
class GoogleAnalyticsAPI {
    constructor() {
        this.measurementId = 'G-YDP7BENSY6';
        this.apiKey = null; // Will be set from environment
        this.accessToken = null;
        this.init();
    }

    init() {
        // Initialize with mock data for demo purposes
        // In production, you'd connect to real Google Analytics API
        this.setupMockData();
    }

    // Setup mock data for demonstration
    setupMockData() {
        this.mockData = {
            today: {
                visitors: Math.floor(Math.random() * 100) + 50,
                pageViews: Math.floor(Math.random() * 300) + 150,
                musicPlays: Math.floor(Math.random() * 50) + 20,
                galleryViews: Math.floor(Math.random() * 80) + 30
            },
            lastWeek: {
                visitors: Math.floor(Math.random() * 500) + 300,
                pageViews: Math.floor(Math.random() * 1500) + 800,
                musicPlays: Math.floor(Math.random() * 200) + 100,
                galleryViews: Math.floor(Math.random() * 300) + 150
            },
            lastMonth: {
                visitors: Math.floor(Math.random() * 2000) + 1200,
                pageViews: Math.floor(Math.random() * 6000) + 3000,
                musicPlays: Math.floor(Math.random() * 800) + 400,
                galleryViews: Math.floor(Math.random() * 1200) + 600
            }
        };
    }

    // Simulate API data fetching
    async fetchAnalyticsData(dateRange = 30) {
        try {
            // Show loading state
            this.showDataLoading(true);
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Return appropriate data based on date range
            let data;
            switch(dateRange) {
                case 7:
                    data = this.generateWeeklyData();
                    break;
                case 30:
                    data = this.generateMonthlyData();
                    break;
                case 90:
                    data = this.generateQuarterlyData();
                    break;
                case 365:
                    data = this.generateYearlyData();
                    break;
                default:
                    data = this.generateMonthlyData();
            }
            
            this.showDataLoading(false);
            return data;
            
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            this.showDataLoading(false);
            throw error;
        }
    }

    // Generate realistic mock data for different time periods
    generateWeeklyData() {
        return {
            summary: {
                visitors: this.mockData.today.visitors * 7,
                pageViews: this.mockData.today.pageViews * 7,
                musicPlays: this.mockData.today.musicPlays * 7,
                galleryViews: this.mockData.today.galleryViews * 7,
                bounceRate: (Math.random() * 20 + 30).toFixed(1),
                avgSessionDuration: Math.floor(Math.random() * 120 + 60)
            },
            trafficData: this.generateTrafficData(7),
            topPages: this.generateTopPages(),
            recentActivity: this.generateRecentActivity(10),
            topReferrers: this.generateTopReferrers()
        };
    }

    generateMonthlyData() {
        return {
            summary: {
                visitors: this.mockData.lastMonth.visitors,
                pageViews: this.mockData.lastMonth.pageViews,
                musicPlays: this.mockData.lastMonth.musicPlays,
                galleryViews: this.mockData.lastMonth.galleryViews,
                bounceRate: (Math.random() * 15 + 35).toFixed(1),
                avgSessionDuration: Math.floor(Math.random() * 180 + 90)
            },
            trafficData: this.generateTrafficData(30),
            topPages: this.generateTopPages(),
            recentActivity: this.generateRecentActivity(20),
            topReferrers: this.generateTopReferrers()
        };
    }

    generateQuarterlyData() {
        return {
            summary: {
                visitors: this.mockData.lastMonth.visitors * 3,
                pageViews: this.mockData.lastMonth.pageViews * 3,
                musicPlays: this.mockData.lastMonth.musicPlays * 3,
                galleryViews: this.mockData.lastMonth.galleryViews * 3,
                bounceRate: (Math.random() * 10 + 40).toFixed(1),
                avgSessionDuration: Math.floor(Math.random() * 240 + 120)
            },
            trafficData: this.generateTrafficData(90),
            topPages: this.generateTopPages(),
            recentActivity: this.generateRecentActivity(50),
            topReferrers: this.generateTopReferrers()
        };
    }

    generateYearlyData() {
        return {
            summary: {
                visitors: this.mockData.lastMonth.visitors * 12,
                pageViews: this.mockData.lastMonth.pageViews * 12,
                musicPlays: this.mockData.lastMonth.musicPlays * 12,
                galleryViews: this.mockData.lastMonth.galleryViews * 12,
                bounceRate: (Math.random() * 8 + 42).toFixed(1),
                avgSessionDuration: Math.floor(Math.random() * 300 + 150)
            },
            trafficData: this.generateTrafficData(365),
            topPages: this.generateTopPages(),
            recentActivity: this.generateRecentActivity(100),
            topReferrers: this.generateTopReferrers()
        };
    }

    // Generate traffic data for charts
    generateTrafficData(days) {
        const data = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            data.push({
                date: date.toISOString().split('T')[0],
                visitors: Math.floor(Math.random() * 150) + 50,
                pageViews: Math.floor(Math.random() * 400) + 200,
                sessions: Math.floor(Math.random() * 120) + 80
            });
        }
        
        return data;
    }

    // Generate top pages data
    generateTopPages() {
        return [
            { page: '/index.html', views: Math.floor(Math.random() * 1000) + 500 },
            { page: '/music.html', views: Math.floor(Math.random() * 800) + 300 },
            { page: '/gallery.html', views: Math.floor(Math.random() * 600) + 200 },
            { page: '/latest-drop.html', views: Math.floor(Math.random() * 400) + 150 },
            { page: '/about-photography/about-photography.html', views: Math.floor(Math.random() * 300) + 100 }
        ];
    }

    // Generate recent activity
    generateRecentActivity(count) {
        const activities = [
            'User played "Best Lies"',
            'User viewed gallery image',
            'User clicked Instagram link',
            'User played "Go 6a6y"',
            'User visited homepage',
            'User played "Jetti N\' Dracula"',
            'User viewed album timeline',
            'User clicked Spotify link'
        ];
        
        const activityData = [];
        const now = new Date();
        
        for (let i = 0; i < count; i++) {
            const timeAgo = Math.floor(Math.random() * 120); // Minutes ago
            const activityTime = new Date(now.getTime() - timeAgo * 60000);
            
            activityData.push({
                text: activities[Math.floor(Math.random() * activities.length)],
                time: activityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }
        
        return activityData.sort((a, b) => new Date('1970/01/01 ' + b.time) - new Date('1970/01/01 ' + a.time));
    }

    // Generate top referrers
    generateTopReferrers() {
        return [
            { name: 'google.com', count: Math.floor(Math.random() * 500) + 200 },
            { name: 'youtube.com', count: Math.floor(Math.random() * 300) + 100 },
            { name: 'instagram.com', count: Math.floor(Math.random() * 200) + 80 },
            { name: 'spotify.com', count: Math.floor(Math.random() * 150) + 60 },
            { name: 'soundcloud.com', count: Math.floor(Math.random() * 100) + 40 }
        ];
    }

    // Calculate percentage change
    calculateChange(current, previous) {
        if (previous === 0) return current > 0 ? '+100%' : '0%';
        const change = ((current - previous) / previous) * 100;
        return (change >= 0 ? '+' : '') + change.toFixed(1) + '%';
    }

    // Show/hide data loading state
    showDataLoading(show) {
        const refreshBtn = document.getElementById('refreshBtn');
        const spinner = document.createElement('span');
        spinner.className = 'spinner';
        spinner.innerHTML = '●';
        
        if (show && refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            refreshBtn.disabled = true;
        } else if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            refreshBtn.disabled = false;
        }
    }

    // Format large numbers
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
}

// Initialize GA API when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gaAPI = new GoogleAnalyticsAPI();
});

// Export for use in other modules
window.GoogleAnalyticsAPI = GoogleAnalyticsAPI;