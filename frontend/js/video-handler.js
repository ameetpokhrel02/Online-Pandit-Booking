// Video Handler for Book Pandit (robust selector + diagnostics)
class VideoHandler {
    constructor() {
        // Match common hero video selectors used in the project
        this.videos = Array.from(document.querySelectorAll('#hero-video, .hero-bg-video, .video-background video'));
        this.init();
    }

    init() {
        if (!this.videos.length) {
            console.log('No hero videos found on this page');
            return;
        }
        this.setupVideoHandlers();
        this.checkVideoSupport();
    }

    setupVideoHandlers() {
        this.videos.forEach((video) => {
            // Find fallback and loading indicators relative to the video's container
            const container = video.closest('.video-background') || video.parentElement;
            const fallback = container ? container.querySelector('.video-fallback') : null;
            const loadingIndicator = container ? container.querySelector('.video-loading') : null;

            // Show loading indicator initially
            if (loadingIndicator) loadingIndicator.style.display = 'block';

            // Error handling
            video.addEventListener('error', (e) => {
                console.error('Video error for', video.currentSrc || video.src, e);
                // Try a HEAD request to diagnose 404/CORS
                this.diagnoseVideoUrl(video.currentSrc || video.src).catch(() => {});
                this.showFallback(video, fallback, loadingIndicator);
            });

            // Load success
            video.addEventListener('loadeddata', () => {
                console.log('Video loaded successfully:', video.currentSrc || video.src);
                this.hideFallback(fallback, loadingIndicator);
                video.style.display = '';
            });

            // Can play
            video.addEventListener('canplay', () => {
                console.log('Video can play:', video.currentSrc || video.src);
                this.hideFallback(fallback, loadingIndicator);
            });

            // Load start
            video.addEventListener('loadstart', () => {
                console.log('Video load started:', video.currentSrc || video.src);
                if (loadingIndicator) loadingIndicator.style.display = 'block';
            });

            // Timeout for video loading
            setTimeout(() => {
                if (video.readyState < 2) { // HAVE_CURRENT_DATA
                    console.warn('Video readyState indicates not enough data, showing fallback for', video.currentSrc || video.src);
                    this.showFallback(video, fallback, loadingIndicator);
                }
            }, 7000); // 7 second timeout
        });
    }

    async diagnoseVideoUrl(url) {
        if (!url) return;
        try {
            const res = await fetch(url, { method: 'HEAD' });
            console.log('HEAD', url, 'status', res.status, res.statusText);
            return res;
        } catch (err) {
            console.warn('HEAD check failed for', url, err);
            throw err;
        }
    }

    showFallback(video, fallback, loadingIndicator) {
        if (fallback) {
            fallback.style.display = 'block';
            fallback.style.zIndex = '1';
        }
        if (video) video.style.display = 'none';
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }

    hideFallback(fallback, loadingIndicator) {
        if (fallback) fallback.style.display = 'none';
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }

    checkVideoSupport() {
        const v = document.createElement('video');
        const canPlayMP4 = v.canPlayType('video/mp4');
        if (!canPlayMP4) {
            console.warn('Browser reports it cannot play MP4 video (canPlayType returned)', canPlayMP4);
            // show fallbacks for all
            this.videos.forEach((video) => {
                const container = video.closest('.video-background') || video.parentElement;
                const fallback = container ? container.querySelector('.video-fallback') : null;
                const loadingIndicator = container ? container.querySelector('.video-loading') : null;
                this.showFallback(video, fallback, loadingIndicator);
            });
        }
    }

}

// Initialize video handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new VideoHandler();
    } catch (err) {
        console.error('Failed to initialize VideoHandler', err);
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoHandler;
}
