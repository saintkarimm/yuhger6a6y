document.addEventListener('DOMContentLoaded', function() {
    // Audio player elements
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const totalTimeSpan = document.getElementById('total-time');
    const volumeSlider = document.getElementById('volume-slider');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    
    // Track info elements
    const currentTrackTitle = document.getElementById('current-track-title');
    const currentTrackArtist = document.getElementById('current-track-artist');
    const currentAlbumArt = document.getElementById('current-album-art');
    
    // Playlist elements
    const playlistTracks = document.querySelector('.playlist-tracks');
    const trackSelector = document.getElementById('track-selector');
    const addTrackBtn = document.getElementById('add-track-btn');
    const savePlaylistBtn = document.getElementById('save-playlist-btn');
    const loadPlaylistBtn = document.getElementById('load-playlist-btn');
    const clearPlaylistBtn = document.getElementById('clear-playlist-btn');
    
    // Equalizer sliders
    const eqSliders = document.querySelectorAll('.eq-slider');
    
    // Player state
    let isPlaying = false;
    let currentTrackIndex = 0;
    let isShuffle = false;
    let repeatMode = 0; // 0: no repeat, 1: repeat one, 2: repeat all
    
    // Local track data - will be populated dynamically
    let tracks = [];
    
    // Current playlist - will be initialized after tracks are loaded
    let playlist = [];
    
    // Initialize the player
    function initPlayer() {
        console.log('Initializing player...', {
            audioPlayer: !!audioPlayer,
            tracksCount: tracks.length,
            playlistCount: playlist.length
        }); // Debug log
        
        // Initialize the equalizer
        initEqualizer();
        
        updateTrackInfo();
        setupEventListeners();
        updatePlaylistDisplay();
        if (tracks.length > 0 && playlist.length > 0) {
            loadTrack(currentTrackIndex);
        }
    }
    
    // Initialize with local tracks
    function initLocalTracks() {
        console.log('Loading local tracks...'); // Debug log
        
        // Define the audio files in the player folder
        // In a real scenario, you'd use server-side code to scan the directory
        // For now, we'll define them manually based on what we know is in the folder
        const localAudioFiles = [
            {
                id: 1,
                title: "Best Lies",
                artist: "Yuhger6a6y",
                album: "Local Tracks",
                duration: "3:38", // This will be updated when the file loads
                src: "./Best Lies.mp3", // Local file in player folder with corrected extension
                albumArt: "../images/best lifes.jpeg"
            }
        ];
        
        console.log('Defined local audio files:', localAudioFiles); // Debug log
        
        // If you add more audio files to the player folder, add them here:
        /*
        {
            id: 2,
            title: "Track Name",
            artist: "Yuhger6a6y",
            album: "Local Tracks",
            duration: "0:00",
            src: "./track-name.mp3", // Local file in player folder
            albumArt: "../images/artist.png"
        }
        */
        
        tracks = localAudioFiles;
        
        // Update playlist to include local tracks
        playlist = [...tracks.slice(0, 4)]; // Start with first 4 tracks
        
        console.log('Playlist initialized with tracks:', playlist); // Debug log
        
        // Initialize the player after tracks are loaded
        initPlayer();
    }
    
    // Initialize with local tracks
    initLocalTracks();
    
    // Set up event listeners
    function setupEventListeners() {
        // Play/Pause button
        playPauseBtn.addEventListener('click', togglePlayPause);
        
        // Previous/Next buttons
        prevBtn.addEventListener('click', playPreviousTrack);
        nextBtn.addEventListener('click', playNextTrack);
        
        // Progress bar
        progressBar.addEventListener('input', function() {
            const seekTime = (this.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        });
        
        // Time update
        audioPlayer.addEventListener('timeupdate', updateProgress);
        
        // Volume control
        volumeSlider.addEventListener('input', function() {
            audioPlayer.volume = this.value;
        });
        
        // Track ended
        audioPlayer.addEventListener('ended', handleTrackEnd);
        
        // Shuffle button
        shuffleBtn.addEventListener('click', toggleShuffle);
        
        // Repeat button
        repeatBtn.addEventListener('click', toggleRepeat);
        
        // Add track button
        addTrackBtn.addEventListener('click', addTrackToPlaylist);
        
        // Save/load/clear playlist buttons
        savePlaylistBtn.addEventListener('click', savePlaylist);
        loadPlaylistBtn.addEventListener('click', loadPlaylist);
        clearPlaylistBtn.addEventListener('click', clearPlaylist);
        
        // Favorite buttons
        playlistTracks.addEventListener('click', function(e) {
            if (e.target.classList.contains('favorite-btn') || e.target.closest('.favorite-btn')) {
                const favoriteBtn = e.target.classList.contains('favorite-btn') ? 
                    e.target : e.target.closest('.favorite-btn');
                toggleFavorite(favoriteBtn);
            }
            
            if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
                const removeBtn = e.target.classList.contains('remove-btn') ? 
                    e.target : e.target.closest('.remove-btn');
                removeTrackFromPlaylist(removeBtn);
            }
        });
        
        // Equalizer sliders
        eqSliders.forEach(slider => {
            slider.addEventListener('input', function() {
                updateEqualizer();
                
                // Also update the label to show the current value
                const label = slider.parentElement.querySelector('label');
                if (label) {
                    label.textContent = slider.getAttribute('data-frequency') || label.textContent.split('Hz')[0] + 'Hz';
                }
            });
        });
    }
    
    // Toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }
    
    // Play track
    function playTrack() {
        const currentTrack = playlist[currentTrackIndex];
        console.log('Attempting to play track:', currentTrack); // Debug log
        
        // For local audio files, use the native audio player
        if (isAudioFile(currentTrack.src)) {
            console.log('Playing audio file:', currentTrack.src); // Debug log
            audioPlayer.play()
                .then(() => {
                    console.log('Playback started successfully'); // Debug log
                    isPlaying = true;
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    
                    // Connect to equalizer if available
                    connectAudioToEqualizer();
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                    alert('Could not play the audio file. Please make sure the file exists and is a valid audio format.\nError: ' + error.message);
                });
        } else {
            console.warn('Cannot play file - not recognized as audio:', currentTrack.src); // Debug log
        }
    }
    
    // Pause track
    function pauseTrack() {
        // Pause audio if it's a local file
        if (isAudioFile(playlist[currentTrackIndex]?.src)) {
            audioPlayer.pause();
        }
        
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    // The player now works exclusively with local audio files in the player folder.
    // To add more tracks, simply place audio files in the player folder and update the loadLocalTracks function.
    
    // Load track
    function loadTrack(index) {
        if (playlist.length === 0) return;
        
        const track = playlist[index];
        console.log('Loading track:', track); // Debug log
        
        // For local audio files
        if (isAudioFile(track.src)) {
            console.log('File is recognized as audio file, setting source:', track.src); // Debug log
            
            // Set up error handler before setting the source
            audioPlayer.onerror = function(e) {
                console.error('Error loading audio file:', track.src, e);
                alert('Could not load the audio file. The file may be corrupted or in an unsupported format.\nFile: ' + track.src + '\nError: ' + (e?.message || 'Unknown error'));
            };
            
            // Set up load handler to know when the file loads
            audioPlayer.oncanplaythrough = function() {
                console.log('Audio file loaded and ready to play:', track.src);
            };
            
            audioPlayer.src = track.src;
            // Enable audio controls for direct audio files
            audioPlayer.load();
            
            // Update duration when metadata is loaded
            audioPlayer.onloadedmetadata = function() {
                console.log('Metadata loaded, duration:', audioPlayer.duration); // Debug log
                // Update the track duration display
                if (playlist[currentTrackIndex]) {
                    playlist[currentTrackIndex].duration = formatTime(audioPlayer.duration);
                    updatePlaylistDisplay(); // Refresh the playlist to show correct duration
                }
            };
        } else {
            console.warn('File not recognized as audio file:', track.src); // Debug log
        }
        
        currentTrackIndex = index;
        
        updateTrackInfo();
        
        // Auto-play when loading a new track
        if (isPlaying) {
            playTrack();
        }
    }
    
    // Update track info display
    function updateTrackInfo() {
        if (playlist.length === 0 || !currentTrackTitle || !currentTrackArtist || !currentAlbumArt) return;
        
        const track = playlist[currentTrackIndex];
        currentTrackTitle.textContent = track.title;
        currentTrackArtist.textContent = track.artist;
        currentAlbumArt.src = track.albumArt;
    }
    
    // Play next track
    function playNextTrack() {
        if (playlist.length === 0) return;
        
        if (isShuffle) {
            currentTrackIndex = Math.floor(Math.random() * playlist.length);
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        }
        
        loadTrack(currentTrackIndex);
        if (isPlaying) playTrack();
    }
    
    // Play previous track
    function playPreviousTrack() {
        if (playlist.length === 0) return;
        
        if (isShuffle) {
            currentTrackIndex = Math.floor(Math.random() * playlist.length);
        } else {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        }
        
        loadTrack(currentTrackIndex);
        if (isPlaying) playTrack();
    }
    
    // Update progress bar
    function updateProgress() {
        if (audioPlayer.duration) {
            const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progressPercent;
            
            // Update time displays
            currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
            totalTimeSpan.textContent = formatTime(audioPlayer.duration);
        }
    }
    
    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    
    // Handle track end
    function handleTrackEnd() {
        if (repeatMode === 1) {
            // Repeat current track
            audioPlayer.currentTime = 0;
            playTrack();
        } else if (repeatMode === 2 || currentTrackIndex < playlist.length - 1) {
            // Move to next track or repeat all
            playNextTrack();
        } else {
            // Stop at end
            pauseTrack();
        }
    }
    
    // Toggle shuffle
    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleBtn.style.color = isShuffle ? '#8a2be2' : '#fff';
    }
    
    // Toggle repeat
    function toggleRepeat() {
        repeatMode = (repeatMode + 1) % 3; // Cycle 0 -> 1 -> 2 -> 0
        
        if (repeatMode === 0) {
            repeatBtn.style.color = '#fff';
            repeatBtn.title = 'Repeat Off';
        } else if (repeatMode === 1) {
            repeatBtn.style.color = '#8a2be2';
            repeatBtn.title = 'Repeat One';
            repeatBtn.innerHTML = '<i class="fas fa-redo"></i><span style="font-size:8px;position:absolute;">1</span>';
        } else {
            repeatBtn.style.color = '#8a2be2';
            repeatBtn.title = 'Repeat All';
            repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
        }
    }
    
    // Update playlist display
    function updatePlaylistDisplay() {
        if (!playlistTracks) return;
        
        playlistTracks.innerHTML = '';
        
        playlist.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'playlist-track';
            trackElement.dataset.trackId = track.id;
            
            trackElement.innerHTML = `
                <div class="track-number">${index + 1}</div>
                <div class="track-details">
                    <div class="track-title">${track.title}</div>
                    <div class="track-artist">${track.artist}</div>
                </div>
                <div class="track-duration">${track.duration}</div>
                <div class="track-actions">
                    <button class="track-action-btn remove-btn">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="track-action-btn favorite-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            `;
            
            playlistTracks.appendChild(trackElement);
        });
    }
    
    // Add track to playlist
    function addTrackToPlaylist() {
        const selectedValue = trackSelector.value;
        if (!selectedValue) return;
        
        const trackToAdd = tracks.find(track => track.id.toString() === selectedValue);
        if (trackToAdd) {
            // Check if track is already in playlist
            const isInPlaylist = playlist.some(track => track.id === trackToAdd.id);
            if (!isInPlaylist) {
                playlist.push({...trackToAdd});
                updatePlaylistDisplay();
                trackSelector.value = '';
            } else {
                alert('This track is already in your playlist!');
            }
        }
    }
    
    // Remove track from playlist
    function removeTrackFromPlaylist(button) {
        const trackElement = button.closest('.playlist-track');
        const trackId = parseInt(trackElement.dataset.trackId);
        
        // Remove from playlist array
        playlist = playlist.filter(track => track.id !== trackId);
        
        // Update display
        updatePlaylistDisplay();
        
        // Adjust current track index if needed
        if (currentTrackIndex >= playlist.length && playlist.length > 0) {
            currentTrackIndex = playlist.length - 1;
        } else if (playlist.length === 0) {
            currentTrackIndex = 0;
            pauseTrack();
        }
        
        // Reload current track if needed
        if (playlist.length > 0) {
            loadTrack(currentTrackIndex);
        }
    }
    
    // Toggle favorite
    function toggleFavorite(button) {
        button.classList.toggle('active');
        const icon = button.querySelector('i');
        
        if (button.classList.contains('active')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
    }
    
    // Save playlist to localStorage
    function savePlaylist() {
        localStorage.setItem('yuhger6a6y_playlist', JSON.stringify(playlist));
        alert('Playlist saved successfully!');
    }
    
    // Load playlist from localStorage
    function loadPlaylist() {
        const savedPlaylist = localStorage.getItem('yuhger6a6y_playlist');
        if (savedPlaylist) {
            try {
                playlist = JSON.parse(savedPlaylist);
                updatePlaylistDisplay();
                if (playlist.length > 0) {
                    currentTrackIndex = 0;
                    loadTrack(currentTrackIndex);
                }
                alert('Playlist loaded successfully!');
            } catch (e) {
                alert('Error loading playlist: ' + e.message);
            }
        } else {
            alert('No saved playlist found.');
        }
    }
    
    // Clear playlist
    function clearPlaylist() {
        if (confirm('Are you sure you want to clear the playlist?')) {
            playlist = [];
            updatePlaylistDisplay();
            pauseTrack();
        }
    }
    
    // Initialize Web Audio API for equalizer functionality
    let audioContext;
    let sourceNode;
    let gainNodes = [];
    let splitter;
    let merger;
    
    // Initialize the Web Audio API components for equalizer
    function initEqualizer() {
        try {
            // Create audio context
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create biquad filters for each frequency band (10 bands)
            const frequencyBands = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
            
            // Create biquad filters for each frequency band
            gainNodes = frequencyBands.map(freq => {
                const filter = audioContext.createBiquadFilter();
                filter.type = 'peaking'; // Peaking filter for EQ
                filter.frequency.value = freq; // Center frequency
                filter.Q.value = 1.0; // Quality factor
                filter.gain.value = 0; // Default to 0dB (no change)
                return filter;
            });
            
            console.log('Equalizer initialized');
        } catch (e) {
            console.error('Failed to initialize equalizer:', e);
            // Fallback to simulated equalizer
        }
    }
    
    // Update equalizer settings based on slider positions
    function updateEqualizer() {
        const eqSliders = document.querySelectorAll('.eq-slider');
        
        if (audioContext && gainNodes.length > 0) {
            // Update gain values based on slider positions
            eqSliders.forEach((slider, index) => {
                if (gainNodes[index]) {
                    // Convert slider value (-12 to 12) to gain value directly
                    const gainValue = parseFloat(slider.value); // Use the value directly as it's already in dB
                    gainNodes[index].gain.value = gainValue;
                }
            });
        } else {
            // Fallback: just log the values if Web Audio API isn't available
            console.log('Equalizer settings updated:', Array.from(eqSliders).map(s => s.value));
        }
    }
    
    // Connect audio element to Web Audio API when playing
    function connectAudioToEqualizer() {
        if (!audioContext || !audioPlayer) return;
        
        // Disconnect any existing connection
        if (sourceNode) {
            sourceNode.disconnect();
        }
        
        // Create new source node from audio element
        sourceNode = audioContext.createMediaElementSource(audioPlayer);
        
        // Connect source through all biquad filters in series
        let currentNode = sourceNode;
        
        gainNodes.forEach(filter => {
            currentNode.connect(filter);
            currentNode = filter;
        });
        
        // Connect the last filter to the destination
        currentNode.connect(audioContext.destination);
    }
    
    // Disconnect audio from equalizer when needed
    function disconnectAudioFromEqualizer() {
        if (sourceNode) {
            sourceNode.disconnect();
            sourceNode = null;
        }
    }
    
    // Helper function to check if URL is a direct audio file
    function isAudioFile(url) {
        const result = /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(url);
        console.log(`isAudioFile('${url}') = ${result}`); // Debug log
        return result;
    }
    
    // The player is initialized via initLocalTracks() which is called above
});