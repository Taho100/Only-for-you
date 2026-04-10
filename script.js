// ==================== FALLING ROSE PETALS ==================== //

const petalsContainer = document.getElementById('petalsContainer');

function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    // Random horizontal position
    const startX = Math.random() * window.innerWidth;
    petal.style.left = startX + 'px';
    
    // Random size variation (8-16px)
    const size = Math.random() * 8 + 8;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    
    // Random rotation
    const rotation = Math.random() * 360;
    petal.style.transform = `rotate(${rotation}deg)`;
    
    // Random animation duration (8-15 seconds)
    const duration = Math.random() * 7 + 8;
    petal.style.animationDuration = duration + 's';
    
    // Random horizontal sway
    const sway = Math.random() * 150 - 75;
    petal.style.setProperty('--sway', sway + 'px');
    
    // Random delay
    const delay = Math.random() * 5;
    petal.style.animationDelay = delay + 's';
    
    // Color variation (light rose shades)
    const colors = ['#C85A75', '#D47A91', '#B84760', '#E08FA3'];
    petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    petalsContainer.appendChild(petal);
    
    // Remove petal after animation ends
    setTimeout(() => {
        petal.remove();
    }, (duration + delay) * 1000);
}

// Create petals continuously
setInterval(createPetal, 1200);

// Create initial petals on page load
for (let i = 0; i < 15; i++) {
    setTimeout(createPetal, i * 200);
}

// ==================== LIQUID HEART ANIMATION (CANVAS) ==================== //

const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Heart shape drawing function
function drawHeart(x, y, size, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = `rgba(200, 90, 117, 0.3)`;
    ctx.strokeStyle = `rgba(139, 58, 98, 0.5)`;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    
    // Heart shape using bezier curves
    const sx = x - size / 2;
    const sy = y - size / 2.5;
    
    ctx.moveTo(sx, sy + size * 0.3);
    
    // Top left curve
    ctx.bezierCurveTo(
        sx, sy,
        sx - size * 0.2, sy - size * 0.2,
        sx - size * 0.3, sy + size * 0.1
    );
    
    // Bottom left curve
    ctx.bezierCurveTo(
        sx - size * 0.35, sy + size * 0.3,
        sx, sy + size * 0.8,
        sx + size * 0.5, sy + size
    );
    
    // Bottom right curve
    ctx.bezierCurveTo(
        sx + size, sy + size * 0.8,
        sx + size * 0.35, sy + size * 0.3,
        sx + size * 0.3, sy + size * 0.1
    );
    
    // Top right curve
    ctx.bezierCurveTo(
        sx + size * 0.2, sy - size * 0.2,
        sx, sy,
        sx, sy + size * 0.3
    );
    
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

// Water ripple effect
let ripples = [];

function createRipple(x, y) {
    ripples.push({
        x: x,
        y: y,
        radius: 0,
        maxRadius: 150,
        opacity: 0.6
    });
}

function drawRipple(ripple) {
    ctx.strokeStyle = `rgba(200, 90, 117, ${ripple.opacity})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    ctx.stroke();
}

// Animation loop
let time = 0;
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

function animate() {
    // Clear canvas with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(255, 245, 240, 0)');
    gradient.addColorStop(0.5, 'rgba(255, 224, 240, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 245, 240, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw heart with liquid effect
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2.2;
    const size = Math.min(canvas.width, canvas.height) * 0.4;
    
    // Pulsing effect
    const pulse = Math.sin(time * 0.01) * 0.1 + 1;
    
    // Wave distortion
    const wave1 = Math.sin(time * 0.008) * 0.08;
    const wave2 = Math.cos(time * 0.012) * 0.06;
    
    drawHeart(centerX + wave1 * 20, centerY + wave2 * 20, size * pulse, 0.5);
    
    // Draw multiple overlapping hearts for depth
    drawHeart(centerX, centerY, size * 0.95, 0.3);
    
    // Update and draw ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        ripple.radius += 3;
        ripple.opacity = 0.6 * (1 - ripple.radius / ripple.maxRadius);
        
        if (ripple.radius < ripple.maxRadius) {
            drawRipple(ripple);
        } else {
            ripples.splice(i, 1);
        }
    }
    
    // Create new ripples at intervals
    if (time % 60 === 0) {
        createRipple(centerX, centerY);
    }
    
    time++;
    requestAnimationFrame(animate);
}

animate();

// Create ripples on mouse movement (for desktop)
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// ==================== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ==================== //

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.memory-card').forEach(card => {
    observer.observe(card);
});

// ========== MUSIC PLAYER ==========
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const progressSlider = document.getElementById('progressSlider');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const lyricsText = document.getElementById('lyricsText');

// LYRICS SINCRONIZZATE CON LA MUSICA
const lyrics = [
    { time: 0, text: "I Love you puspo💖" },
    { time: 22, text: "চাই না মেয়ে তুমি অন্য কারো হও" },
    { time: 27, text: "পাবে না কেউ তোমাকে, তুমি কারো নও" },
    { time: 32, text: "চাই না মেয়ে তুমি অন্য কারো হও" },
    { time: 37, text: "পাবে না কেউ তোমাকে, তুমি কারো নও" },
    { time: 41, text: "তুমি তো আমার-ই, জানো না হো-ও-ওও" },
    { time: 46, text: " এ হৃদয় তোমার-ই ও-হো-ওও" },
    { time: 50, text: "তোমাকে ছাড়া আমি, বুঝি না কোনো কিছু যে আর" },
    { time: 56, text: "পৃথিবী জেনে যাক, তুমি শুধু আমার" },
    { time: 61, text: "তোমাকে ছাড়া আমি, বুঝি না কোনো কিছু যে আর" },
    { time: 66, text: "পৃথিবী জেনে যাক, তুমি শুধু আমার" },
    { time: 71, text: "তুমি শুধু আমার❤️" }
];

// PLAY BUTTON
playBtn.addEventListener('click', () => {
    audioPlayer.play();
    console.log('▶️ Playing...');
});

// PAUSE BUTTON
pauseBtn.addEventListener('click', () => {
    audioPlayer.pause();
    console.log('⏸️ Paused');
});

// STOP BUTTON
stopBtn.addEventListener('click', () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    progressSlider.value = 0;
    currentTimeDisplay.textContent = '0:00';
    lyricsText.textContent = 'Ascolta la nostra canzone...';
    audioPlayer.play();
    console.log('⏹️ Stopped');
});

// UPDATE PROGRESS BAR
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressSlider.value = percent;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        updateLyrics(audioPlayer.currentTime);
    }
});

// LOAD TOTAL TIME
audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    console.log('✓ Audio loaded');
});

// SEEK WITH SLIDER
progressSlider.addEventListener('input', (e) => {
    if (audioPlayer.duration) {
        audioPlayer.currentTime = (e.target.value / 100) * audioPlayer.duration;
    }
});

// FORMAT TIME
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// UPDATE LYRICS
function updateLyrics(currentTime) {
    const currentLyric = lyrics.find((lyric, index) => {
        const nextLyric = lyrics[index + 1];
        return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
    });

    if (currentLyric) {
        lyricsText.classList.remove('highlight');
        lyricsText.textContent = currentLyric.text;
        
        if (currentLyric.text.includes('❤️') || currentLyric.text.includes('🌹')) {
            lyricsText.classList.add('highlight');
        }
    }
}

// HANDLE END
audioPlayer.addEventListener('ended', () => {
    lyricsText.textContent = '❤️💖💖💖❤️';
    lyricsText.classList.remove('highlight');
    console.log('✓ Song ended');
});

// ERROR HANDLING
audioPlayer.addEventListener('error', (e) => {
    console.error('❌ Errore audio:', e);
    lyricsText.textContent = '❌ Errore nel caricamento della canzone';
});
// ==================== SMOOTH SCROLL FOR MOBILE ==================== //

if ('ontouchstart' in window) {
    document.addEventListener('touchmove', (e) => {
        // Smooth touch scrolling (native to most mobile browsers)
    }, { passive: true });
}

// ==================== ADJUST FOR MOBILE ==================== //

function adjustForMobile() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduce petal creation frequency on mobile for better performance
        petalsContainer.innerHTML = '';
        
        setInterval(createPetal, 500);
        
        // Adjust heart size for mobile
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.padding = '20px';
        }
    }
}

adjustForMobile();
window.addEventListener('resize', adjustForMobile);

// ==================== PERFORMANCE OPTIMIZATION ==================== //

// Request animation frame for smooth 60fps animations
let lastTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

function throttleAnimation(callback) {
    return function(currentTime) {
        if (currentTime - lastTime >= frameInterval) {
            callback(currentTime);
            lastTime = currentTime;
        }
        requestAnimationFrame(throttleAnimation.bind(null, callback));
    };
}

// ==================== BENGALI TEXT RENDERING ==================== //

// Ensure proper Bengali script rendering
document.addEventListener('DOMContentLoaded', () => {
    const bengaliText = document.querySelector('.bengali-text');
    if (bengaliText) {
        bengaliText.style.fontFamily = "'Noto Sans Bengali', 'Bengali', 'Georgia', serif";
        bengaliText.style.unicodeBidi = 'bidi-override';
    }
});

// ==================== PAGE READY EVENT ==================== //

window.addEventListener('load', () => {
    console.log('🌹 Romantic Website Loaded Successfully 🌹');
    console.log('Made with ❤️ for someone special');
});
