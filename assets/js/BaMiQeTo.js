// Ensure DOM content is fully loaded before running scripts that interact with elements
window.addEventListener('DOMContentLoaded', () => {

  // --- Navigation Buttons Animation ---
  const navButtons = [document.getElementById('profilesBtn'), document.getElementById('photosBtn')];
  navButtons.forEach(btn => {
    if (btn) {
      btn.classList.add('nav-button-animate');
      setTimeout(() => {
        btn.classList.remove('nav-button-animate');
      }, 800); // Match the animation duration
    }
  });

  // --- Scroll Indicators & Height Fix ---
  const container = document.querySelector('.scroll-container');
  const dots = document.querySelectorAll('.dot');
  const cardImages = document.querySelectorAll('.card img, .photo-grid img'); // Added this selector for image active state

  function updateDots() {
    if (container && dots.length) {
      const index = Math.round(container.scrollLeft / container.offsetWidth);
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');
    }
  }

  function fixHeight() {
    const scrollContainer = document.querySelector('.scroll-container');
    const pages = document.querySelectorAll('.page');

    if (scrollContainer) {
      scrollContainer.style.height = window.innerHeight + 'px';
    }
    pages.forEach(p => {
      p.style.height = window.innerHeight + 'px';
      p.style.display = 'flex';
      p.style.flexDirection = 'column';
      p.style.justifyContent = 'center';
    });
  }

  // Event Listeners for Scroll Indicators & Height Fix
  if (container) {
    container.addEventListener('scroll', updateDots);
  }
  window.addEventListener('resize', fixHeight);
  window.addEventListener('orientationchange', fixHeight);
  fixHeight(); // Initial call to set correct heights
  updateDots(); // Initial call to set correct dot state

  // Image Active State on mousedown/mouseup (for .card img, .photo-grid img)
  cardImages.forEach(img => {
    img.addEventListener('mousedown', function() {
      this.classList.add('active');
    });
    img.addEventListener('mouseup', function() {
      this.classList.remove('active');
    });
    img.addEventListener('mouseleave', function() {
      this.classList.remove('active');
    });
  });

  // --- Theme Toggle Functionality ---
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themePath = themeIcon ? themeIcon.querySelector("path") : null;

  const sunPath = "M12 3v2m0 14v2m9-9h-2M5 12H3" +
    "m15.364-6.364l-1.414 1.414" +
    "M6.05 17.95l-1.414 1.414" +
    "M17.95 17.95l1.414-1.414" +
    "M6.05 6.05L4.636 7.464" +
    "M12 8a4 4 0 100 8 4 4 0 000-8z";

  const moonPath = "M21 12.79A9 9 0 1111.21 3" +
    "a7 7 0 009.79 9.79z";

  let dark = false;
  let isAnimating = false;

  if (themeToggle && themeIcon && themePath) {
    themeToggle.addEventListener("click", () => {
      if (isAnimating) return;
      isAnimating = true;
      dark = !dark;

      document.body.classList.toggle("dark-mode", dark);
      themeIcon.classList.remove("sun-rotate-fade", "fade-out", "sun-fade-in-spin", "moon-fade-in-tilt");

      if (dark) {
        // Light → Dark
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
        // Dark → Light
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
  }

  // --- Social Dropdown Toggle ---
  const dropdown = document.querySelector('.dropdown');
  const arrow = document.getElementById('arrowIcon');
  const toggle = document.getElementById('socialToggle');

  if (dropdown && arrow && toggle) {
    toggle.addEventListener('click', () => {
      dropdown.classList.toggle('active');
      arrow.classList.toggle('rotate');
    });

    // Optional: Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !toggle.contains(e.target)) {
        dropdown.classList.remove('active');
        arrow.classList.remove('rotate');
      }
    });
  }

  // --- Card Spacer Shrink on Scroll ---
  document.querySelectorAll('.card').forEach(card => {
    const spacer = card.querySelector('.photo-spacer');
    if (!spacer) return;

    card.addEventListener('scroll', () => {
      if (card.scrollTop > 10) {
        spacer.classList.add('shrink');
      } else {
        spacer.classList.remove('shrink');
      }
    });
  });

}); // End DOMContentLoaded for initial scripts

// --- Scripts that can run safely after full page load (images, external resources) ---
window.addEventListener('load', () => {

  // --- Scroll to Default Card on Load ---
  const scroller = document.getElementById('cardScroller');
  const defaultPage = document.getElementById('main-profile');

  if (scroller && defaultPage) {
    // Get the horizontal position of your card relative to the container
    const leftOffset = defaultPage.offsetLeft;
    scroller.scrollLeft = leftOffset;
  }

  // --- Card Entrance Animations on Load ---
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('animate-in');
    }, i * 100); // optional stagger
  });
});


// --- Image Lightbox/Zoom Functionality ---
// This is placed outside DOMContentLoaded/load because it modifies the DOM (creates overlay/popupImg)
// immediately, and then attaches listeners to existing images when the DOM is ready.
const images = document.querySelectorAll('img'); // Note: This gets ALL <img> elements
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
let startX = 0,
  startY = 0;
let isDragging = false;
let originalRect = null;
const MIN_SIZE = 80;

function getTransforms(fromRect, targetW, targetH) {
  const scaleX = fromRect.width / targetW;
  const scaleY = fromRect.height / targetH;
  const translateX = fromRect.left + fromRect.width / 2 - window.innerWidth / 2;
  const translateY = fromRect.top + fromRect.height / 2 - window.innerHeight / 2;
  return {
    scaleX,
    scaleY,
    translateX,
    translateY
  };
}

images.forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    originImg = img;
    const rect = img.getBoundingClientRect();
    originalRect = rect;

    popupImg.src = img.src;

    // Fully reset styles
    popupImg.style.removeProperty('width');
    popupImg.style.removeProperty('height');
    popupImg.style.removeProperty('aspect-ratio');
    popupImg.style.transition = 'none';
    popupImg.style.transform = '';
    popupImg.style.borderRadius = '';
    popupImg.style.pointerEvents = 'none';
    popupImg.style.opacity = '1';

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

      const {
        scaleX,
        scaleY,
        translateX,
        translateY
      } = getTransforms(rect, finalW, finalH);

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
  const {
    scaleX,
    scaleY,
    translateX,
    translateY
  } = getTransforms(originalRect, finalW, finalH);

  popupImg.style.transition = 'transform 0.35s ease, border-radius 0.35s ease';
  popupImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;

  // Rounded square instead of full circle (you can change to '50%' for circle)
  popupImg.style.borderRadius = '27%';
  overlay.style.transition = 'background-color 0.35s ease';
  overlay.style.backgroundColor = 'rgba(0,0,0,0)';

  popupImg.addEventListener('transitionend', () => {
    // Fade out smoothly after the move
    popupImg.style.transition = 'opacity 0.15s ease';
    popupImg.style.opacity = '0';

    setTimeout(() => {
      overlay.style.display = 'none';

      // Reset everything fully
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
      popupImg.style.opacity = '1';

      overlay.style.transition = '';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    }, 150);
  }, {
    once: true
  });
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
  popupImg.style.borderRadius = '27%';
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
    }, {
      once: true
    });
  }
});


// --- Horizontal Scroll with Mouse Wheel ---
// This needs to be outside DOMContentLoaded/load because it attaches directly to `scroller`
// which is usually available very early.
const scrollerForWheel = document.getElementById('cardScroller');
if (scrollerForWheel) {
  scrollerForWheel.addEventListener('wheel', function(e) {
    e.preventDefault(); // Prevent vertical scrolling
    scrollerForWheel.scrollLeft += e.deltaY; // Scroll horizontally instead
  }, {
    passive: false
  });
}


// --- Card and Text Animations on Orientation Change ---
window.addEventListener("orientationchange", () => {
  const cards = document.querySelectorAll('.card');
  const texts = document.querySelectorAll('.card h1, .card h2, .card h3, .card p');

  // Reset and re-trigger card animations
  cards.forEach(card => {
    card.style.animation = 'none';
    card.offsetHeight; // Trigger reflow
    card.style.animation = 'cardBounceIn 0.6s ease forwards';
  });

  // Reset and re-trigger text animations
  texts.forEach((text, index) => {
    text.style.animation = 'none';
    text.offsetHeight; // Trigger reflow
    text.style.animation = `fadeBounceIn 0.6s ease forwards`;
    text.style.animationDelay = `${0.1 + index * 0.05}s`; // Slight stagger
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("passcodeOverlay");
  const dots = Array.from(document.querySelectorAll(".passcode-dot"));
  const buttons = overlay.querySelectorAll("button:not(.empty)");

  let currentInput = "";
  const correctPasscode = "7512";
  const PASSCODE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle("filled", i < currentInput.length);
    });
  }

  function clearInput() {
    currentInput = "";
    updateDots();
  }

  function shakeAndClear() {
    const box = document.querySelector(".passcode-box");
    box.classList.add("shake");
    setTimeout(() => {
      box.classList.remove("shake");
      clearInput();
    }, 400);
  }

  function unlockSuccess() {
    localStorage.setItem("passcodeUnlockTime", Date.now().toString());
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.style.display = "none";
    }, 400);
  }

  // Check if we should skip the passcode
  const lastUnlock = localStorage.getItem("passcodeUnlockTime");
  const now = Date.now();
  if (lastUnlock && now - parseInt(lastUnlock) < PASSCODE_TIMEOUT) {
    overlay.style.display = "none";
    return;
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const value = button.textContent;

      if (value === "⌫") {
        currentInput = currentInput.slice(0, -1);
        updateDots();
      } else if (button.classList.contains("ok")) {
        if (currentInput === correctPasscode) {
          unlockSuccess();
        } else {
          shakeAndClear();
        }
      } else if (currentInput.length < 4) {
        currentInput += value;
        updateDots();

        if (currentInput.length === 4) {
          if (currentInput === correctPasscode) {
            unlockSuccess();
          } else {
            shakeAndClear();
          }
        }
      }
    });
  });

  overlay.style.display = "flex";
});
