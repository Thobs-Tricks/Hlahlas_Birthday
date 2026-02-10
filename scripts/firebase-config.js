// ============================================
// FIREBASE CONFIGURATION
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyC8Kd2Wr55iHGuJDgiVDLulrIzjYOwd16c",
    authDomain: "bohlale-base.firebaseapp.com",
    projectId: "bohlale-base",
    storageBucket: "bohlale-base.firebasestorage.app",
    messagingSenderId: "367428432200",
    appId: "1:367428432200:web:4a260f5fcce2716ed2c37d",
    measurementId: "G-6YLP64XWR9"
};

// Global variables
let db; // Firestore database reference
let firebaseInitialized = false;

// Initialize Firebase
function initializeFirebase() {
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        firebaseInitialized = true;
        console.log("Firebase initialized successfully!");
        return true;
    } catch (error) {
        console.error("Firebase initialization error:", error);
        return false;
    }
}

// Check if Firebase is initialized
function isFirebaseInitialized() {
    return firebaseInitialized && db !== undefined;
}

// Get Firestore instance
function getFirestore() {
    if (!isFirebaseInitialized()) {
        if (!initializeFirebase()) {
            throw new Error("Firebase failed to initialize");
        }
    }
    return db;
}

// Update status indicator on page
function updateFirebaseStatus(statusElementId) {
    const statusElement = document.getElementById(statusElementId);
    if (!statusElement) return;
    
    if (isFirebaseInitialized()) {
        statusElement.textContent = "✓ Connected to database";
        statusElement.className = "alert success";
        statusElement.style.display = "block";
    } else {
        statusElement.textContent = "⚠ Database connection failed. RSVP will be saved locally.";
        statusElement.className = "alert error";
        statusElement.style.display = "block";
    }
}