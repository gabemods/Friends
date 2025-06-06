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



document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("passcodeOverlay");
  const dots = Array.from(document.querySelectorAll(".passcode-dot"));
  const buttons = overlay.querySelectorAll("button:not(.empty)");
  const passcodeInfo = document.getElementById("passcodeInfo");
  const dotsContainer = document.getElementById("passcodeDots");
  const numpad = document.querySelector(".numpad");
  const box = document.querySelector(".passcode-box");
  
  const correctPasscode = "7512";
  const thresholds = [5, 8, 9, 10, 11, 12, 13];
  const durations = [30, 30, 120, 300, 300, 600, 1800];
  
  let currentInput = "";
  
  const lockoutDisplay = document.createElement("div");
  lockoutDisplay.className = "lockout-display";
  overlay.appendChild(lockoutDisplay);
  
  function getAttempts() {
    return parseInt(localStorage.getItem("attempts") || "0");
  }
  
  function setAttempts(val) {
    localStorage.setItem("attempts", val);
  }
  
  function getLockUntil() {
    return parseInt(localStorage.getItem("lockUntil") || "0");
  }
  
  function setLockUntil(timestamp) {
    localStorage.setItem("lockUntil", timestamp);
  }
  
  function resetLockout() {
    localStorage.removeItem("attempts");
    localStorage.removeItem("lockUntil");
  }
  
  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle("filled", i < currentInput.length);
    });
    
    if (currentInput.length > 0) {
      passcodeInfo.classList.add("hidden");
      dotsContainer.classList.add("visible");
    } else {
      passcodeInfo.classList.remove("hidden");
      dotsContainer.classList.remove("visible");
    }
  }
  
  function clearInput() {
    currentInput = "";
    updateDots();
  }
  
  function shakeAndClear() {
    box.classList.add("shake");
    setTimeout(() => {
      box.classList.remove("shake");
      clearInput();
    }, 400);
  }
  
  function unlockSuccess() {
  resetLockout();
  overlay.classList.add("fade-out");

  setTimeout(() => {
    overlay.style.display = "none";
  }, 300);
}

  
  function startLockout(seconds) {
    clearInput();
    box.style.display = "none";
    dotsContainer.style.display = "none";
    numpad.style.display = "none";
    
    let remaining = seconds;
    const unlockTime = Date.now() + seconds * 1000;
    setLockUntil(unlockTime);
    
    function formatTime(secs) {
      if (secs > 59) {
        const minutes = Math.floor(secs / 60);
        return `${minutes} minute${minutes > 1 ? "s" : ""}`;
      } else {
        return `${secs} second${secs !== 1 ? "s" : ""}`;
      }
    }
    
    function updateLockoutUI(timeLeft) {
      lockoutDisplay.innerHTML = `
        <p style="text-align:center;font-size:1.1em;font-weight:500;margin-bottom:0.5em;">Too many incorrect unlock attempts</p>
        <p style="text-align:center;font-size:1em;">Try again in <span id="lockoutTimer">${formatTime(timeLeft)}</span></p>
      `;
      lockoutDisplay.style.display = "block";
    }
    
    updateLockoutUI(remaining);
    
    const interval = setInterval(() => {
      remaining--;
      const timerSpan = document.getElementById("lockoutTimer");
      if (remaining > 59) {
        timerSpan.textContent = formatTime(remaining);
      } else {
        timerSpan.textContent = `${remaining} second${remaining !== 1 ? "s" : ""}`;
      }
      
      if (remaining <= 0) {
        clearInterval(interval);
        lockoutDisplay.style.display = "none";
        dotsContainer.style.display = "";
        numpad.style.display = "";
        box.style.display = "";
      }
    }, 1000);
  }
  
  function checkLockout() {
    const lockUntil = getLockUntil();
    const now = Date.now();
    if (now < lockUntil) {
      const remaining = Math.ceil((lockUntil - now) / 1000);
      startLockout(remaining);
      return true;
    }
    return false;
  }
  
  function handleIncorrectCode() {
    const attempts = getAttempts() + 1;
    setAttempts(attempts);
    shakeAndClear();
    
    for (let i = 0; i < thresholds.length; i++) {
      if (attempts === thresholds[i]) {
        startLockout(durations[i]);
        return;
      }
    }
  }
  
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      if (navigator.vibrate) navigator.vibrate(50);
      
      if (checkLockout()) return;
      
      if (button.classList.contains("backspace")) {
        currentInput = currentInput.slice(0, -1);
        updateDots();
      } else if (button.classList.contains("ok")) {
        if (currentInput === correctPasscode) {
          unlockSuccess();
        } else {
          handleIncorrectCode();
        }
      } else {
        const value = button.dataset.value;
        if (currentInput.length < 4) {
          currentInput += value;
          updateDots();
          
          if (currentInput.length === 4) {
            if (currentInput === correctPasscode) {
              unlockSuccess();
            } else {
              handleIncorrectCode();
            }
          }
        }
      }
    });
  });
  
  // Initial lockout check
  if (!checkLockout()) {
    overlay.style.display = "flex";
  }
});
