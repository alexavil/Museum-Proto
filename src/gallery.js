(function() {
  const captionUrl = '../assets/common/captions.json';
  const imgEl = document.getElementById('img-active');
  const captionEl = document.getElementById('caption');
  const thumbsEl = document.getElementById('thumbs-left');
  const thumbsEr = document.getElementById('thumbs-right');

  function preload(src) {
    const i = new Image();
    i.src = src;
  }

  function showFallback() {
    captionEl.textContent = 'Gallery unavailable.';
  }

  function renderThumbs(images, current, setIndex) {
    if (!thumbsEl || !thumbsEr) return;
    thumbsEl.innerHTML = '';
    thumbsEr.innerHTML = '';
    if (images.length <= 1) return;
    const prevIdx = (current - 1 + images.length) % images.length;
    const nextIdx = (current + 1) % images.length;
    const prev = images[prevIdx];
    const next = images[nextIdx];

    if (prev) {
      const tPrev = document.createElement('img');
      tPrev.src = `../assets/img/${prev}`;
      tPrev.alt = prev;
      tPrev.loading = 'lazy';
      tPrev.title = 'Previous';
      tPrev.addEventListener('click', () => setIndex(prevIdx));
      thumbsEl.appendChild(tPrev);
    }

    if (next) {
      const tNext = document.createElement('img');
      tNext.src = `../assets/img/${next}`;
      tNext.alt = next;
      tNext.loading = 'lazy';
      tNext.title = 'Next';
      tNext.addEventListener('click', () => setIndex(nextIdx));
      thumbsEr.appendChild(tNext);
    }
  }

  createCarousel({
    manifestUrl: '../assets/img/files.json',
    prevBtn: document.getElementById('prev'),
    nextBtn: document.getElementById('next'),
    mediaEl: imgEl,
    onFallback: showFallback,
    render(images, current, setIndex) {
      const item = images[current];
      imgEl.src = `../assets/img/${item}`;

      fetch(captionUrl)
        .then(r => {
          if (!r.ok) throw new Error('Failed to load manifest');
          return r.json();
        })
        .then(list => {
          imgEl.alt = list.captions[item.split('_')[0]];
          captionEl.textContent = list.captions[item.split('_')[0]];
        })
        .catch(err => {
          console.error('Error loading captions:', err);
          showFallback();
        });

      renderThumbs(images, current, setIndex);

      const prev = images[(current - 1 + images.length) % images.length];
      const next = images[(current + 1) % images.length];
      if (prev) preload(`../assets/img/${prev}`);
      if (next) preload(`../assets/img/${next}`);
    }
  });
})();
