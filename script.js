// Read name from URL parameters
const urlParams = new URLSearchParams(window.location.search);
let personName = urlParams.get('v'); // New encoded parameter
let isEncoded = true;

// Fallback to old 'name' parameter if 'v' is not present
if (!personName) {
    personName = urlParams.get('name');
    isEncoded = false;
}

// If no name provided, redirect to generator
if (!personName || personName.trim() === '') {
    window.location.href = 'index.html';
} else {
    // Decode name
    let decodedName;
    try {
        if (isEncoded) {
            // Decode Base64 (supporting UTF-8 characters)
            decodedName = decodeURIComponent(escape(atob(personName)));
        } else {
            decodedName = decodeURIComponent(personName);
        }

        // Update the name in the page
        document.getElementById('personName').textContent = decodedName;
    } catch (e) {
        console.error('Error decoding name:', e);
        window.location.href = 'index.html';
    }
}

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const buttonsContainer = document.querySelector('.buttons');

// Handle YES button click
yesBtn.addEventListener('click', () => {
    // Create celebration screen
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.innerHTML = `
        <div class="celebration-content">
            <h2>¡Yay! 🎉💕</h2>
            <p>¡Sabía que dirías que sí! 😊</p>
            <p style="font-size: 3rem; margin-top: 20px;">❤️💖💕💗💓</p>
        </div>
    `;
    document.body.appendChild(celebration);

    // Add confetti effect
    createConfetti();
});

// Handle NO button hover - move it away!
noBtn.addEventListener('mouseenter', () => {
    moveButton();
});

// Also handle touch events for mobile
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveButton();
});

function moveButton() {
    // Move button to body if it's not already there (fixes backdrop-filter positioning issue)
    if (noBtn.parentElement !== document.body) {
        document.body.appendChild(noBtn);
    }

    const button = noBtn.getBoundingClientRect();
    const yesBtnRect = yesBtn.getBoundingClientRect();

    // Define safe margins from screen edges
    const margin = 20;
    const buttonWidth = 160; // Approximate button width
    const buttonHeight = 60; // Approximate button height

    // Calculate safe boundaries
    const minX = margin;
    const maxX = window.innerWidth - buttonWidth - margin;
    const minY = margin;
    const maxY = window.innerHeight - buttonHeight - margin;

    const minDistance = 180; // Minimum distance from YES button
    let newX, newY;
    let attempts = 0;
    const maxAttempts = 20;

    // Try to find a valid position
    do {
        // Generate random position within safe boundaries
        newX = minX + Math.random() * (maxX - minX);
        newY = minY + Math.random() * (maxY - minY);

        // Calculate distance from YES button center
        const yesCenterX = yesBtnRect.left + yesBtnRect.width / 2;
        const yesCenterY = yesBtnRect.top + yesBtnRect.height / 2;
        const noCenterX = newX + buttonWidth / 2;
        const noCenterY = newY + buttonHeight / 2;

        const distance = Math.sqrt(
            Math.pow(noCenterX - yesCenterX, 2) +
            Math.pow(noCenterY - yesCenterY, 2)
        );

        // If position is valid (far enough from YES button), use it
        if (distance >= minDistance) {
            break;
        }

        attempts++;
    } while (attempts < maxAttempts);

    // Ensure values are within bounds (safety check)
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    // Apply new position
    noBtn.style.position = 'fixed';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    noBtn.style.zIndex = '1000'; // Ensure it's on top
}

// Confetti effect
function createConfetti() {
    const colors = ['#ff6b9d', '#c9356c', '#ff1493', '#ff69b4', '#ff85a2'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';

            document.body.appendChild(confetti);

            // Animate confetti falling
            const duration = 2000 + Math.random() * 2000;
            const xMovement = (Math.random() - 0.5) * 200;

            confetti.animate([
                {
                    transform: 'translateY(0) translateX(0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translateY(${window.innerHeight + 20}px) translateX(${xMovement}px) rotate(${Math.random() * 360}deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, duration);
        }, i * 20);
    }
}
