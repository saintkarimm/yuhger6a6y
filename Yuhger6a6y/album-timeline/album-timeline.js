document.addEventListener('DOMContentLoaded', function() {
    // Get all expand buttons
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    // Sample expanded content for each album
    const albumDetails = {
        0: {
            lyrics: [
                "Verse 1: In the silence of the night",
                "We hear echoes of our dreams",
                "Dancing with electric light",
                "Nothing's quite the way it seems"
            ],
            producer: "Produced by Alex Rivera",
            awards: ["Best Electronic Album 2024", "Top Album of the Year"],
            chartPosition: "Reached #3 on Electronic Charts",
            recordingInfo: "Recorded at Studio 7, Los Angeles over 6 months"
        },
        1: {
            lyrics: [
                "Chorus: We're living in digital dreams",
                "Where reality fades away",
                "In this virtual life it seems",
                "We've forgotten how to pray"
            ],
            producer: "Produced by Mia Chen",
            awards: ["Innovation in Sound Award"],
            chartPosition: "Reached #7 on Alternative Charts",
            recordingInfo: "Features guest vocals from Luna Rodriguez"
        },
        2: {
            lyrics: [
                "Bridge: Neon lights shine bright tonight",
                "Ritual begins as darkness falls",
                "Synthesized dreams take flight",
                "As the city's heartbeat calls"
            ],
            producer: "Produced by Jake Williams",
            awards: ["Best EP of 2025"],
            chartPosition: "Reached #12 on Electronic Charts",
            recordingInfo: "Mixed with analog equipment for vintage feel"
        },
        3: {
            lyrics: [
                "Outro: Echoes from tomorrow",
                "Whisper of the days gone by",
                "In this moment, here's the sorrow",
                "That we'll never say goodbye"
            ],
            producer: "Produced by David Kim",
            awards: ["Debut Album of the Year"],
            chartPosition: "Reached #5 on Electronic Charts",
            recordingInfo: "First album to feature the signature Yuhger6a6y sound"
        },
        4: {
            lyrics: [
                "Intro: Static waves crash upon the shore",
                "Of consciousness and dreams",
                "In this analog world we explore",
                "The beauty in the seams"
            ],
            producer: "Produced by Sarah Johnson",
            awards: ["Minimalist Music Award"],
            chartPosition: "Reached #9 on Electronic Charts",
            recordingInfo: "Recorded entirely with vintage synthesizers"
        },
        5: {
            lyrics: [
                "Single: Frequency of midnight thoughts",
                "Pulsing through the dark",
                "In the silence, love is caught",
                "Before the morning starts"
            ],
            producer: "Produced by Yuhger6a6y & Alex Rivera",
            awards: ["Best Single of 2026"],
            chartPosition: "Reached #1 on Electronic Charts",
            recordingInfo: "Features innovative vocal processing techniques"
        }
    };
    
    // Add click event listeners to expand buttons
    expandButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Find the album info container
            const albumInfo = this.closest('.album-info');
            let expandedContent = albumInfo.querySelector('.album-expanded-content');
            
            // Toggle the expanded content
            if (expandedContent) {
                expandedContent.classList.toggle('show');
                
                // Change button icon
                const icon = this.querySelector('i');
                if (expandedContent.classList.contains('show')) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                    this.innerHTML = '<i class="fas fa-chevron-up"></i> Less Details';
                } else {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                    this.innerHTML = '<i class="fas fa-chevron-down"></i> More Details';
                }
            } else {
                // Create expanded content if it doesn't exist
                expandedContent = document.createElement('div');
                expandedContent.className = 'album-expanded-content';
                
                // Get album details
                const details = albumDetails[index];
                
                // Create content HTML
                let contentHTML = `
                    <div class="lyrics-section">
                        <h4>Lyrics Preview:</h4>
                        <p>${details.lyrics.join('<br>')}</p>
                    </div>
                    <div class="production-info">
                        <h4>Production Info:</h4>
                        <p><strong>Producer:</strong> ${details.producer}</p>
                        <p><strong>Recording:</strong> ${details.recordingInfo}</p>
                    </div>
                    <div class="awards-section">
                        <h4>Awards & Recognition:</h4>
                        <ul>
                            ${details.awards.map(award => `<li>${award}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="chart-info">
                        <h4>Chart Performance:</h4>
                        <p>${details.chartPosition}</p>
                    </div>
                `;
                
                expandedContent.innerHTML = contentHTML;
                albumInfo.appendChild(expandedContent);
                
                // Add show class and update button
                expandedContent.classList.add('show');
                const icon = this.querySelector('i');
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
                this.innerHTML = '<i class="fas fa-chevron-up"></i> Less Details';
            }
        });
    });
    
    // Add scroll animation for timeline items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    // Observe all timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });
    
    // Add vinyl rotation effect
    const vinylOverlays = document.querySelectorAll('.vinyl-overlay');
    vinylOverlays.forEach(vinyl => {
        // Add rotation animation
        vinyl.style.animation = 'rotateVinyl 10s linear infinite';
    });
    
    // Add CSS for vinyl rotation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rotateVinyl {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .vinyl-overlay {
            animation-play-state: running;
        }
    `;
    document.head.appendChild(style);
    
    // Back to Top Button functionality
    const backToTopButton = document.getElementById('backToTop');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    // Smooth scroll to top
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});