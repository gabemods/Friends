// Scroll indicators
const container = document.querySelector('.scroll-container');
const dots = document.querySelectorAll('.dot');

function updateDots() {
  const index = Math.round(container.scrollLeft / container.offsetWidth);
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[index]) dots[index].classList.add('active');
}

container.addEventListener('scroll', updateDots);

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

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themePath = themeIcon.querySelector("path");

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

// Dropdown
const dropdown = document.querySelector('.dropdown');
const arrow = document.getElementById('arrowIcon');
const toggle = document.getElementById('socialToggle');

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


// Ice Game
const game = document.getElementById("iceGame");
const canvas = document.getElementById("iceCanvas");
const ctx = canvas.getContext("2d");
const cursor = document.getElementById("iceCubeCursor");

const iceTexture = new Image();
iceTexture.src = "../assets/images/ice-texture.PNG"; // MAKE SURE filename and path are EXACT

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let drawing = false;

function getPosition(e) {
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }
  return {
    x: e.clientX,
    y: e.clientY
  };
}

function updateCursor(pos) {
  cursor.style.left = pos.x + "px";
  cursor.style.top = pos.y + "px";
}

function drawTexture(x, y) {
  const size = 80;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(iceTexture, x - size / 2, y - size / 2, size, size);
  ctx.restore();
}

function draw(e) {
  const {
    x,
    y
  } = getPosition(e);
  updateCursor({
    x,
    y
  });
  drawTexture(x, y);
}

canvas.addEventListener("pointerdown", e => {
  drawing = true;
  cursor.style.display = "block";
  draw(e);
});

canvas.addEventListener("pointermove", e => {
  if (drawing) draw(e);
});

document.addEventListener("pointerup", () => {
  drawing = false;
  cursor.style.display = "none";
});

canvas.addEventListener("touchstart", e => {
  drawing = true;
  cursor.style.display = "block";
  draw(e);
  e.preventDefault();
}, {
  passive: false
});

canvas.addEventListener("touchmove", e => {
  if (drawing) draw(e);
  e.preventDefault();
}, {
  passive: false
});

canvas.addEventListener("touchend", () => {
  drawing = false;
  cursor.style.display = "none";
});

document.getElementById("iceCubeLogo").addEventListener("click", () => {
  game.style.display = "block";
  requestAnimationFrame(() => game.classList.add("active"));
});

document.getElementById("resetGame").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("closeGame").addEventListener("click", () => {
  game.classList.remove("active");
  setTimeout(() => {
    game.style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 300);
});


// Popup
window.addEventListener("load", () => {
  const overlay = document.getElementById("popupOverlay");
  const popup = document.getElementById("popup");
  const button = document.getElementById("popupOkButton");

  // Show popup
  overlay.style.display = "flex";
  requestAnimationFrame(() => popup.classList.add("show"));

  // Hide popup on button press
  button.addEventListener("click", () => {
    popup.classList.remove("show");
    setTimeout(() => {
      overlay.style.display = "none";
    }, 300);
  });
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
