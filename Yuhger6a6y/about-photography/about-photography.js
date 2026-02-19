document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    let currentSection = 0;
    const totalSections = 5;
    const sections = document.querySelectorAll('.hero-section, .content-section');
    const indicators = document.querySelectorAll('.indicator');
    const imageLayers = document.querySelectorAll('.image-layer');
    
    // Initialize the first section
    showSection(0);
    
    // Normal scrolling behavior - no interference
    
    // Navigation event listeners
    document.querySelectorAll('.nav-arrow').forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = parseInt(this.getAttribute('data-section'));
            if (targetSection >= 0 && targetSection < totalSections) {
                showSection(targetSection);
            } else if (targetSection === -1) {
                // Previous section
                const prevSection = currentSection > 0 ? currentSection - 1 : totalSections - 1;
                showSection(prevSection);
            }
        });
    });
    
    // Indicator click events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSection(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            const nextSection = (currentSection + 1) % totalSections;
            showSection(nextSection);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevSection = currentSection > 0 ? currentSection - 1 : totalSections - 1;
            showSection(prevSection);
        }
    });
    
    // Mouse wheel navigation - COMPLETELY DISABLED to prevent scrolling issues
    // document.addEventListener('wheel', function(e) {
    //     // Disabled to prevent auto-scrolling problems
    // }, { passive: true });
    
    // Touch swipe navigation - COMPLETELY DISABLED to prevent scrolling issues
    // let touchStartY = 0;
    // let isTouchScrolling = false;
    // const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // 
    // if (isMobileDevice) {
    //     // Touch navigation disabled
    // }
    

    

    
    // Navigation bar scroll effect
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.nav');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Initialize animations
    initScrollAnimations();
    initStatsCounter();
    
    // Function to show specific section
    function showSection(sectionIndex) {
        // Update current section
        currentSection = sectionIndex;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === sectionIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Update image layers with fade transition
        imageLayers.forEach((layer, index) => {
            if (index === sectionIndex) {
                layer.classList.add('active');
            } else {
                layer.classList.remove('active');
            }
        });
        
        // Scroll to section with proper positioning
        const targetSection = sections[sectionIndex];
        if (targetSection) {
            // Use scrollIntoView with behavior
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
            
            // Ensure proper positioning after scroll
            setTimeout(() => {
                // Adjust scroll position to account for fixed header if needed
                const headerHeight = document.querySelector('.nav').offsetHeight;
                if (window.scrollY > 0) {
                    window.scrollTo({
                        top: window.scrollY - headerHeight,
                        behavior: 'auto' // Use auto to prevent loop
                    });
                }
            }, 500); // Wait for scroll to complete
        }
        
        // Trigger section-specific animations
        triggerSectionAnimations(sectionIndex);
    }
    
    // Trigger animations for specific section
    function triggerSectionAnimations(sectionIndex) {
        const section = sections[sectionIndex];
        if (!section) return;
        
        // Remove existing animation classes
        section.querySelectorAll('.animate-on-view').forEach(el => {
            el.classList.remove('animate-on-view');
        });
        
        // Add animation classes based on section type
        setTimeout(() => {
            if (sectionIndex === 0) {
                // Hero section animations
                const elements = section.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-credentials');
                elements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            } else {
                // Content section animations
                const contentElements = section.querySelectorAll('.section-title, .timeline-item, .philosophy-card, .achievement-item');
                contentElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 150);
                });
            }
        }, 100);
    }
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
                
                // Add staggered animations for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    const items = entry.target.parentElement.querySelectorAll('.timeline-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, index * 200);
                    });
                }
                
                // Add staggered animations for cards
                if (entry.target.classList.contains('philosophy-card') || 
                    entry.target.classList.contains('achievement-item')) {
                    const cards = entry.target.parentElement.querySelectorAll('.philosophy-card, .achievement-item');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.querySelectorAll('.timeline-item, .philosophy-card, .achievement-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
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

// Add parallax effect to background images
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.image-layer');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Initialize parallax effect
initParallax();

// Add smooth scrolling for anchor links
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