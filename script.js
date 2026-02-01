// DOM Elements
const setupPage = document.getElementById('setupPage');
const questionPage = document.getElementById('questionPage');
const letterPage = document.getElementById('letterPage');

const fromNameInput = document.getElementById('fromName');
const toNameInput = document.getElementById('toName');
const createBtn = document.getElementById('createBtn');
const linkContainer = document.getElementById('linkContainer');
const generatedLinkInput = document.getElementById('generatedLink');
const copyBtn = document.getElementById('copyBtn');
const successMessage = document.querySelector('.success-message');

const crushNameEl = document.getElementById('crushName');
const fromPersonEl = document.getElementById('fromPerson');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');

const letterNameEl = document.getElementById('letterName');
const senderNameEl = document.getElementById('senderName');

const bgMusic = document.getElementById('bgMusic');

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    checkURLParams();
    
    // Try to play music (may be blocked by browser)
    document.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(e => console.log('Audio autoplay prevented'));
        }
    }, { once: true });
});

// Check URL parameters for custom link
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    
    if (from && to) {
        // Show question page with custom names
        showQuestionPage(from, to);
    }
}

// Create custom link
createBtn.addEventListener('click', () => {
    const fromName = fromNameInput.value.trim();
    const toName = toNameInput.value.trim();
    
    if (!fromName || !toName) {
        alert('Please enter both names! 💕');
        return;
    }
    
    // Generate custom URL
    const baseURL = window.location.origin + window.location.pathname;
    const customURL = `${baseURL}?from=${encodeURIComponent(fromName)}&to=${encodeURIComponent(toName)}`;
    
    // Display the link
    generatedLinkInput.value = customURL;
    linkContainer.classList.remove('hidden');
    
    // Scroll to link
    linkContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Copy link to clipboard
copyBtn.addEventListener('click', () => {
    generatedLinkInput.select();
    document.execCommand('copy');
    
    successMessage.classList.add('show');
    copyBtn.textContent = '✓ Copied!';
    
    setTimeout(() => {
        copyBtn.textContent = 'Copy';
        successMessage.classList.remove('show');
    }, 3000);
});

// Show question page
function showQuestionPage(from, to) {
    setupPage.classList.remove('active');
    questionPage.classList.add('active');
    
    crushNameEl.textContent = to;
    fromPersonEl.textContent = `From: ${from} 💖`;
    
    // Store names for later
    sessionStorage.setItem('fromName', from);
    sessionStorage.setItem('toName', to);
}

// Yes button - go to love letter
yesBtn.addEventListener('click', () => {
    const fromName = sessionStorage.getItem('fromName');
    const toName = sessionStorage.getItem('toName');
    
    questionPage.classList.remove('active');
    letterPage.classList.add('active');
    
    letterNameEl.textContent = toName;
    senderNameEl.textContent = fromName;
    
    // Create more floating hearts
    createFloatingHearts();
});

// No button - runs away from cursor
let noButtonTimeout;
let isMobile = window.matchMedia("(max-width: 768px)").matches;

noBtn.addEventListener('mouseenter', () => {
    if (!isMobile) {
        moveNoButton();
    }
});

noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
});

// For mobile - also move when trying to click
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
    
    // Make yes button bigger and more enticing
    yesBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        yesBtn.style.transform = 'scale(1)';
    }, 300);
});

function moveNoButton() {
    const container = document.querySelector('.button-container');
    const containerRect = container.getBoundingClientRect();
    
    // Make button absolute positioned when moving
    noBtn.style.position = 'absolute';
    
    // Get random position within container
    const maxX = containerRect.width - noBtn.offsetWidth - 20;
    const maxY = containerRect.height - noBtn.offsetHeight - 20;
    
    const randomX = Math.max(10, Math.random() * maxX);
    const randomY = Math.max(10, Math.random() * maxY);
    
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    // Shrink the No button each time
    const currentScale = parseFloat(noBtn.style.transform.replace('scale(', '').replace(')', '') || '1');
    const newScale = Math.max(0.5, currentScale - 0.1);
    noBtn.style.transform = `scale(${newScale})`;
    
    // Make Yes button bigger
    const yesScale = parseFloat(yesBtn.style.transform.replace('scale(', '').replace(')', '') || '1');
    const newYesScale = Math.min(1.5, yesScale + 0.1);
    yesBtn.style.transform = `scale(${newYesScale})`;
}

// Update isMobile on resize
window.addEventListener('resize', () => {
    isMobile = window.matchMedia("(max-width: 768px)").matches;
});

// Create additional floating hearts on love letter page
function createFloatingHearts() {
    const letterContainer = document.querySelector('.letter-container');
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.textContent = ['💕', '💖', '💗', '💓', '💝', '❤️'][Math.floor(Math.random() * 6)];
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.bottom = '-50px';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.opacity = '0';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.animation = 'floatUp 4s ease-in forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 4000);
    }, 500);
}

// Add some extra floating hearts to background
function createBackgroundHearts() {
    const hearts = ['💖', '💕', '💗', '💓', '💝', '❤️'];
    const backgrounds = document.querySelectorAll('.hearts-background');
    
    backgrounds.forEach(bg => {
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'absolute';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
            heart.style.opacity = '0.3';
            heart.style.animation = `float ${10 + Math.random() * 10}s infinite`;
            heart.style.animationDelay = Math.random() * 5 + 's';
            bg.appendChild(heart);
        }
    });
}

createBackgroundHearts();

// Add particle effect on button clicks
function createParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.textContent = '💖';
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.fontSize = '20px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        particle.style.transition = 'all 1s ease-out';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            const angle = (Math.PI * 2 * i) / 10;
            const distance = 100;
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

yesBtn.addEventListener('click', (e) => {
    createParticles(e.clientX, e.clientY);
});