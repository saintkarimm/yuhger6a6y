// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Dashboard loaded successfully');
    
    // Add click handlers to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.closest('.card').querySelector('h2').textContent;
            alert(`Feature coming soon: ${cardTitle}`);
        });
    });
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add animation to cards when they come into view
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
    
    // Observe all cards
    document.querySelectorAll('.card, .stat-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // Add current time display
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
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
                background: rgba(255, 255, 255, 0.9);
                padding: 10px 15px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                font-size: 0.9rem;
                color: #2c3e50;
                z-index: 1000;
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
    });
    
    function refreshStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            // Add refresh animation
            stat.style.transform = 'scale(1.1)';
            stat.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                stat.style.transform = 'scale(1)';
            }, 300);
        });
        
        // Show refresh notification
        showNotification('Stats refreshed!', 'success');
    }
    
    function showHelp() {
        const helpText = `
Admin Dashboard Help:
• Click on any feature card to see upcoming functionality
• Press 'R' to refresh statistics
• Press 'H' to show this help
• Stats update automatically every second
        `;
        alert(helpText);
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? '#27ae60' : '#3498db'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Initialize with welcome message
    setTimeout(() => {
        showNotification('Welcome to Yuhger6a6y Admin Dashboard!', 'success');
    }, 1000);
});