document.addEventListener('DOMContentLoaded', function() {
    // Initialize form submission
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            // Basic validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show success message (in a real implementation, this would send the form)
            alert(`Thank you, ${name}! Your message has been sent successfully. We'll get back to you soon.`);
            
            // Reset form
            this.reset();
        });
    }
    
    // Add hover effects to social cards
    document.querySelectorAll('.social-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
            this.style.boxShadow = '0 25px 50px rgba(138, 43, 226, 0.4), 0 15px 35px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // Add hover effects to submit button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(138, 43, 226, 0.5), 0 8px 20px rgba(0, 0, 0, 0.4)';
        });
        
        submitBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
        });
    }
    
    // Add scroll animations
    initScrollAnimations();
});

// Initialize scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for social cards
                if (entry.target.classList.contains('social-card')) {
                    const cards = document.querySelectorAll('.social-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.social-card, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add parallax effect to background elements
function addParallaxEffect() {
    // Disable parallax effect on social icons to prevent floating/hovering
    // This was causing icons to float instead of staying in their cards
    /*
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.social-icon');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px) scale(1)`;
        });
    });
    */
}

// Create liquid glass effect on mouse move
function createLiquidEffect() {
    const container = document.querySelector('.contact-container');
    
    if (container) {
        container.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 25;
            const y = (window.innerHeight / 2 - e.clientY) / 25;
            
            // Only apply the effect to the containers, not individual icons inside them
            document.querySelectorAll('.social-card, .contact-form, .info-item').forEach(element => {
                // Skip applying transform to social icons specifically to keep them stable
                if (!element.classList.contains('social-icon')) {
                    element.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
                }
            });
        });
        
        container.addEventListener('mouseleave', () => {
            document.querySelectorAll('.social-card, .contact-form, .info-item').forEach(element => {
                // Only reset transform for elements that had it applied
                if (!element.classList.contains('social-icon')) {
                    element.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
                }
            });
        });
    }
}

// Check if Font Awesome icons are loaded properly
function checkFontAwesome() {
    const icon = document.createElement('i');
    icon.className = 'fas fa-home';
    icon.style.visibility = 'hidden';
    icon.style.position = 'absolute';
    document.body.appendChild(icon);
    
    // Check if the icon has any content or width after loading
    setTimeout(() => {
        const computedStyle = window.getComputedStyle(icon);
        if (computedStyle.fontFamily.indexOf('Font Awesome') === -1) {
            console.warn('Font Awesome icons may not be loading properly');
            // Add a fallback style if needed
            document.querySelectorAll('i.fas, i.fab, i.far').forEach(icon => {
                icon.style.fontFamily = 'Arial, sans-serif';
                icon.style.fontSize = '1.2em';
            });
        }
        document.body.removeChild(icon);
    }, 1000);
}

// Initialize parallax effect
addParallaxEffect();

// Initialize liquid glass effect
createLiquidEffect();

// Check Font Awesome after DOM loads
checkFontAwesome();