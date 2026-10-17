'use strict';
// Google Sites videos are preserved, but YouTube is not contacted for a player
// until someone activates that specific card. No automatic playback requests.
document.addEventListener('click', (event) => {
    const button = event.target.closest('.media-launch');
    if (!button) return;
    const url = button.dataset.embedUrl || '';
    if (!/^https:\/\/www\.youtube\.com\/embed\/(?:[A-Za-z0-9_-]{11}|videoseries\?list=PL[A-Za-z0-9_-]+)$/.test(url)) return;
    const iframe = document.createElement('iframe');
    iframe.title = button.dataset.videoTitle || 'YouTube video';
    iframe.src = url + (url.includes('?') ? '&' : '?') + 'autoplay=1';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    button.parentElement.replaceChildren(iframe);
});
