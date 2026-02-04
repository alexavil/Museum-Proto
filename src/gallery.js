(function() {
  const manifestUrl = '../assets/img/files.json';
  const captionUrl = '../assets/common/captions.json';
  const imgEl = document.getElementById('img-active');
  const captionEl = document.getElementById('caption');
  const thumbsEl = document.getElementById('thumbs-left');
  const thumbsEr = document.getElementById('thumbs-right');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let images = [];
  let current = 0;

  function preload(src) {
    const i = new Image();
    i.src = src;
  }

  function renderThumbs() {
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
      tPrev.alt = prev.caption || prev;
      tPrev.loading = 'lazy';
      tPrev.title = 'Previous';
      tPrev.addEventListener('click', () => setIndex(prevIdx));
      thumbsEl.appendChild(tPrev);
    }

    if (next) {
      const tNext = document.createElement('img');
      tNext.src = `../assets/img/${next}`;
      tNext.alt = next.caption || next;
      tNext.loading = 'lazy';
      tNext.title = 'Next';
      tNext.addEventListener('click', () => setIndex(nextIdx));
      thumbsEr.appendChild(tNext);
    }
  }

  function updateUI() {
    const item = images[current];
    if (!item) return;
    const src = `../assets/img/${item}`;
    imgEl.src = src;
    fetch(captionUrl)
      .then(r => {
      if (!r.ok) throw new Error('Failed to load manifest');
      return r.json();
    })
    .then(list => {
      imgEl.alt = list.captions[item.split("_")[0]];
      captionEl.textContent = list.captions[item.split("_")[0]];
    })
    .catch(err => {
      console.error('Error loading captions:', err);
      showFallback();
    });

    // show only prev/next thumbnails
    renderThumbs();

    // preload neighbors
    const prev = images[(current - 1 + images.length) % images.length];
    const next = images[(current + 1) % images.length];
    if (prev) preload(`../assets/img/${prev}`);
    if (next) preload(`../assets/img/${next}`);
  }

  function setIndex(i) {
    if (!images || images.length === 0) return;
    current = ((i % images.length) + images.length) % images.length;
    updateUI();
  }

  function bindControls() {
    prevBtn.addEventListener('click', () => {
      setIndex(current - 1);
    });
    nextBtn.addEventListener('click', () => {
      setIndex(current + 1)
    });

    document.getElementById("logo").onclick = () => {
      location.href = "../index.html"
    }

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
      images = Array.isArray(list.files) ? list.files : [];
      if (images.length === 0) return showFallback();
      setIndex(0);
      bindControls();
    })
    .catch(err => {
      console.error('Error loading images:', err);
      showFallback();
    });
})();
