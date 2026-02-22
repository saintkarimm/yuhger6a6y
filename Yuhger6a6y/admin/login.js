// Admin Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Yuhger6a6y Admin Login loaded');
    
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const errorMessage = document.createElement('div');
    const successMessage = document.createElement('div');
    
    // Add error and success message elements
    errorMessage.className = 'error-message';
    errorMessage.id = 'errorMessage';
    errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Invalid credentials. Please try again.';
    
    successMessage.className = 'success-message';
    successMessage.id = 'successMessage';
    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Login successful! Redirecting to dashboard...';
    
    // Insert messages before the form
    loginForm.parentNode.insertBefore(errorMessage, loginForm);
    loginForm.parentNode.insertBefore(successMessage, loginForm);
    
    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const icon = this.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
        
        // Add animation
        this.style.transform = 'translateY(-50%) scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
    });
    
    // Form submission handler
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Hide any existing messages
        hideMessages();
        
        // Validate input
        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }
        
        // Show loading state
        const loginBtn = loginForm.querySelector('.login-btn');
        loginBtn.classList.add('loading');
        loginBtn.innerHTML = 'Authenticating...';
        
        // Simulate authentication process
        setTimeout(() => {
            authenticateUser(username, password, loginBtn);
        }, 1500);
    });
    
    // Authentication function
    function authenticateUser(username, password, loginBtn) {
        // Check credentials (case-sensitive)
        const validUsername = 'admin@yuhger6a6y';
        const validPassword = 'yuhger6a6y_admin';
        
        if (username === validUsername && password === validPassword) {
            // Successful login
            showSuccess();
            
            // Store session data
            const sessionData = {
                username: username,
                loginTime: new Date().toISOString(),
                token: 'admin_' + Date.now()
            };
            
            localStorage.setItem('admin_session', JSON.stringify(sessionData));
            localStorage.setItem('admin_authenticated', 'true');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = '/admin/';
            }, 2000);
            
        } else {
            // Failed login
            showError('Invalid username or password');
            loginBtn.classList.remove('loading');
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            
            // Add shake animation to form
            loginForm.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
        }
    }
    
    // Show error message
    function showError(message) {
        errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorMessage.style.display = 'block';
        
        // Add animation
        errorMessage.style.opacity = '0';
        errorMessage.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            errorMessage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            errorMessage.style.opacity = '1';
            errorMessage.style.transform = 'translateY(0)';
        }, 10);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideMessage(errorMessage);
        }, 5000);
    }
    
    // Show success message
    function showSuccess() {
        successMessage.style.display = 'block';
        
        // Add animation
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            successMessage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Hide messages
    function hideMessages() {
        hideMessage(errorMessage);
        hideMessage(successMessage);
    }
    
    function hideMessage(element) {
        if (element.style.display === 'block') {
            element.style.opacity = '0';
            element.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                element.style.display = 'none';
                element.style.transition = '';
                element.style.opacity = '';
                element.style.transform = '';
            }, 300);
        }
    }
    
    // Check if already logged in
    function checkExistingSession() {
        const isAuthenticated = localStorage.getItem('admin_authenticated');
        const sessionData = localStorage.getItem('admin_session');
        
        if (isAuthenticated === 'true' && sessionData) {
            try {
                const session = JSON.parse(sessionData);
                // Check if session is still valid (24 hour timeout)
                const loginTime = new Date(session.loginTime);
                const now = new Date();
                const hoursPassed = (now - loginTime) / (1000 * 60 * 60);
                
                if (hoursPassed < 24) {
                    // Redirect to dashboard
                    showSuccess();
                    document.querySelector('.login-btn').innerHTML = '<i class="fas fa-check"></i> Already Authenticated';
                    setTimeout(() => {
                        window.location.href = '/admin/';
                    }, 1500);
                    return true;
                } else {
                    // Session expired
                    clearSession();
                }
            } catch (e) {
                // Invalid session data
                clearSession();
            }
        }
        return false;
    }
    
    // Clear session data
    function clearSession() {
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_session');
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press Enter to submit form
        if (e.key === 'Enter' && (usernameInput === document.activeElement || passwordInput === document.activeElement)) {
            loginForm.dispatchEvent(new Event('submit'));
        }
        
        // Press Escape to clear form
        if (e.key === 'Escape') {
            usernameInput.value = '';
            passwordInput.value = '';
            hideMessages();
            usernameInput.focus();
        }
    });
    
    // Add input validation
    usernameInput.addEventListener('input', function() {
        // Remove any special characters for username
        this.value = this.value.replace(/[^a-zA-Z0-9@_.-]/g, '');
    });
    
    // Add focus effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Initialize
    if (!checkExistingSession()) {
        // Focus on username field
        usernameInput.focus();
        
        // Add welcome animation
        document.querySelector('.login-card').style.opacity = '0';
        document.querySelector('.login-card').style.transform = 'translateY(30px)';
        setTimeout(() => {
            document.querySelector('.login-card').style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            document.querySelector('.login-card').style.opacity = '1';
            document.querySelector('.login-card').style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Add floating labels effect
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const label = this.previousElementSibling;
            if (this.value) {
                label.style.transform = 'translateY(-25px) scale(0.85)';
                label.style.color = '#D4AF37';
            } else {
                label.style.transform = '';
                label.style.color = '';
            }
        });
    });
});