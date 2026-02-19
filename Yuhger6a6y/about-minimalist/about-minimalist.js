document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initScrollAnimations();
    initHoverEffects();
    initStatsCounter();
    initParallax();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add hover effects to interactive elements
    document.querySelectorAll('.social-link, .achievement-card').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform ? 
                this.style.transform.replace(/translateY\([^)]+\)/, 'translateY(-8px)') : 
                'translateY(-8px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform ? 
                this.style.transform.replace(/translateY\([^)]+\)/, 'translateY(0px)') : 
                '';
        });
    });
    
    // Add click handlers for social links
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('span').textContent;
            alert(`Redirecting to ${platform}...`);
            // In a real implementation, this would redirect to actual social media profiles
        });
    });
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
                
                // Add staggered animation for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    const items = document.querySelectorAll('.timeline-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, index * 200);
                    });
                }
                
                // Add staggered animation for achievement cards
                if (entry.target.classList.contains('achievement-card')) {
                    const cards = document.querySelectorAll('.achievement-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
                
                // Add staggered animation for principle items
                if (entry.target.classList.contains('principle-item')) {
                    const principles = document.querySelectorAll('.principle-item');
                    principles.forEach((principle, index) => {
                        setTimeout(() => {
                            principle.style.opacity = '1';
                            principle.style.transform = 'translateX(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.timeline-item, .achievement-card, .principle-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize hover effects
function initHoverEffects() {
    // Add hover effect to portrait
    const portrait = document.querySelector('.portrait-image');
    const overlay = document.querySelector('.portrait-overlay');
    
    if (portrait && overlay) {
        portrait.addEventListener('mouseenter', () => {
            overlay.style.opacity = '0.3';
        });
        
        portrait.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
        });
    }
    
    // Add hover effects to principle items
    document.querySelectorAll('.principle-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.principle-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.principle-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.background = 'rgba(255, 255, 255, 0.05)';
            }
        });
    });
    
    // Add hover effects to achievement cards
    document.querySelectorAll('.achievement-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.achievement-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.achievement-icon');
            if (icon) {
                icon.style.transform = 'scale(1) translateY(0)';
            }
        });
    });
}

// Initialize animated statistics counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.credential-number');
    
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            
            if (element.textContent.includes('M+')) {
                element.textContent = value + 'M+';
            } else if (element.textContent.includes('+')) {
                element.textContent = value + '+';
            } else {
                element.textContent = value;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // Set up intersection observer for stats
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate each stat
                const stats = [
                    { element: statNumbers[0], end: 50, duration: 2000 },
                    { element: statNumbers[1], end: 25, duration: 1500 },
                    { element: statNumbers[2], end: 10, duration: 1000 }
                ];
                
                stats.forEach(stat => {
                    if (stat.element) {
                        animateValue(stat.element, 0, stat.end, stat.duration);
                    }
                });
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe the hero section for stats animation
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        statsObserver.observe(heroSection);
    }
}

// Add parallax effect to background elements
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.visual-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Add subtle animations to visual elements
function initVisualAnimations() {
    const elements = document.querySelectorAll('.visual-element');
    
    elements.forEach(element => {
        // Add random initial delay
        const delay = Math.random() * 3;
        element.style.animationDelay = `${delay}s`;
        
        // Add random opacity variation
        const opacity = 0.2 + Math.random() * 0.3;
        element.style.opacity = opacity.toString();
    });
}

// Initialize visual animations
initVisualAnimations();