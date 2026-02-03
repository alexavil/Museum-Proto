(function() {
  const manifestUrl = '../assets/vid/files.json';
  const captionUrl = '../src/captions.json';
  const imgEl = document.getElementById('vid-active');
  const captionEl = document.getElementById('caption');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');

  let images = [];
  let current = 0;

  function updateUI() {
    const item = images[current];
    if (!item) return;
    const src = `../assets/vid/${item}`;
    imgEl.src = src;
    fetch(captionUrl)
      .then(r => {
      if (!r.ok) throw new Error('Failed to load manifest');
      return r.json();
    })
    .then(list => {
      imgEl.alt = list.captions[item.split(" ")[0]];
      captionEl.textContent = list.captions[item.split(" ")[0]];
    })
    .catch(err => {
      console.error('Error loading captions:', err);
      showFallback();
    });
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
