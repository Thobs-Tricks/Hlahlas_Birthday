// ============================================
// INVITATION PAGE FUNCTIONALITY
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Check for guest invitation in URL
    const hash = window.location.hash;
    
    if (hash.includes('#guest=')) {
        showInvitationPage();
    }
});

function showInvitationPage() {
    try {
        // Extract guest data from URL
        const guestDataEncoded = window.location.hash.split('#guest=')[1];
        
        if (guestDataEncoded) {
            const guestData = JSON.parse(decodeURIComponent(guestDataEncoded));
            const guestName = guestData.name;
            
            // Show guest invitation page
            document.getElementById('main-generator').style.display = 'none';
            document.getElementById('guest-invitation-page').classList.add('active');
            
            // Update guest name display
            const guestNameDisplay = document.getElementById('guest-name-display');
            const rsvpNameInput = document.getElementById('rsvp-name');
            
            if (guestNameDisplay) guestNameDisplay.textContent = guestName;
            if (rsvpNameInput) rsvpNameInput.value = guestName;
            
            // Initialize Firebase for RSVP form
            initializeFirebase();
            
            // Set up RSVP form
            setupRSVPForm();
            
            // Create elegant decorations
            createElegantDecorations();
            
            // Scroll to top of guest page
            window.scrollTo(0, 0);
        }
    } catch (e) {
        console.error('Error parsing guest data:', e);
    }
}

function setupRSVPForm() {
    const submitBtn = document.getElementById('submit-rsvp');
    if (!submitBtn) return;
    
    submitBtn.addEventListener('click', submitRSVP);
    
    // Update Firebase status
    updateFirebaseStatus('firebase-status');
}

async function submitRSVP() {
    const name = document.getElementById('rsvp-name').value.trim();
    const phone = document.getElementById('rsvp-phone').value.trim();
    const email = document.getElementById('rsvp-email').value.trim();
    const guests = document.getElementById('rsvp-guests').value;
    const attendance = document.querySelector('input[name="attendance"]:checked');
    const message = document.getElementById('rsvp-message').value.trim();
    
    // Validation
    if (!name || !phone || !guests || !attendance) {
        alert('Please fill in all required fields (Name, Phone, Number of Guests, and Attendance).');
        return;
    }
    
    // Phone number validation (basic)
    const phoneRegex = /^[0-9\s\+\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        alert('Please enter a valid phone number (at least 10 digits).');
        return;
    }
    
    // Email validation (if provided)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address or leave it empty.');
        return;
    }
    
    const submitBtn = document.getElementById('submit-rsvp');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Saving to database...';
    submitBtn.disabled = true;
    
    // Prepare RSVP data
    const rsvpData = {
        guestName: name,
        phone: phone,
        email: email,
        numberOfGuests: guests,
        attendance: attendance.value,
        message: message,
        timestamp: new Date().toISOString(),
        event: "Bohlale's 21st Birthday - 26 Dec 2026"
    };
    
    // Save to Firebase
    const firebaseResult = await saveRSVPToFirebase(rsvpData);
    
    // Also save to localStorage as backup
    let allRSVPs = JSON.parse(localStorage.getItem('bohlale21RSVPs') || '[]');
    allRSVPs.push(rsvpData);
    localStorage.setItem('bohlale21RSVPs', JSON.stringify(allRSVPs));
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // Show appropriate message
    showRSVPConfirmation(firebaseResult, rsvpData);
}

async function saveRSVPToFirebase(rsvpData) {
    if (!isFirebaseInitialized()) {
        return { success: false, error: "Database not connected" };
    }
    
    try {
        const firestoreData = {
            DataSubmitted: firebase.firestore.FieldValue.serverTimestamp(),
            Email: rsvpData.email || "",
            Fullnames: rsvpData.guestName,
            Message: rsvpData.message || "",
            NumGuest: parseInt(rsvpData.numberOfGuests) || 1,
            PhoneNumber: rsvpData.phone,
            WillAttend: rsvpData.attendance === "yes"
        };
        
        console.log("Saving to Firestore:", firestoreData);
        
        const docRef = await getFirestore().collection("Birthday RSVP").add(firestoreData);
        
        console.log("RSVP saved with ID: ", docRef.id);
        return { success: true, docId: docRef.id };
        
    } catch (error) {
        console.error("Error saving to Firestore:", error);
        return { success: false, error: error.message };
    }
}

function showRSVPConfirmation(firebaseResult, rsvpData) {
    const rsvpContainer = document.getElementById('rsvp-container');
    const confirmationMessage = document.getElementById('confirmation-message');
    const confirmationDetails = document.getElementById('confirmation-details');
    
    if (!rsvpContainer || !confirmationMessage || !confirmationDetails) return;
    
    // Hide RSVP form and show confirmation
    rsvpContainer.style.display = 'none';
    confirmationMessage.classList.add('active');
    
    // Create celebration effects
    createSubtleConfetti();
    
    // Update confirmation details
    if (firebaseResult.success) {
        confirmationDetails.innerHTML = `
            <p><strong>Confirmation Details:</strong></p>
            <p>Name: ${rsvpData.guestName}</p>
            <p>Phone: ${rsvpData.phone}</p>
            <p>Guests: ${rsvpData.numberOfGuests} ${rsvpData.numberOfGuests === '1' ? 'person' : 'people'}</p>
            <p>Attendance: ${rsvpData.attendance === 'yes' ? 'Confirmed' : 'Cannot attend'}</p>
            <p>Saved to database: ✓</p>
        `;
        console.log('RSVP saved successfully to Firebase!');
    } else {
        confirmationDetails.innerHTML = `
            <p><strong>Confirmation Details:</strong></p>
            <p>Name: ${rsvpData.guestName}</p>
            <p>Phone: ${rsvpData.phone}</p>
            <p>Guests: ${rsvpData.numberOfGuests} ${rsvpData.numberOfGuests === '1' ? 'person' : 'people'}</p>
            <p>Attendance: ${rsvpData.attendance === 'yes' ? 'Confirmed' : 'Cannot attend'}</p>
            <p style="color: #ffabab;">⚠ Please contact hosts directly to confirm your attendance</p>
        `;
    }
    
    // Scroll to confirmation message
    confirmationMessage.scrollIntoView({ behavior: 'smooth' });
}