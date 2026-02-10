// ============================================
// SHARED UTILITIES & DECORATIONS
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sparkles on both pages
    createSparkles();
    
    // Setup modal functionality
    setupModal();
});

// Create sparkle background effect
function createSparkles() {
    const sparkleBg = document.getElementById('sparkle-bg');
    if (!sparkleBg) return;
    
    const sparkleCount = 50;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 4 + 1;
        
        // Random animation delay
        const delay = Math.random() * 5;
        
        sparkle.style.left = `${left}%`;
        sparkle.style.top = `${top}%`;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.animationDelay = `${delay}s`;
        
        sparkleBg.appendChild(sparkle);
    }
}

// Create elegant decorations for invitation page
function createElegantDecorations() {
    createElegantBalloons();
    createSubtleConfetti();
    createElegantSparkles();
    createFloatingNumbers();
    createCrystals();
}

// Create elegant silver/white balloons
function createElegantBalloons() {
    const container = document.getElementById('decorations-container') || document.body;
    const balloonCount = 12;
    
    for (let i = 0; i < balloonCount; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('elegant-balloon');
        
        // Random balloon type
        const balloonTypes = ['balloon-silver', 'balloon-white', 'balloon-light'];
        const balloonType = balloonTypes[Math.floor(Math.random() * balloonTypes.length)];
        balloon.classList.add(balloonType);
        
        // Random position
        const left = Math.random() * 85 + 5;
        const top = Math.random() * 80 + 10;
        
        // Random size
        const size = Math.random() * 20 + 35;
        
        // Random animation
        const duration = Math.random() * 10 + 20;
        const delay = Math.random() * 15;
        
        balloon.style.left = `${left}%`;
        balloon.style.top = `${top}%`;
        balloon.style.width = `${size}px`;
        balloon.style.height = `${size * 1.25}px`;
        balloon.style.animationDuration = `${duration}s`;
        balloon.style.animationDelay = `${delay}s`;
        
        container.appendChild(balloon);
    }
}

// Create subtle confetti
function createSubtleConfetti() {
    const container = document.getElementById('decorations-container') || document.body;
    const confettiCount = 30;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('subtle-confetti');
        
        // Random position
        const left = Math.random() * 100;
        
        // Silver colors only
        const colors = ['#C0C0C0', '#E8E8E8', '#FFFFFF', '#D0D0D0'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random size
        const size = Math.random() * 4 + 2;
        
        // Random animation
        const duration = Math.random() * 5 + 6;
        const delay = Math.random() * 8;
        
        confetti.style.left = `${left}vw`;
        confetti.style.backgroundColor = color;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.animationDuration = `${duration}s`;
        confetti.style.animationDelay = `${delay}s`;
        
        container.appendChild(confetti);
    }
}

// Create elegant sparkles
function createElegantSparkles() {
    const container = document.getElementById('decorations-container') || document.body;
    const sparkleCount = 25;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('elegant-sparkle');
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 5 + 2;
        
        // Random animation delay
        const delay = Math.random() * 4;
        
        sparkle.style.left = `${left}vw`;
        sparkle.style.top = `${top}vh`;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.animationDelay = `${delay}s`;
        
        container.appendChild(sparkle);
    }
}

// Create floating number 21 decorations
function createFloatingNumbers() {
    const container = document.getElementById('decorations-container') || document.body;
    const numberCount = 8;
    
    for (let i = 0; i < numberCount; i++) {
        const number = document.createElement('div');
        number.classList.add('floating-number');
        number.textContent = '21';
        
        // Random position
        const left = Math.random() * 90 + 5;
        const top = Math.random() * 90 + 5;
        
        // Random animation duration
        const duration = Math.random() * 15 + 15;
        const delay = Math.random() * 10;
        
        number.style.left = `${left}%`;
        number.style.top = `${top}%`;
        number.style.animationDuration = `${duration}s`;
        number.style.animationDelay = `${delay}s`;
        
        container.appendChild(number);
    }
}

// Create crystal decorations
function createCrystals() {
    const container = document.getElementById('decorations-container') || document.body;
    const crystalCount = 15;
    
    for (let i = 0; i < crystalCount; i++) {
        const crystal = document.createElement('div');
        crystal.classList.add('crystal');
        
        // Random position
        const left = Math.random() * 95;
        const top = Math.random() * 95;
        
        // Random size
        const size = Math.random() * 15 + 10;
        
        // Random animation
        const duration = Math.random() * 20 + 20;
        const delay = Math.random() * 15;
        
        crystal.style.left = `${left}%`;
        crystal.style.top = `${top}%`;
        crystal.style.width = `${size}px`;
        crystal.style.height = `${size}px`;
        crystal.style.animationDuration = `${duration}s`;
        crystal.style.animationDelay = `${delay}s`;
        
        container.appendChild(crystal);
    }
}

// Modal functionality
function setupModal() {
    const closeModalBtn = document.getElementById('close-modal');
    const messageModal = document.getElementById('message-modal');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideMessageModal);
    }
    
    if (messageModal) {
        messageModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideMessageModal();
            }
        });
    }
}

function showMessageModal(message) {
    const modal = document.getElementById('message-modal');
    const modalMessage = document.getElementById('modal-message');
    
    if (modal && modalMessage) {
        modalMessage.textContent = message;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideMessageModal() {
    const modal = document.getElementById('message-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Check if we're on generator page
function isGeneratorPage() {
    return window.location.hash.includes('#guest=') === false;
}