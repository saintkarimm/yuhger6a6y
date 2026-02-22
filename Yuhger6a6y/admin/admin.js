// Main Admin Dashboard Functionality
let trafficChart = null;
let pagesChart = null;

// Initialize dashboard when authenticated
function initializeDashboard() {
    console.log('Initializing dashboard...');
    
    // Check if required elements exist
    if (!document.getElementById('dateRange')) {
        console.error('Required dashboard elements not found');
        return;
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadData();
}

function setupEventListeners() {
    const dateRange = document.getElementById('dateRange');
    const refreshBtn = document.getElementById('refreshBtn');
    
    if (dateRange) {
        dateRange.addEventListener('change', loadData);
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadData);
    }
}

async function loadData() {
    try {
        // Check if GA API is available
        if (!window.gaAPI) {
            console.error('Google Analytics API not initialized');
            showError('Analytics service not available');
            return;
        }
        
        const dateRange = document.getElementById('dateRange')?.value || 30;
        
        // Fetch data from GA API
        const data = await window.gaAPI.fetchAnalyticsData(parseInt(dateRange));
        
        // Update dashboard with data
        updateDashboard(data);
        
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load analytics data');
    }
}

function updateDashboard(data) {
    // Update summary cards
    updateSummaryCards(data.summary);
    
    // Update charts
    updateCharts(data);
    
    // Update detailed sections
    updateDetailedSections(data);
}

function updateSummaryCards(summary) {
    // Update visitor count
    const visitorsElement = document.getElementById('totalVisitors');
    const visitorsChange = document.getElementById('visitorsChange');
    if (visitorsElement && visitorsChange) {
        visitorsElement.textContent = window.gaAPI.formatNumber(summary.visitors);
        // Calculate change (mock calculation for demo)
        const change = Math.random() > 0.5 ? 
            '+' + (Math.random() * 25).toFixed(1) + '%' : 
            '-' + (Math.random() * 15).toFixed(1) + '%';
        visitorsChange.textContent = change;
        visitorsChange.className = change.startsWith('+') ? 'stat-change' : 'stat-change negative';
    }
    
    // Update page views
    const pageViewsElement = document.getElementById('pageViews');
    const pageViewsChange = document.getElementById('pageViewsChange');
    if (pageViewsElement && pageViewsChange) {
        pageViewsElement.textContent = window.gaAPI.formatNumber(summary.pageViews);
        const change = Math.random() > 0.5 ? 
            '+' + (Math.random() * 30).toFixed(1) + '%' : 
            '-' + (Math.random() * 20).toFixed(1) + '%';
        pageViewsChange.textContent = change;
        pageViewsChange.className = change.startsWith('+') ? 'stat-change' : 'stat-change negative';
    }
    
    // Update music plays
    const musicPlaysElement = document.getElementById('musicPlays');
    const musicPlaysChange = document.getElementById('musicPlaysChange');
    if (musicPlaysElement && musicPlaysChange) {
        musicPlaysElement.textContent = window.gaAPI.formatNumber(summary.musicPlays);
        const change = Math.random() > 0.5 ? 
            '+' + (Math.random() * 40).toFixed(1) + '%' : 
            '-' + (Math.random() * 25).toFixed(1) + '%';
        musicPlaysChange.textContent = change;
        musicPlaysChange.className = change.startsWith('+') ? 'stat-change' : 'stat-change negative';
    }
    
    // Update gallery views
    const galleryViewsElement = document.getElementById('galleryViews');
    const galleryViewsChange = document.getElementById('galleryViewsChange');
    if (galleryViewsElement && galleryViewsChange) {
        galleryViewsElement.textContent = window.gaAPI.formatNumber(summary.galleryViews);
        const change = Math.random() > 0.5 ? 
            '+' + (Math.random() * 35).toFixed(1) + '%' : 
            '-' + (Math.random() * 18).toFixed(1) + '%';
        galleryViewsChange.textContent = change;
        galleryViewsChange.className = change.startsWith('+') ? 'stat-change' : 'stat-change negative';
    }
}

function updateCharts(data) {
    updateTrafficChart(data.trafficData);
    updatePagesChart(data.topPages);
}

function updateTrafficChart(trafficData) {
    const ctx = document.getElementById('trafficChart');
    if (!ctx) return;
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }
    
    // Destroy existing chart if it exists
    if (trafficChart) {
        trafficChart.destroy();
    }
    
    // Prepare data for chart
    const dates = trafficData.map(item => item.date);
    const visitors = trafficData.map(item => item.visitors);
    const pageViews = trafficData.map(item => item.pageViews);
    
    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Visitors',
                    data: visitors,
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Page Views',
                    data: pageViews,
                    borderColor: '#4285f4',
                    backgroundColor: 'rgba(66, 133, 244, 0.1)',
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

function updatePagesChart(topPages) {
    const ctx = document.getElementById('pagesChart');
    if (!ctx) return;
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }
    
    // Destroy existing chart if it exists
    if (pagesChart) {
        pagesChart.destroy();
    }
    
    // Prepare data for chart
    const pages = topPages.map(item => {
        let pageName = item.page;
        // Remove common prefixes that shouldn't appear in the dashboard
        pageName = pageName.replace('/deployment-package', '');
        pageName = pageName.replace('/yuhger6a6y', '');
        pageName = pageName.replace('.html', '');
        // If it's the root, show as 'Home'
        if (pageName === '' || pageName === '/') {
            pageName = 'Home';
        }
        return pageName;
    });
    const views = topPages.map(item => item.views);
    
    pagesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pages,
            datasets: [{
                label: 'Page Views',
                data: views,
                backgroundColor: [
                    'rgba(212, 175, 55, 0.7)',
                    'rgba(66, 133, 244, 0.7)',
                    'rgba(219, 68, 55, 0.7)',
                    'rgba(15, 157, 88, 0.7)',
                    'rgba(244, 180, 0, 0.7)'
                ],
                borderColor: [
                    'rgba(212, 175, 55, 1)',
                    'rgba(66, 133, 244, 1)',
                    'rgba(219, 68, 55, 1)',
                    'rgba(15, 157, 88, 1)',
                    'rgba(244, 180, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#888888',
                        autoSkip: false,
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

function updateDetailedSections(data) {
    updateRecentActivity(data.recentActivity);
    updateTopReferrers(data.topReferrers);
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
            <div class="referrer-count">${window.gaAPI.formatNumber(referrer.count)}</div>
        </div>
    `).join('');
}

function showError(message) {
    if (window.adminAuth && typeof window.adminAuth.showError === 'function') {
        window.adminAuth.showError(message);
    } else {
        console.error('Error:', message);
    }
}

// Export functions for global access
window.initializeDashboard = initializeDashboard;
window.loadData = loadData;