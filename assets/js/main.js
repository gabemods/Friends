// Navigation Buttons Animation
window.addEventListener('DOMContentLoaded', () => {
  const buttons = [document.getElementById('profilesBtn'), document.getElementById('photosBtn')];
  buttons.forEach(btn => {
    if (btn) {
      btn.classList.add('nav-button-animate');
      setTimeout(() => {
        btn.classList.remove('nav-button-animate');
      }, 800); // Match the animation duration
    }
  });
});

// Scroll Indicators for Horizontal Scroll
const container = document.querySelector('.scroll-container');
const dots = document.querySelectorAll('.dot');

function updateDots() {
  if (!container || !dots.length) return;
  const index = Math.round(container.scrollLeft / container.offsetWidth);
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[index]) dots[index].classList.add('active');
}

if (container) {
  container.addEventListener('scroll', updateDots);
}


// Fix Height for Full-Screen Pages
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

window.addEventListener('resize', fixHeight);
window.addEventListener('orientationchange', fixHeight);
fixHeight(); // Call initially to set correct heights

// Scroll to Default Card on Load
window.addEventListener('load', () => {
  const scroller = document.getElementById('cardScroller');
  const defaultPage = document.getElementById('main-profile');

  if (scroller && defaultPage) {
    // Get the horizontal position of your card relative to the container
    const leftOffset = defaultPage.offsetLeft;
    scroller.scrollLeft = leftOffset;
  }
});

// Horizontal Scroll with Mouse Wheel
const scroller = document.getElementById('cardScroller');

if (scroller) {
  scroller.addEventListener('wheel', function(e) {
    e.preventDefault();
    scroller.scrollLeft += e.deltaY;
  }, {
    passive: false
  });
}

// Image Lightbox/Zoom Functionality
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
let startX = 0,
  startY = 0;
let isDragging = false;
let originalRect = null;
const MIN_SIZE = 80; // Minimum size in pixels

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

    // Fully reset styles before each open
    popupImg.style.removeProperty('width');
    popupImg.style.removeProperty('height');
    popupImg.style.removeProperty('aspect-ratio');
    popupImg.style.transition = 'none';
    popupImg.style.transform = '';
    popupImg.style.borderRadius = '';
    popupImg.style.pointerEvents = 'none';

    popupImg.onload = () => {
      popupImg.offsetWidth; // Force reflow

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

      // Set initial size and show
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
  popupImg.style.borderRadius = '50%';
  overlay.style.transition = 'background-color 0.35s ease';
  overlay.style.backgroundColor = 'rgba(0,0,0,0)';

  popupImg.addEventListener('transitionend', () => {
    overlay.style.display = 'none';

    // Clean reset
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

  // Lock square dimensions for drag
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
    }, {
      once: true
    });
  }
});

// Theme Toggle Functionality
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


// Social Dropdown Toggle
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


// Popup/Modal Functionality
window.addEventListener("load", () => {
  const overlay = document.getElementById("popupOverlay");
  const popup = document.getElementById("popup");
  const button = document.getElementById("popupOkButton");
  const disagreeBtn = document.getElementById("popupDisagreeButton");

  if (overlay && popup && button) {
    // Show popup
    overlay.style.display = "flex";
    requestAnimationFrame(() => popup.classList.add("show"));

    // Hide popup on OK button press
    button.addEventListener("click", () => {
      popup.classList.remove("show");
      setTimeout(() => {
        overlay.style.display = "none";
      }, 300);
    });
  }

  // Handle "I Disagree" destructive button
  if (disagreeBtn) {
    disagreeBtn.addEventListener("click", () => {
      window.location.href = "https://raw.githubusercontent.com/gabemods/Friends/main/assets/images/IMG_0318.jpg"; // Replace with your URL
    });
  }
});


// Custom link behavior for "ice-link"
document.getElementById("ice-link").addEventListener("click", function(event) {
  event.preventDefault(); // Stop default behavior (like opening image in new tab)
  window.location.href = this.href; // Manually navigate to the link in the same tab
});


// Console Log Message
console.log("Welcome to my simple website project where you can find me and my friends' profiles and photos!");

// Toast Notifications
window.addEventListener('load', () => {
  const toast = document.getElementById('toast');
  const toast2 = document.getElementById('toast2');

  // Show the first toast after 1.5 seconds
  setTimeout(() => {
    if (toast) toast.classList.add('show');

    // Hide the first toast after 4 seconds
    setTimeout(() => {
      if (toast) toast.classList.remove('show');
    }, 3500); // 4 seconds for the first toast to disappear
  }, 1500); // 1.5 seconds delay for the first toast

  // Show the second toast after an additional 3 seconds (4.5 seconds from page load)
  setTimeout(() => {
    if (toast2) toast2.classList.add('show');

    // Hide the second toast after 4 seconds
    setTimeout(() => {
      if (toast2) toast2.classList.remove('show');
    }, 3500); // 4 seconds for the second toast to disappear
  }, 7500); // 7.5 seconds delay for the second toast (4 seconds after the first)
});

// General Notification (Top-Bar Style)
window.addEventListener('DOMContentLoaded', () => {
  const notification = document.querySelector('.notification');
  let hideTimeout;

  if (notification) {
    // Show the notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 500); // Delay for 0.5 seconds after page load

    // Automatically hide after 3 seconds
    hideTimeout = setTimeout(() => {
      notification.classList.add('hide');
    }, 3500);

    // Swipe up detection
    let startY = 0;
    notification.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    });

    notification.addEventListener('touchmove', (e) => {
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;

      if (deltaY > 30) { // User swiped up
        notification.classList.add('hide');
        clearTimeout(hideTimeout); // Prevent double hiding
      }
    });
  }
});


// Card Animations on Load
window.addEventListener('load', () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('animate-in');
    }, i * 100); // optional stagger
  });
});

// Card and Text Animations on Orientation Change
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

  // ✅ Skip passcode if already authenticated
  if (localStorage.getItem("authenticated") === "true") {
    overlay.style.display = "none";
    return;
  }

  const dots = Array.from(document.querySelectorAll(".passcode-dot"));
  const buttons = overlay.querySelectorAll("button:not(.empty)");

  let currentInput = "";
  const correctPasscode = "7512"; // Your passcode here

  function updateDots() {
    dots.forEach((dot, i) => {
      if (i < currentInput.length) {
        dot.classList.add("filled");
      } else {
        dot.classList.remove("filled");
      }
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

  function checkPasscode() {
    if (currentInput === correctPasscode) {
      localStorage.setItem("authenticated", "true"); // ✅ Save auth state
      overlay.classList.add("fade-out");
      setTimeout(() => {
        overlay.style.display = "none";
      }, 400); // Match animation duration
    } else {
      shakeAndClear();
    }
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const value = button.textContent;

      if (value === "⌫") {
        currentInput = currentInput.slice(0, -1);
        updateDots();
      } else if (button.classList.contains("ok")) {
        // ✅ Trigger check on OK button
        checkPasscode();
      } else if (currentInput.length < 4) {
        currentInput += value;
        updateDots();

        if (currentInput.length === 4) {
          checkPasscode();
        }
      }
    });
  });

  overlay.style.display = "flex";
});
