// ============================================
// GENERATOR PAGE FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    initializeFirebase();
    
    // Set up event listeners for generator page
    setupGeneratorEventListeners();
});

function setupGeneratorEventListeners() {
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const guestNameInput = document.getElementById('guest-name');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generateInvitationLink);
    }
    
    if (copyBtn) {
        copyBtn.addEventListener('click', copyInvitationLink);
    }
    
    if (guestNameInput) {
        guestNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                generateInvitationLink();
            }
        });
    }
}

function generateInvitationLink() {
    const guestName = document.getElementById('guest-name').value.trim();
    
    if (!guestName) {
        alert('Please enter a guest name to create the invitation.');
        return;
    }
    
    // Create a unique ID for this guest
    const guestId = Date.now() + Math.floor(Math.random() * 1000);
    
    // Encode the guest data for URL
    const guestData = encodeURIComponent(JSON.stringify({
        name: guestName,
        id: guestId,
        date: new Date().toISOString().split('T')[0]
    }));
    
    // Generate the personalized link
    const baseUrl = window.location.href.split('#')[0];
    const inviteLink = `${baseUrl}#guest=${guestData}`;
    
    // Display the generated link
    const linkElement = document.getElementById('invite-link');
    const container = document.getElementById('generated-link-container');
    
    if (linkElement && container) {
        linkElement.href = inviteLink;
        linkElement.textContent = inviteLink;
        container.classList.add('active');
        
        // Scroll to the generated link section
        container.scrollIntoView({ behavior: 'smooth' });
    }
}

function copyInvitationLink() {
    const linkElement = document.getElementById('invite-link');
    if (!linkElement) return;
    
    const link = linkElement.href;
    navigator.clipboard.writeText(link).then(function() {
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Link Copied!';
        this.style.backgroundColor = 'rgba(192, 192, 192, 0.4)';
        this.style.color = '#000';
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-copy"></i> Copy Invitation Link';
            this.style.backgroundColor = 'rgba(192, 192, 192, 0.2)';
            this.style.color = 'var(--light-silver)';
        }, 2000);
    }.bind(this));
}

// Check if we're on the generator page (not guest page)
function isGeneratorPage() {
    return window.location.hash.includes('#guest=') === false;
}