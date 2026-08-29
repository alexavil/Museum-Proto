// Shared prev/next carousel behavior for the image gallery and movie player:
// index wrapping, button/keyboard/swipe navigation, and manifest loading.
// Each page supplies its own `render` to draw the current item (image vs video).
function createCarousel({ manifestUrl, prevBtn, nextBtn, mediaEl, onFallback, render }) {
  let images = [];
  let current = 0;

  function setIndex(i) {
    if (!images.length) return;
    current = ((i % images.length) + images.length) % images.length;
    render(images, current, setIndex);
  }

  function bindControls() {
    prevBtn.addEventListener('click', () => setIndex(current - 1));
    nextBtn.addEventListener('click', () => setIndex(current + 1));

    const logo = document.getElementById('logo');
    if (logo) {
      logo.onclick = () => {
        location.href = '../index.html';
      };
    }

    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowLeft') setIndex(current - 1);
      if (ev.key === 'ArrowRight') setIndex(current + 1);
    });

    let startX = null;
    mediaEl.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].clientX; });
    mediaEl.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) setIndex(current + (dx > 0 ? -1 : 1));
      startX = null;
    });
  }

  fetch(manifestUrl)
    .then(r => {
      if (!r.ok) throw new Error('Failed to load manifest');
      return r.json();
    })
    .then(list => {
      images = Array.isArray(list.files) ? list.files : [];
      if (images.length === 0) return onFallback();
      setIndex(0);
      bindControls();
    })
    .catch(err => {
      console.error('Error loading manifest:', err);
      onFallback();
    });
}
