// video-debug.js -- small helper to detect autoplay blocking and expose a click-to-play overlay
(function(){
  function setupVideo(video){
    if (!video) return;
    // Ensure controls exist so user can manually test
    video.setAttribute('controls', '');

    // create overlay
    var overlay = video.parentElement.querySelector('.video-debug-overlay');
    if (!overlay){
      overlay = document.createElement('div');
      overlay.className = 'video-debug-overlay';
      overlay.style.cssText = 'display:none;position:absolute;inset:0;align-items:center;justify-content:center;z-index:1000;pointer-events:none;';
      var btn = document.createElement('button');
      btn.id = 'hero-click-play';
      btn.textContent = 'Play Video';
      btn.style.cssText = 'pointer-events:auto;padding:12px 20px;border-radius:8px;border:none;background:#fff;color:#111;font-weight:700;';
      overlay.appendChild(btn);
      video.parentElement.style.position = video.parentElement.style.position || 'relative';
      video.parentElement.appendChild(overlay);
      btn.addEventListener('click', function(){ video.muted = false; video.play().catch(console.error); overlay.style.display='none'; });
    }

    function showOverlay(){ overlay.style.display='flex'; }
    function hideOverlay(){ overlay.style.display='none'; }

    video.addEventListener('canplay', function(){ console.log('video canplay', video.currentSrc || video.src); hideOverlay(); });
    video.addEventListener('loadeddata', function(){ console.log('video loadeddata', video.currentSrc || video.src); });
    video.addEventListener('error', function(e){ console.error('video error', e, video.currentSrc || video.src); showOverlay(); });

    // Try autoplay
    video.play().then(()=>{ console.log('autoplay OK for', video.currentSrc || video.src); hideOverlay(); }).catch((err)=>{ console.warn('autoplay blocked for', video.currentSrc || video.src, err); showOverlay(); });
  }

  // run on DOM ready
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ document.querySelectorAll('video').forEach(setupVideo); });
  } else {
    document.querySelectorAll('video').forEach(setupVideo);
  }
})();
