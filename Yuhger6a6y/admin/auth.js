// Admin Authentication System
class AdminAuth {
    constructor() {
        this.user = null;
        this.token = null;
        this.init();
    }

    init() {
        // Check for existing session
        this.checkExistingSession();
        
        // Set up event listeners
        this.setupEventListeners();
    }

    checkExistingSession() {
        const token = localStorage.getItem('admin_token');
        const user = localStorage.getItem('admin_user');
        
        if (token && user) {
            try {
                this.token = token;
                this.user = JSON.parse(user);
                this.showDashboard();
            } catch (error) {
                console.error('Error parsing user data:', error);
                // Clear corrupted session data
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                this.showLogin();
            }
        } else {
            this.showLogin();
        }
    }

    setupEventListeners() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleGoogleLogin());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    async handleGoogleLogin() {
        try {
            // Show loading state
            this.showLoading(true);
            
            // In a real implementation, this would redirect to Google OAuth
            // For now, we'll simulate the login process
            await this.simulateGoogleLogin();
            
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Login failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    // Simulate Google OAuth login (in production, use real Google OAuth)
    async simulateGoogleLogin() {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, accept any Google account
        // In production, you'd validate against your allowed admin emails
        const mockUser = {
            email: 'admin@yuhger6a6y.com',
            name: 'Admin User',
            picture: 'https://via.placeholder.com/40'
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        // Store session
        this.user = mockUser;
        this.token = mockToken;
        localStorage.setItem('admin_token', mockToken);
        localStorage.setItem('admin_user', JSON.stringify(mockUser));
        
        this.showDashboard();
    }

    handleLogout() {
        // Clear session storage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        
        this.user = null;
        this.token = null;
        
        this.showLogin();
    }

    showLogin() {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('auth-section').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    showDashboard() {
        if (this.user) {
            document.getElementById('userEmail').textContent = this.user.email;
        }
        
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Initialize dashboard
        if (typeof initializeDashboard === 'function') {
            initializeDashboard();
        }
    }

    showLoading(show) {
        const loadingElement = document.getElementById('loading');
        if (show) {
            loadingElement.classList.remove('hidden');
        } else {
            loadingElement.classList.add('hidden');
        }
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error">&times;</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Add styles for error notification
        if (!document.getElementById('error-styles')) {
            const style = document.createElement('style');
            style.id = 'error-styles';
            style.textContent = `
                .error-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #f44336;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
                    z-index: 1000;
                    max-width: 300px;
                }
                .error-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .close-error {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    margin-left: auto;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
        
        // Close button handler
        errorDiv.querySelector('.close-error').addEventListener('click', () => {
            errorDiv.parentNode.removeChild(errorDiv);
        });
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.token && this.user;
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Get auth token
    getToken() {
        return this.token;
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuth = new AdminAuth();
});

// Export for use in other modules
window.AdminAuth = AdminAuth;