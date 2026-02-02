(function() {
  const manifestUrl = 'assets/img/images.json';
  const imgEl = document.getElementById('img-active');
  const captionEl = document.getElementById('caption');
  const thumbsEl = document.getElementById('thumbs');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let images = [];
  let current = 0;

  function preload(src) {
    const i = new Image();
    i.src = src;
  }

  function renderThumbs() {
    if (!thumbsEl) return;
    thumbsEl.innerHTML = '';
    if (images.length <= 1) return;
    const prevIdx = (current - 1 + images.length) % images.length;
    const nextIdx = (current + 1) % images.length;
    const prev = images[prevIdx];
    const next = images[nextIdx];

    if (prev) {
      const tPrev = document.createElement('img');
      tPrev.src = `assets/img/${prev.file}`;
      tPrev.alt = prev.caption || prev.file;
      tPrev.loading = 'lazy';
      tPrev.title = 'Previous';
      tPrev.addEventListener('click', () => setIndex(prevIdx));
      thumbsEl.appendChild(tPrev);
    }

    if (next) {
      const tNext = document.createElement('img');
      tNext.src = `assets/img/${next.file}`;
      tNext.alt = next.caption || next.file;
      tNext.loading = 'lazy';
      tNext.title = 'Next';
      tNext.addEventListener('click', () => setIndex(nextIdx));
      thumbsEl.appendChild(tNext);
    }
  }

  function updateUI() {
    const item = images[current];
    if (!item) return;
    const src = `assets/img/${item.file}`;
    imgEl.src = src;
    imgEl.alt = item.caption || item.file;
    captionEl.textContent = item.caption || item.file;

    // show only prev/next thumbnails
    renderThumbs();

    // preload neighbors
    const prev = images[(current - 1 + images.length) % images.length];
    const next = images[(current + 1) % images.length];
    if (prev) preload(`assets/img/${prev.file}`);
    if (next) preload(`assets/img/${next.file}`);
  }

  function setIndex(i) {
    if (!images || images.length === 0) return;
    current = ((i % images.length) + images.length) % images.length;
    updateUI();
  }

  function bindControls() {
    prevBtn.addEventListener('click', () => setIndex(current - 1));
    nextBtn.addEventListener('click', () => setIndex(current + 1));

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowLeft') setIndex(current - 1);
      if (ev.key === 'ArrowRight') setIndex(current + 1);
    });

    // swipe support
    let startX = null;
    imgEl.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].clientX; });
    imgEl.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) setIndex(current + (dx > 0 ? -1 : 1));
      startX = null;
    });
  }

  function showFallback() {
    captionEl.textContent = 'Gallery unavailable.';
  }

  // boot
  fetch(manifestUrl)
    .then(r => {
      if (!r.ok) throw new Error('Failed to load manifest');
      return r.json();
    })
    .then(list => {
      images = Array.isArray(list) ? list : [];
      if (images.length === 0) return showFallback();
      setIndex(0);
      bindControls();
    })
    .catch(err => {
      console.error('Error loading images:', err);
      showFallback();
    });
})();
