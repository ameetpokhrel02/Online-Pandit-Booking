// Video Handler for Book Pandit
class VideoHandler {
    constructor() {
        this.videos = document.querySelectorAll('#hero-video');
        this.fallbacks = document.querySelectorAll('.video-fallback');
        this.init();
    }

    init() {
        this.setupVideoHandlers();
        this.checkVideoSupport();
    }

    setupVideoHandlers() {
        this.videos.forEach((video, index) => {
            const fallback = this.fallbacks[index];
            
            if (video && fallback) {
                // Error handling
                video.addEventListener('error', (e) => {
                    console.log('Video error:', e);
                    this.showFallback(video, fallback);
                });

                // Load success
                video.addEventListener('loadeddata', () => {
                    console.log('Video loaded successfully');
                    this.hideFallback(fallback);
                });

                // Can play
                video.addEventListener('canplay', () => {
                    console.log('Video can play');
                    this.hideFallback(fallback);
                });

                // Load start
                video.addEventListener('loadstart', () => {
                    console.log('Video loading started');
                });

                // Progress
                video.addEventListener('progress', () => {
                    console.log('Video loading progress');
                });

                // Timeout for video loading
                setTimeout(() => {
                    if (video.readyState < 2) { // HAVE_CURRENT_DATA
                        console.log('Video loading timeout, showing fallback');
                        this.showFallback(video, fallback);
                    }
                }, 5000); // 5 second timeout
            }
        });
    }

    showFallback(video, fallback) {
        if (fallback) {
            fallback.style.display = 'block';
            fallback.style.zIndex = '1';
        }
        if (video) {
            video.style.display = 'none';
        }
    }

    hideFallback(fallback) {
        if (fallback) {
            fallback.style.display = 'none';
        }
    }

    checkVideoSupport() {
        const video = document.createElement('video');
        const canPlayMP4 = video.canPlayType('video/mp4');
        
        if (!canPlayMP4) {
            console.log('MP4 not supported, showing fallbacks');
            this.showAllFallbacks();
        }
    }

    showAllFallbacks() {
        this.fallbacks.forEach(fallback => {
            this.showFallback(null, fallback);
        });
    }

    // Method to retry video loading
    retryVideo(videoElement) {
        if (videoElement) {
            videoElement.load();
            console.log('Retrying video load');
        }
    }
}

// Initialize video handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VideoHandler();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoHandler;
}
