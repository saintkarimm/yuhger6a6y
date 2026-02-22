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
    
    // Add specific event listeners for modal-triggering buttons
    const analyticsBtn = document.querySelector('.analytics-btn');
    const contentMgmtBtn = document.querySelector('.content-mgmt-btn');
    const userMgmtBtn = document.querySelector('.user-mgmt-btn');
    const settingsBtn = document.querySelector('.settings-btn');
    
    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', function() {
            refreshAnalytics();
        });
    }
    
    if (contentMgmtBtn) {
        contentMgmtBtn.addEventListener('click', function() {
            openModal('contentModal');
        });
    }
    
    if (userMgmtBtn) {
        userMgmtBtn.addEventListener('click', function() {
            openModal('userModal');
        });
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            openModal('settingsModal');
        });
    }
    
    // Modal functionality
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside the content
    modals.forEach(modal => {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            const modal = this.closest('.modal');
            
            // Remove active class from all tabs and buttons
            modal.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            modal.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            modal.querySelector(`#${tabName}Tab`).classList.add('active');
        });
    });
    
    // Content Management functionality
    setupContentManagement();
    
    // User Management functionality
    setupUserManagement();
    
    // System Settings functionality
    setupSystemSettings();
    
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
            updateEngagementChart(data);
            updateDeviceChart(data);
            updateGeoChart(data);
        }
        
        // Update top pages chart if available
        if (typeof Chart !== 'undefined' && data.topPages) {
            updateTopPagesChart(data.topPages);
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
    
    function updateEngagementChart(data) {
        const ctx = document.getElementById('engagementChart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (window.engagementChartInstance) {
            window.engagementChartInstance.destroy();
        }
        
        // Prepare engagement data
        const engagementData = data.trafficData || [];
        const dates = engagementData.map(item => item.date);
        const bounceRates = engagementData.map(item => parseFloat(item.bounceRate));
        const engagementRates = engagementData.map(item => parseFloat(item.engagementRate) || 0);
        
        window.engagementChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Bounce Rate (%)',
                        data: bounceRates,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Engagement Rate (%)',
                        data: engagementRates,
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
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
    
    function updateTopPagesChart(topPages) {
        const ctx = document.getElementById('topPagesChart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (window.topPagesChartInstance) {
            window.topPagesChartInstance.destroy();
        }
        
        // Prepare top pages data
        const pageLabels = topPages.map(page => page.page.substring(0, 20) + (page.page.length > 20 ? '...' : ''));
        const pageViews = topPages.map(page => page.views);
        
        window.topPagesChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: pageLabels,
                datasets: [{
                    label: 'Page Views',
                    data: pageViews,
                    backgroundColor: 'rgba(212, 175, 55, 0.7)',
                    borderColor: '#D4AF37',
                    borderWidth: 1
                }]
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
                            color: '#888888',
                            maxRotation: 45,
                            minRotation: 45
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
    
    function updateDeviceChart(data) {
        const ctx = document.getElementById('deviceChart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (window.deviceChartInstance) {
            window.deviceChartInstance.destroy();
        }
        
        // Prepare device data (simulated since GA API doesn't provide this directly in the same way)
        const deviceTypes = ['Desktop', 'Mobile', 'Tablet'];
        const deviceCounts = [
            Math.floor(data.summary.visitors * 0.6),
            Math.floor(data.summary.visitors * 0.35),
            Math.floor(data.summary.visitors * 0.05)
        ];
        
        window.deviceChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: deviceTypes,
                datasets: [{
                    data: deviceCounts,
                    backgroundColor: [
                        'rgba(212, 175, 55, 0.7)',
                        'rgba(244, 224, 77, 0.7)',
                        'rgba(255, 255, 255, 0.7)'
                    ],
                    borderColor: [
                        '#D4AF37',
                        '#f4e04d',
                        '#ffffff'
                    ],
                    borderWidth: 1
                }]
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
                }
            }
        });
    }
    
    function updateGeoChart(data) {
        const ctx = document.getElementById('geoChart');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (window.geoChartInstance) {
            window.geoChartInstance.destroy();
        }
        
        // Prepare geographic data (simulated)
        const countries = ['United States', 'Canada', 'UK', 'Germany', 'Australia'];
        const countryVisits = [
            Math.floor(data.summary.visitors * 0.4),
            Math.floor(data.summary.visitors * 0.15),
            Math.floor(data.summary.visitors * 0.15),
            Math.floor(data.summary.visitors * 0.1),
            Math.floor(data.summary.visitors * 0.1)
        ];
        
        window.geoChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: countries,
                datasets: [{
                    label: 'Visitors',
                    data: countryVisits,
                    backgroundColor: 'rgba(244, 224, 77, 0.7)',
                    borderColor: '#f4e04d',
                    borderWidth: 1
                }]
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

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        // Add animation
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'scale(1)';
        }, 10);
    }
}

function closeModal(modal) {
    modal.style.opacity = '0';
    modal.querySelector('.modal-content').style.transform = 'scale(0.95)';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Content Management Functions
function setupContentManagement() {
    // Gallery tab
    const uploadImagesBtn = document.getElementById('uploadImagesBtn');
    if (uploadImagesBtn) {
        uploadImagesBtn.addEventListener('click', function() {
            const fileInput = document.getElementById('imageUpload');
            if (fileInput.files.length > 0) {
                handleImageUpload(fileInput.files);
            } else {
                showNotification('Please select images to upload', 'error');
            }
        });
    }
    
    // Music tab
    const uploadMusicBtn = document.getElementById('uploadMusicBtn');
    if (uploadMusicBtn) {
        uploadMusicBtn.addEventListener('click', function() {
            const fileInput = document.getElementById('musicUpload');
            if (fileInput.files.length > 0) {
                handleMusicUpload(fileInput.files);
            } else {
                showNotification('Please select music files to upload', 'error');
            }
        });
    }
    
    // Album tab
    const createAlbumBtn = document.getElementById('createAlbumBtn');
    if (createAlbumBtn) {
        createAlbumBtn.addEventListener('click', function() {
            createAlbum();
        });
    }
    
    // Load existing content
    loadGalleryImages();
    loadMusicTracks();
    loadAlbums();
}

// User Management Functions
function setupUserManagement() {
    const addUserBtn = document.getElementById('addUserBtn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            addUser();
        });
    }
    
    // Load existing users
    loadUsers();
}

// System Settings Functions
function setupSystemSettings() {
    const saveGeneralSettingsBtn = document.getElementById('saveGeneralSettingsBtn');
    if (saveGeneralSettingsBtn) {
        saveGeneralSettingsBtn.addEventListener('click', function() {
            saveGeneralSettings();
        });
    }
    
    const saveAppearanceSettingsBtn = document.getElementById('saveAppearanceSettingsBtn');
    if (saveAppearanceSettingsBtn) {
        saveAppearanceSettingsBtn.addEventListener('click', function() {
            saveAppearanceSettings();
        });
    }
    
    const saveIntegrationSettingsBtn = document.getElementById('saveIntegrationSettingsBtn');
    if (saveIntegrationSettingsBtn) {
        saveIntegrationSettingsBtn.addEventListener('click', function() {
            saveIntegrationSettings();
        });
    }
    
    // Load existing settings
    loadSettings();
}

// Content Management Implementation
function handleImageUpload(files) {
    showNotification('Uploading images...', 'info');
    
    // Simulate upload process
    setTimeout(() => {
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        showNotification(`Successfully uploaded images: ${fileNames}`, 'success');
        loadGalleryImages(); // Reload gallery after upload
    }, 1500);
}

function handleMusicUpload(files) {
    showNotification('Uploading music tracks...', 'info');
    
    // Simulate upload process
    setTimeout(() => {
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        showNotification(`Successfully uploaded tracks: ${fileNames}`, 'success');
        loadMusicTracks(); // Reload tracks after upload
    }, 1500);
}

function createAlbum() {
    const name = document.getElementById('albumName').value;
    const artist = document.getElementById('albumArtist').value;
    const description = document.getElementById('albumDescription').value;
    const coverFile = document.getElementById('albumCover').files[0];
    
    if (!name || !artist) {
        showNotification('Please fill in album name and artist', 'error');
        return;
    }
    
    showNotification('Creating album...', 'info');
    
    // Simulate creation process
    setTimeout(() => {
        showNotification(`Album "${name}" created successfully`, 'success');
        document.getElementById('albumName').value = '';
        document.getElementById('albumArtist').value = '';
        document.getElementById('albumDescription').value = '';
        document.getElementById('albumCover').value = '';
        loadAlbums(); // Reload albums after creation
    }, 1500);
}

function loadGalleryImages() {
    // Simulate loading gallery images
    const galleryContainer = document.getElementById('galleryImagesList');
    if (!galleryContainer) return;
    
    // Clear existing content
    galleryContainer.innerHTML = '';
    
    // Sample gallery items (in a real implementation, this would come from an API)
    const sampleImages = [
        { id: 1, name: 'image1.jpg', url: '/images/artistic.JPG' },
        { id: 2, name: 'image2.jpg', url: '/images/breakthrough.JPG' },
        { id: 3, name: 'image3.jpg', url: '/images/origin.JPG' },
        { id: 4, name: 'image4.jpg', url: '/images/logo.png' }
    ];
    
    sampleImages.forEach(image => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <img src="${image.url}" alt="${image.name}">
            <div class="image-controls">
                <button onclick="deleteImage(${image.id})"><i class="fas fa-trash"></i> Delete</button>
                <button onclick="editImage(${image.id})"><i class="fas fa-edit"></i> Edit</button>
            </div>
        `;
        galleryContainer.appendChild(imageItem);
    });
}

function loadMusicTracks() {
    // Simulate loading music tracks
    const tracksContainer = document.getElementById('musicTracksList');
    if (!tracksContainer) return;
    
    // Clear existing content
    tracksContainer.innerHTML = '';
    
    // Sample music tracks (in a real implementation, this would come from an API)
    const sampleTracks = [
        { id: 1, title: 'Best Lies', artist: 'Yuhger6a6y', duration: '3:45' },
        { id: 2, title: 'Go 6a6y', artist: 'Yuhger6a6y', duration: '4:20' },
        { id: 3, title: 'Jetti N\' Dracula', artist: 'Yuhger6a6y', duration: '3:15' }
    ];
    
    sampleTracks.forEach(track => {
        const trackItem = document.createElement('div');
        trackItem.className = 'track-item';
        trackItem.innerHTML = `
            <div class="track-info">
                <strong>${track.title}</strong> by ${track.artist}
                <br><small>Duration: ${track.duration}</small>
            </div>
            <div class="track-actions">
                <button onclick="playTrack(${track.id})"><i class="fas fa-play"></i> Play</button>
                <button onclick="deleteTrack(${track.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        tracksContainer.appendChild(trackItem);
    });
}

function loadAlbums() {
    // Simulate loading albums
    const albumsContainer = document.getElementById('albumsList');
    if (!albumsContainer) return;
    
    // Clear existing content
    albumsContainer.innerHTML = '';
    
    // Sample albums (in a real implementation, this would come from an API)
    const sampleAlbums = [
        { id: 1, name: 'YugerLife', artist: 'Yuhger6a6y', year: '2026' },
        { id: 2, name: 'World on drugs', artist: 'Yuhger6a6y', year: '2025' },
        { id: 3, name: 'Breakthrough', artist: 'Yuhger6a6y', year: '2024' }
    ];
    
    sampleAlbums.forEach(album => {
        const albumItem = document.createElement('div');
        albumItem.className = 'album-item';
        albumItem.innerHTML = `
            <img src="/images/album-3girls.jpeg" alt="${album.name}" class="album-cover">
            <h4>${album.name}</h4>
            <p>${album.artist}</p>
            <p>${album.year}</p>
            <div class="album-actions">
                <button onclick="editAlbum(${album.id})"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteAlbum(${album.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        albumsContainer.appendChild(albumItem);
    });
}

// User Management Implementation
function addUser() {
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('userRole').value;
    
    if (!username || !email || !password) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    showNotification('Adding new user...', 'info');
    
    // Simulate user creation process
    setTimeout(() => {
        showNotification(`User "${username}" added successfully`, 'success');
        document.getElementById('newUsername').value = '';
        document.getElementById('newUserEmail').value = '';
        document.getElementById('newUserPassword').value = '';
        loadUsers(); // Reload users after addition
    }, 1500);
}

function loadUsers() {
    // Simulate loading users
    const usersContainer = document.getElementById('usersList');
    if (!usersContainer) return;
    
    // Clear existing content
    usersContainer.innerHTML = '';
    
    // Sample users (in a real implementation, this would come from an API)
    const sampleUsers = [
        { id: 1, username: 'admin@yuhger6a6y', email: 'admin@yuhger6a6y.com', role: 'admin', lastLogin: '2026-02-22' },
        { id: 2, username: 'editor1', email: 'editor@yuhger6a6y.com', role: 'editor', lastLogin: '2026-02-21' },
        { id: 3, username: 'viewer1', email: 'viewer@yuhger6a6y.com', role: 'viewer', lastLogin: '2026-02-20' }
    ];
    
    sampleUsers.forEach(user => {
        const userRow = document.createElement('div');
        userRow.className = 'user-row';
        userRow.innerHTML = `
            <div class="user-info">
                <strong>${user.username}</strong><br>
                <small>${user.email}</small><br>
                <small>Role: ${user.role} | Last Login: ${user.lastLogin}</small>
            </div>
            <div class="user-actions">
                <button onclick="editUser(${user.id})"><i class="fas fa-edit"></i> Edit</button>
                <button onclick="deleteUser(${user.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;
        usersContainer.appendChild(userRow);
    });
}

// System Settings Implementation
function loadSettings() {
    // Load general settings
    document.getElementById('siteTitle').value = localStorage.getItem('siteTitle') || 'Yuhger6a6y Creative Platform';
    document.getElementById('siteDescription').value = localStorage.getItem('siteDescription') || 'A creative platform for music and photography';
    document.getElementById('siteUrl').value = localStorage.getItem('siteUrl') || 'https://yuhger6a6y.vercel.app';
    
    // Load appearance settings
    document.getElementById('primaryColor').value = localStorage.getItem('primaryColor') || '#D4AF37';
    document.getElementById('secondaryColor').value = localStorage.getItem('secondaryColor') || '#0B0B0D';
    document.getElementById('accentColor').value = localStorage.getItem('accentColor') || '#f4e04d';
    
    // Load integration settings
    document.getElementById('gaMeasurementId').value = localStorage.getItem('gaMeasurementId') || 'G-YDP7BENSY6';
    document.getElementById('gaPropertyId').value = localStorage.getItem('gaPropertyId') || '';
    document.getElementById('instagramUrl').value = localStorage.getItem('instagramUrl') || 'https://instagram.com/yuhger6a6y';
    document.getElementById('spotifyUrl').value = localStorage.getItem('spotifyUrl') || 'https://open.spotify.com/artist/yuhger6a6y';
    document.getElementById('youtubeUrl').value = localStorage.getItem('youtubeUrl') || 'https://youtube.com/@yuhger6a6y';
    
    // Load checkboxes
    document.getElementById('enableAnimations').checked = localStorage.getItem('enableAnimations') !== 'false';
    document.getElementById('enableParticles').checked = localStorage.getItem('enableParticles') !== 'false';
}

function saveGeneralSettings() {
    const siteTitle = document.getElementById('siteTitle').value;
    const siteDescription = document.getElementById('siteDescription').value;
    const siteUrl = document.getElementById('siteUrl').value;
    
    localStorage.setItem('siteTitle', siteTitle);
    localStorage.setItem('siteDescription', siteDescription);
    localStorage.setItem('siteUrl', siteUrl);
    
    showNotification('General settings saved successfully', 'success');
}

function saveAppearanceSettings() {
    const primaryColor = document.getElementById('primaryColor').value;
    const secondaryColor = document.getElementById('secondaryColor').value;
    const accentColor = document.getElementById('accentColor').value;
    const enableAnimations = document.getElementById('enableAnimations').checked;
    const enableParticles = document.getElementById('enableParticles').checked;
    
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);
    localStorage.setItem('accentColor', accentColor);
    localStorage.setItem('enableAnimations', enableAnimations);
    localStorage.setItem('enableParticles', enableParticles);
    
    showNotification('Appearance settings saved successfully', 'success');
    
    // Apply theme changes
    applyThemeChanges();
}

function saveIntegrationSettings() {
    const gaMeasurementId = document.getElementById('gaMeasurementId').value;
    const gaPropertyId = document.getElementById('gaPropertyId').value;
    const instagramUrl = document.getElementById('instagramUrl').value;
    const spotifyUrl = document.getElementById('spotifyUrl').value;
    const youtubeUrl = document.getElementById('youtubeUrl').value;
    
    localStorage.setItem('gaMeasurementId', gaMeasurementId);
    localStorage.setItem('gaPropertyId', gaPropertyId);
    localStorage.setItem('instagramUrl', instagramUrl);
    localStorage.setItem('spotifyUrl', spotifyUrl);
    localStorage.setItem('youtubeUrl', youtubeUrl);
    
    showNotification('Integration settings saved successfully', 'success');
}

function applyThemeChanges() {
    // Apply color changes to the theme
    const primaryColor = localStorage.getItem('primaryColor') || '#D4AF37';
    const secondaryColor = localStorage.getItem('secondaryColor') || '#0B0B0D';
    const accentColor = localStorage.getItem('accentColor') || '#f4e04d';
    
    // Update CSS variables
    document.documentElement.style.setProperty('--accent-gold', primaryColor);
    
    // Show notification
    showNotification('Theme changes applied successfully', 'success');
}

// Placeholder functions for various actions
function deleteImage(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        showNotification('Image deleted successfully', 'success');
        loadGalleryImages(); // Reload gallery after deletion
    }
}

function editImage(id) {
    showNotification('Edit image functionality coming soon', 'info');
}

function playTrack(id) {
    showNotification(`Playing track ID: ${id}`, 'info');
}

function deleteTrack(id) {
    if (confirm('Are you sure you want to delete this track?')) {
        showNotification('Track deleted successfully', 'success');
        loadMusicTracks(); // Reload tracks after deletion
    }
}

function editAlbum(id) {
    showNotification('Edit album functionality coming soon', 'info');
}

function deleteAlbum(id) {
    if (confirm('Are you sure you want to delete this album?')) {
        showNotification('Album deleted successfully', 'success');
        loadAlbums(); // Reload albums after deletion
    }
}

function editUser(id) {
    showNotification('Edit user functionality coming soon', 'info');
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        showNotification('User deleted successfully', 'success');
        loadUsers(); // Reload users after deletion
    }
}

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