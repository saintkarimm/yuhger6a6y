// Admin Dashboard JavaScript - Yuhger6a6y Theme with Secure Google Analytics
document.addEventListener('DOMContentLoaded', function() {
    console.log('Yuhger6a6y Admin Dashboard loaded successfully');
    
    // Initialize secure analytics
    initializeAnalytics();
    
    // Add click handlers to buttons with enhanced feedback
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.closest('.card').querySelector('h2').textContent;
            
            // Handle View Analytics button differently
            if (cardTitle.includes('Website Analytics')) {
                // Load analytics data when clicking View Analytics
                refreshAnalytics();
            } else {
                showNotification(`Feature coming soon: ${cardTitle}`, 'info');
            }
            
            // Track button click
            if (typeof trackAdminEvent === 'function') {
                trackAdminEvent('button_click', cardTitle);
            }
        });
        
        // Add hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add enhanced hover effects to cards
    const cards = document.querySelectorAll('.card, .stat-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        });
    });
    
    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards with fade-in animation
    document.querySelectorAll('.card, .stat-card, .welcome-banner').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Add current time display with enhanced styling
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        });
        
        // Create or update time display
        let timeElement = document.getElementById('current-time');
        if (!timeElement) {
            timeElement = document.createElement('div');
            timeElement.id = 'current-time';
            timeElement.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 12px 20px;
                border-radius: 50px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                font-size: 0.9rem;
                color: #D4AF37;
                z-index: 1000;
                border: 1px solid rgba(255, 255, 255, 0.2);
                font-weight: 500;
            `;
            document.body.appendChild(timeElement);
        }
        timeElement.textContent = timeString;
    }
    
    // Update time every second
    updateTime();
    setInterval(updateTime, 1000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press 'R' to refresh stats
        if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            refreshStats();
        }
        
        // Press 'H' for help
        if (e.key === 'h' || e.key === 'H') {
            e.preventDefault();
            showHelp();
        }
        
        // Press 'D' for dark mode toggle (future feature)
        if (e.key === 'd' || e.key === 'D') {
            e.preventDefault();
            showNotification('Dark mode is already active!', 'success');
        }
        
        // Press 'A' for analytics refresh
        if (e.key === 'a' || e.key === 'A') {
            e.preventDefault();
            refreshAnalytics();
        }
    });
    
    // Analytics functions
    async function refreshAnalytics() {
        showNotification('Refreshing analytics data...', 'info');
        
        try {
            console.log('Checking for gaService:', window.gaService);
            console.log('gaService typeof:', typeof window.gaService);
            
            // Check if gaService is available
            if (!window.gaService) {
                console.error('gaService is undefined or null');
                throw new Error('Google Analytics service not loaded. Please check browser console for details.');
            }
            
            // Check if the required method exists
            if (typeof window.gaService.fetchRealAnalyticsData !== 'function') {
                console.error('fetchRealAnalyticsData method does not exist on gaService');
                throw new Error('Analytics service method not available');
            }
            
            // Get data from secure analytics service
            const analyticsData = await window.gaService.fetchRealAnalyticsData(30);
            console.log('Received analytics data:', analyticsData);
            updateDashboardWithAnalytics(analyticsData);
            showNotification('Analytics data refreshed successfully!', 'success');
            
            // Track refresh event
            if (typeof trackAdminEvent === 'function') {
                trackAdminEvent('analytics_refresh', '30_days');
            }
        } catch (error) {
            console.error('Error refreshing analytics:', error);
            
            // If API call fails, use simulated data as fallback
            try {
                console.log('Using simulated data as fallback...');
                const simulatedData = window.gaService.generateRealisticAnalyticsData(30);
                updateDashboardWithAnalytics(simulatedData);
                showNotification('Using simulated data (API unavailable): ' + error.message, 'info');
            } catch (fallbackError) {
                console.error('Error with fallback:', fallbackError);
                showNotification('Failed to refresh analytics data: ' + error.message, 'error');
            }
        }
    }
    
    function updateDashboardWithAnalytics(data) {
        // Update summary cards
        if (data.summary) {
            document.getElementById('totalVisitors').textContent = window.gaService.formatNumber(data.summary.visitors);
            document.getElementById('pageViews').textContent = window.gaService.formatNumber(data.summary.pageViews);
            document.getElementById('musicPlays').textContent = window.gaService.formatNumber(data.summary.musicPlays);
            document.getElementById('galleryViews').textContent = window.gaService.formatNumber(data.summary.galleryViews);
        }
        
        // Update recent activity
        if (data.recentActivity) {
            updateRecentActivity(data.recentActivity);
        }
        
        // Update top referrers
        if (data.topReferrers) {
            updateTopReferrers(data.topReferrers);
        }
        
        // Update charts if Chart.js is available
        if (typeof Chart !== 'undefined' && data.trafficData) {
            updateTrafficChart(data.trafficData);
        }
    }
    
    function updateRecentActivity(activities) {
        const activityContainer = document.getElementById('recentActivity');
        if (!activityContainer) return;
        
        if (activities.length === 0) {
            activityContainer.innerHTML = '<p>No recent activity</p>';
            return;
        }
        
        activityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }
    
    function updateTopReferrers(referrers) {
        const referrerContainer = document.getElementById('topReferrers');
        if (!referrerContainer) return;
        
        if (referrers.length === 0) {
            referrerContainer.innerHTML = '<p>No referrer data</p>';
            return;
        }
        
        referrerContainer.innerHTML = referrers.map(referrer => `
            <div class="referrer-item">
                <div class="referrer-name">${referrer.name}</div>
                <div class="referrer-count">${window.gaService.formatNumber(referrer.count)}</div>
            </div>
        `).join('');
    }
    
    function updateTrafficChart(trafficData) {
        const ctx = document.getElementById('trafficChart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (window.trafficChartInstance) {
            window.trafficChartInstance.destroy();
        }
        
        // Prepare data
        const dates = trafficData.map(item => item.date);
        const visitors = trafficData.map(item => item.visitors);
        const pageViews = trafficData.map(item => item.pageViews);
        
        window.trafficChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Visitors',
                        data: visitors,
                        borderColor: '#D4AF37',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Page Views',
                        data: pageViews,
                        borderColor: '#f4e04d',
                        backgroundColor: 'rgba(244, 224, 77, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#888888'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#888888'
                        }
                    }
                }
            }
        });
    }
    
    function refreshStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            // Add refresh animation
            stat.style.transform = 'scale(1.1)';
            stat.style.transition = 'transform 0.3s ease, color 0.3s ease';
            stat.style.color = '#f4e04d';
            
            setTimeout(() => {
                stat.style.transform = 'scale(1)';
                stat.style.color = '';
            }, 300);
        });
        
        // Refresh analytics data
        refreshAnalytics();
    }
    
    function showHelp() {
        const helpText = `
Yuhger6a6y Admin Dashboard Help:
• Click on any feature card to see upcoming functionality
• Press 'R' to refresh statistics and analytics
• Press 'A' to refresh analytics data specifically
• Press 'H' to show this help
• Press 'D' to toggle dark mode (currently active)
• All data is tracked through Google Analytics
• Stats update automatically every second
• All elements have smooth hover animations
        `;
        alert(helpText);
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? 'rgba(40, 167, 69, 0.9)' : 
                         type === 'info' ? 'rgba(23, 162, 184, 0.9)' : 
                         type === 'error' ? 'rgba(220, 53, 69, 0.9)' : 
                         'rgba(220, 53, 69, 0.9)'};
            backdrop-filter: blur(10px);
            color: white;
            padding: 18px 30px;
            border-radius: 50px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            font-weight: 600;
            font-size: 16px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
            min-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(20px)';
            notification.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }
    
    // Initialize analytics
    function initializeAnalytics() {
        // Secure analytics service is already loaded via HTML script tag
        console.log('Checking for Secure Analytics service...');
        
        // Wait a bit for the service to initialize
        setTimeout(() => {
            if (window.gaService) {
                console.log('GA Service is ready');
                // Load Chart.js for charts
                loadChartJS();
                
                // Initial data load after everything is ready
                setTimeout(() => {
                    if (window.gaService) {
                        refreshAnalytics();
                    }
                }, 1000);
            } else {
                console.error('GA Service is not available');
                // Still load Chart.js for basic functionality
                loadChartJS();
                showNotification('Analytics service not available', 'error');
            }
        }, 500);
    }
    
    // Load Chart.js
    function loadChartJS() {
        const chartScript = document.createElement('script');
        chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        chartScript.onload = function() {
            console.log('Chart.js loaded');
            // Chart.js is loaded but we'll load data after both scripts are ready
        };
        chartScript.onerror = function() {
            console.error('Failed to load Chart.js');
            showNotification('Failed to load chart functionality', 'error');
        };
        document.head.appendChild(chartScript);
    }
    
    // Add subtle background animation
    document.body.style.background = `
        linear-gradient(135deg, #0B0B0D 0%, #1a1a2e 50%, #16213e 100%)
    `;
    
    // Initialize with welcome message
    setTimeout(() => {
        showNotification('Welcome to Yuhger6a6y Professional Admin Dashboard with Secure Analytics!', 'success');
    }, 1500);
    
    // Add subtle particle effect background (optional enhancement)
    createSubtleParticles();
});

function createSubtleParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    document.body.appendChild(particleContainer);
    
    // Create 20 subtle particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${15 + Math.random() * 15}s infinite ease-in-out;
        `;
        particleContainer.appendChild(particle);
    }
    
    // Add CSS for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
            25% { transform: translate(20px, -20px) rotate(90deg); opacity: 0.7; }
            50% { transform: translate(-10px, -40px) rotate(180deg); opacity: 0.5; }
            75% { transform: translate(-30px, 10px) rotate(270deg); opacity: 0.8; }
        }
    `;
    document.head.appendChild(style);
}