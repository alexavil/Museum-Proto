(function() {
  const captionUrl = '../assets/common/captions.json';
  const vidEl = document.getElementById('vid-active');
  const captionEl = document.getElementById('caption');

  function showFallback() {
    captionEl.textContent = 'Gallery unavailable.';
  }

  createCarousel({
    manifestUrl: '../assets/vid/files.json',
    prevBtn: document.getElementById('prev'),
    nextBtn: document.getElementById('next'),
    mediaEl: vidEl,
    onFallback: showFallback,
    render(images, current) {
      const item = images[current];
      vidEl.src = `../assets/vid/${item}`;

      fetch(captionUrl)
        .then(r => {
          if (!r.ok) throw new Error('Failed to load manifest');
          return r.json();
        })
        .then(list => {
          captionEl.textContent = list.captions[item.split('_')[0]];
        })
        .catch(err => {
          console.error('Error loading captions:', err);
          showFallback();
        });
    }
  });
})();
