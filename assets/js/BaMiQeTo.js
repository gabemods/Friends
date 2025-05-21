// Animate nav buttons on DOM load
window.addEventListener('DOMContentLoaded', () => {
  const buttons = [document.getElementById('profilesBtn'), document.getElementById('photosBtn')];
  buttons.forEach(btn => {
    if (btn) {
      btn.classList.add('nav-button-animate');
      setTimeout(() => {
        btn.classList.remove('nav-button-animate');
      }, 800);
    }
  });
});

// Scroll indicators
const container = document.querySelector('.scroll-container');
const dots = document.querySelectorAll('.dot');

function updateDots() {
  const index = Math.round(container.scrollLeft / container.offsetWidth);
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[index]) dots[index].classList.add('active');
}

container?.addEventListener('scroll', updateDots);

function fixHeight() {
  document.querySelector('.scroll-container').style.height = window.innerHeight + 'px';
  document.querySelectorAll('.page').forEach(p => {
    p.style.height = window.innerHeight + 'px';
    p.style.display = 'flex';
    p.style.flexDirection = 'column';
    p.style.justifyContent = 'center';
  });
}

window.addEventListener('resize', fixHeight);
window.addEventListener('orientationchange', fixHeight);
fixHeight();

// Scroll to default profile
window.addEventListener('load', () => {
  const scroller = document.getElementById('cardScroller');
  const defaultPage = document.getElementById('main-profile');
  if (scroller && defaultPage) {
    scroller.scrollLeft = defaultPage.offsetLeft;
  }
});

// Horizontal scroll with mouse wheel
const scroller = document.getElementById('cardScroller');
scroller?.addEventListener('wheel', function (e) {
  e.preventDefault();
  scroller.scrollLeft += e.deltaY;
}, { passive: false });

// Zoomable images
const images = document.querySelectorAll('img');
const overlay = document.createElement('div');
const popupImg = document.createElement('img');

overlay.style.cssText = `
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.8);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: background-color 0.3s ease;
`;

popupImg.style.cssText = `
  position: fixed;
  max-width: 90vw;
  max-height: 90vh;
  touch-action: none;
  pointer-events: none;
  will-change: transform, border-radius;
  object-fit: cover;
`;

overlay.appendChild(popupImg);
document.body.appendChild(overlay);

let originImg = null;
let startX = 0, startY = 0;
let isDragging = false;
let originalRect = null;
const MIN_SIZE = 80;

function getTransforms(fromRect, targetW, targetH) {
  const scaleX = fromRect.width / targetW;
  const scaleY = fromRect.height / targetH;
  const translateX = fromRect.left + fromRect.width / 2 - window.innerWidth / 2;
  const translateY = fromRect.top + fromRect.height / 2 - window.innerHeight / 2;
  return { scaleX, scaleY, translateX, translateY };
}

images.forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    originImg = img;
    const rect = img.getBoundingClientRect();
    originalRect = rect;
    popupImg.src = img.src;

    popupImg.style.removeProperty('width');
    popupImg.style.removeProperty('height');
    popupImg.style.removeProperty('aspect-ratio');
    popupImg.style.transition = 'none';
    popupImg.style.transform = '';
    popupImg.style.borderRadius = '';
    popupImg.style.pointerEvents = 'none';

    popupImg.onload = () => {
      popupImg.offsetWidth;
      const naturalW = popupImg.naturalWidth;
      const naturalH = popupImg.naturalHeight;
      const aspectRatio = naturalW / naturalH;
      const maxW = window.innerWidth * 0.9;
      const maxH = window.innerHeight * 0.9;
      let finalW, finalH;

      if (maxW / maxH > aspectRatio) {
        finalH = maxH;
        finalW = finalH * aspectRatio;
      } else {
        finalW = maxW;
        finalH = finalW / aspectRatio;
      }

      const { scaleX, scaleY, translateX, translateY } = getTransforms(rect, finalW, finalH);
      popupImg.style.width = `${finalW}px`;
      popupImg.style.height = `${finalH}px`;
      overlay.style.display = 'flex';

      requestAnimationFrame(() => {
        popupImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
        requestAnimationFrame(() => {
          popupImg.style.transition = 'transform 0.4s ease, border-radius 0.4s ease';
          popupImg.style.transform = `translate(0, 0) scale(1)`;
          popupImg.style.borderRadius = '12px';
          popupImg.style.pointerEvents = 'auto';
        });
      });
    };
  });
});

function closePopup() {
  if (!originImg || !originalRect) return;

  const finalW = parseFloat(popupImg.style.width);
  const finalH = parseFloat(popupImg.style.height);
  const { scaleX, scaleY, translateX, translateY } = getTransforms(originalRect, finalW, finalH);

  popupImg.style.transition = 'transform 0.35s ease, border-radius 0.35s ease';
  popupImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
  popupImg.style.borderRadius = '50%';
  overlay.style.transition = 'background-color 0.35s ease';
  overlay.style.backgroundColor = 'rgba(0,0,0,0)';

  popupImg.addEventListener('transitionend', () => {
    overlay.style.display = 'none';
    popupImg.removeAttribute('style');
    popupImg.style.cssText = `
      position: fixed;
      max-width: 90vw;
      max-height: 90vh;
      touch-action: none;
      pointer-events: none;
      will-change: transform, border-radius;
      object-fit: cover;
    `;
    overlay.style.transition = '';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
  }, { once: true });
}

overlay.addEventListener('click', e => {
  if (e.target === overlay) closePopup();
});

popupImg.addEventListener('pointerdown', e => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  popupImg.setPointerCapture(e.pointerId);

  const side = Math.min(popupImg.offsetWidth, popupImg.offsetHeight);
  popupImg.style.width = `${side}px`;
  popupImg.style.height = `${side}px`;
  popupImg.style.aspectRatio = '1 / 1';
});

popupImg.addEventListener('pointermove', e => {
  if (!isDragging) return;

  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  const baseSize = parseFloat(popupImg.style.width);
  const minScale = MIN_SIZE / baseSize;
  const shrinkAmount = Math.min(distance / (window.innerHeight * 0.5), 1);
  const scale = Math.max(minScale, 1 - shrinkAmount);

  popupImg.style.transition = 'none';
  popupImg.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
  popupImg.style.borderRadius = '50%';
  overlay.style.backgroundColor = `rgba(0,0,0,${0.8 * scale})`;
});

popupImg.addEventListener('pointerup', e => {
  if (!isDragging) return;
  isDragging = false;

  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  if (distance > 100) {
    closePopup();
  } else {
    popupImg.style.transition = 'transform 0.3s ease, border-radius 0.3s ease';
    popupImg.style.transform = 'translate(0, 0) scale(1)';
    popupImg.style.borderRadius = '12px';
    overlay.style.transition = 'background-color 0.3s ease';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    popupImg.addEventListener('transitionend', () => {
      popupImg.style.transition = '';
    }, { once: true });
  }
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themePath = themeIcon.querySelector("path");

const sunPath = "M12 3v2m0 14v2m9-9h-2M5 12H3"
              + "m15.364-6.364l-1.414 1.414"
              + "M6.05 17.95l-1.414 1.414"
              + "M17.95 17.95l1.414-1.414"
              + "M6.05 6.05L4.636 7.464"
              + "M12 8a4 4 0 100 8 4 4 0 000-8z";

const moonPath = "M21 12.79A9 9 0 1111.21 3"
               + "a7 7 0 009.79 9.79z";

let dark = false;
let isAnimating = false;

themeToggle.addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;
  dark = !dark;

  document.body.classList.toggle("dark-mode", dark);
  themeIcon.classList.remove("sun-rotate-fade", "fade-out", "sun-fade-in-spin", "moon-fade-in-tilt");

  if (dark) {
    themeIcon.classList.add("sun-rotate-fade");
    setTimeout(() => {
      themePath.setAttribute("d", moonPath);
      themeIcon.classList.remove("sun-rotate-fade");
      themeIcon.classList.add("moon-fade-in-tilt");
      setTimeout(() => {
        themeIcon.classList.remove("moon-fade-in-tilt");
        isAnimating = false;
      }, 500);
    }, 600);
  } else {
    themeIcon.classList.add("fade-out");
    setTimeout(() => {
      themePath.setAttribute("d", sunPath);
      themeIcon.classList.remove("fade-out");
      themeIcon.classList.add("sun-fade-in-spin");
      setTimeout(() => {
        themeIcon.classList.remove("sun-fade-in-spin");
        isAnimating = false;
      }, 600);
    }, 400);
  }
});

// Dropdown toggle
const dropdown = document.querySelector('.dropdown');
const arrow = document.getElementById('arrowIcon');
const toggle = document.getElementById('socialToggle');

toggle.addEventListener('click', () => {
  dropdown.classList.toggle('active');
  arrow.classList.toggle('rotate');
});

document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('active');
    arrow.classList.remove('rotate');
  }
});
