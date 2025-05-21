// Ensure DOM content is fully loaded before running scripts that interact with elements
window.addEventListener('DOMContentLoaded', () => {

  // --- Scroll indicators & Height Fix ---
  const container = document.querySelector('.scroll-container');
  const dots = document.querySelectorAll('.dot');
  const cardImages = document.querySelectorAll('.card img, .photo-grid img');

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
    // Initial calls
    fixHeight();
    updateDots();
  }
  window.addEventListener('resize', fixHeight);
  window.addEventListener('orientationchange', fixHeight);


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


  // --- Theme Toggle Functionality (Consolidated & Duplicated removed) ---
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

  // --- Console Log for Hidden Page ---
  console.log("Congratualtions! You have found the hiddden page!"); // No need for DOMContentLoaded, but placing here for consolidation

  // --- Navigation Buttons Animation (from previous context, adding back here if needed) ---
  const navButtons = [document.getElementById('profilesBtn'), document.getElementById('photosBtn')];
  navButtons.forEach(btn => {
    if (btn) {
      btn.classList.add('nav-button-animate');
      setTimeout(() => {
        btn.classList.remove('nav-button-animate');
      }, 800); // Match the animation duration
    }
  });


  // --- Popup Button Logic (assuming HTML elements exist with these IDs) ---
  // This was from a previous script block, adding it into DOMContentLoaded.
  const overlayPopup = document.getElementById("popupOverlay"); // Renamed to avoid clash with lightbox overlay
  const popup = document.getElementById("popup");
  const button = document.getElementById("popupOkButton");

  if (overlayPopup && popup && button) {
    // Show popup
    overlayPopup.style.display = "flex";
    requestAnimationFrame(() => popup.classList.add("show"));

    // Hide popup on button press
    button.addEventListener("click", () => {
      popup.classList.remove("show");
      setTimeout(() => {
        overlayPopup.style.display = "none";
      }, 300);
    });
  }

}); // End DOMContentLoaded


// --- Scripts that can run safely after full page load (images, external resources) ---
window.addEventListener('load', () => {

  // --- Scroll to Default Card on Load (from previous context) ---
  const scroller = document.getElementById('cardScroller');
  const defaultPage = document.getElementById('main-profile');

  if (scroller && defaultPage) {
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


// --- Image Lightbox/Zoom Functionality (needs global variables, placed outside DOMContentLoaded) ---
// This part creates elements and attaches listeners.
const images = document.querySelectorAll('img'); // Note: This gets ALL <img> elements on the page
const overlay = document.createElement('div'); // This is the main lightbox overlay
const popupImg = document.createElement('img'); // This is the image shown in the lightbox

overlay.style.cssText = `
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.8);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: background 0.3s ease;
`;

popupImg.style.cssText = `
  position: fixed;
  will-change: transform, border-radius;
  max-width: 90vw;
  max-height: 90vh;
  touch-action: none;
  pointer-events: none;
`;

overlay.appendChild(popupImg);
document.body.appendChild(overlay);

let originImg = null;
let startX = 0,
  startY = 0;
let isDragging = false;
let dragScale = 1;
let originalRadius = '12px'; // Default value, will be updated from clicked img

function getTransforms(fromRect, imgElement) {
  // Use a temporary image to calculate natural dimensions without displaying
  const temp = new Image(); // Use new Image() for better preloading/natural dimensions
  temp.src = imgElement.src;

  // Wait for temp image to load to get accurate natural dimensions
  return new Promise(resolve => {
    temp.onload = () => {
      const naturalW = temp.naturalWidth;
      const naturalH = temp.naturalHeight;
      const aspectRatio = naturalW / naturalH;

      const viewportW = window.innerWidth * 0.9;
      const viewportH = window.innerHeight * 0.9;
      let finalW, finalH;

      if (viewportW / viewportH > aspectRatio) {
        finalH = viewportH;
        finalW = finalH * aspectRatio;
      } else {
        finalW = viewportW;
        finalH = finalW / aspectRatio;
      }

      const scaleX = fromRect.width / finalW;
      const scaleY = fromRect.height / finalH;
      const translateX = fromRect.left + fromRect.width / 2 - window.innerWidth / 2;
      const translateY = fromRect.top + fromRect.height / 2 - window.innerHeight / 2;

      resolve({ scaleX, scaleY, translateX, translateY, finalW, finalH });
    };
    // Handle error in case image fails to load for temp
    temp.onerror = () => {
        console.error("Failed to load temporary image for transform calculation.");
        // Provide fallback values if image fails to load
        resolve({ scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, finalW: 0, finalH: 0 });
    };
  });
}

images.forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', async () => { // Make async to await getTransforms
    originImg = img;
    popupImg.src = img.src;

    originalRadius = getComputedStyle(img).borderRadius || '12px';
    popupImg.style.borderRadius = originalRadius; // Apply original radius initially

    // Set src and wait for onload (this can be the popupImg's onload)
    // Using async/await with getTransforms for more reliable dimension calculation
    const rect = img.getBoundingClientRect();
    overlay.style.display = 'flex';

    // Ensure DOM renders before calculating initial transform
    requestAnimationFrame(async () => {
      const { scaleX, scaleY, translateX, translateY, finalW, finalH } = await getTransforms(rect, img);

      popupImg.style.width = `${finalW}px`; // Set final dimensions based on calculation
      popupImg.style.height = `${finalH}px`;
      popupImg.style.transition = 'none';
      popupImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
      popupImg.style.borderRadius = originalRadius; // Ensure original radius is applied for start

      requestAnimationFrame(() => {
        popupImg.style.transition = 'transform 0.4s ease, border-radius 0.4s ease';
        popupImg.style.transform = `translate(0, 0) scale(1)`;
        popupImg.style.borderRadius = '12px'; // Final rounded corner for popup
        popupImg.style.pointerEvents = 'auto';
      });
    });
  });
});


async function closePopup() { // Make async to await getTransforms
  if (!originImg) return;
  const rect = originImg.getBoundingClientRect();
  const { scaleX, scaleY, translateX, translateY, finalW, finalH } = await getTransforms(rect, originImg);

  popupImg.style.transition = 'transform 0.25s ease, border-radius 0.25s ease';
  popupImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
  popupImg.style.borderRadius = originalRadius; // Revert to original radius
  overlay.style.transition = 'background-color 0.25s ease'; // Corrected from 'background'
  overlay.style.backgroundColor = 'rgba(0,0,0,0)';

  popupImg.addEventListener('transitionend', function handler() {
    overlay.style.display = 'none';
    popupImg.style.transform = '';
    popupImg.style.transition = '';
    overlay.style.transition = '';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    popupImg.style.pointerEvents = 'none';
    popupImg.removeEventListener('transitionend', handler); // Clean up listener
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
});

popupImg.addEventListener('pointermove', e => {
  if (!isDragging) return;
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;

  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  dragScale = 1 - Math.min(0.4, distance / window.innerHeight);
  popupImg.style.transition = 'none';
  popupImg.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${dragScale})`;
  overlay.style.backgroundColor = `rgba(0,0,0,${0.8 * dragScale})`;

  // Round progressively
  if (originalRadius !== '50%') { // Check if original was not a circle
    const radius = 12 + (1 - dragScale) * 100; // Adjust '100' for desired effect
    popupImg.style.borderRadius = `${radius}px`;
  }
});

popupImg.addEventListener('pointerup', e => {
  if (!isDragging) return;
  isDragging = false;
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance > 100) {
    closePopup();
  } else {
    popupImg.style.transition = 'transform 0.25s ease, border-radius 0.25s ease';
    popupImg.style.transform = `translate(0,0) scale(1)`;
    popupImg.style.borderRadius = '12px';
    overlay.style.transition = 'background-color 0.25s ease'; // Corrected from 'background'
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    popupImg.addEventListener('transitionend', function handler() {
      popupImg.style.transition = ''; // Remove transition after animation
      popupImg.removeEventListener('transitionend', handler); // Clean up listener
    }, { once: true });
  }
});


// --- Horizontal Scroll with Mouse Wheel ---
// This needs to be outside DOMContentLoaded/load as it attaches to scroller,
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
