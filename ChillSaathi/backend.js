// This is the backend logic for the ChillSaathi website.
// It handles user authentication and data storage using Firebase.

// -----------------------------------------------------------------------------
// SECTION 1: FIREBASE INITIALIZATION & CONFIGURATION
// -----------------------------------------------------------------------------

// Import necessary functions from the Firebase SDKs (Software Development Kits)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- START: Manual Firebase Configuration ---
// This is the unique "address" for YOUR Firebase project.
// It tells the website exactly which project in the cloud to connect to.
const firebaseConfig = {
  apiKey: "AIzaSyBeGPGf_rVA4dx9lASlNDsgmjJztsQ287E",
  authDomain: "chillsaathi-29aa8.firebaseapp.com",
  projectId: "chillsaathi-29aa8",
  storageBucket: "chillsaathi-29aa8.appspot.com",
  messagingSenderId: "10087899572",
  appId: "1:10087899572:web:e82fcc8b10c0cead38821f"
};
// --- END: Manual Firebase Configuration ---

const appId = firebaseConfig.projectId;

// Initialize the Firebase app with your configuration
const app = initializeApp(firebaseConfig);
// Get a reference to the Authentication service
const auth = getAuth(app);
// Get a reference to the Firestore Database service
const db = getFirestore(app);

// Make Firebase functions globally accessible for our script
window.firebase = { auth, db, appId, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, doc, setDoc, getDoc, serverTimestamp };


// -----------------------------------------------------------------------------
// SECTION 2: CORE AUTHENTICATION LOGIC
// -----------------------------------------------------------------------------

// UI Elements that we need to interact with
const authContainer = document.getElementById('auth-container');
const loggedOutView = document.getElementById('logged-out-view');
const loggedInView = document.getElementById('logged-in-view');
const userIdDisplay = document.getElementById('user-id-display');
const signInBtn = document.getElementById('sign-in-btn');
const getStartedBtn = document.getElementById('get-started-btn');
const signOutBtn = document.getElementById('sign-out-btn');
const modal = document.getElementById('auth-modal');
const modalBackdrop = document.getElementById('auth-modal-backdrop');
const modalPanel = document.getElementById('auth-modal-panel');
const modalContent = document.getElementById('auth-modal-content');
const closeModalBtn = document.getElementById('close-modal-btn');

// A variable to hold the current user's information
let currentUser = null;

// This is the main listener. It runs whenever a user's login status changes.
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    if (user) { 
        // A user is logged in.
        
        // Create a reference to their document in the database
        const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}`);
        const userDoc = await getDoc(userDocRef);

        // If the user's document doesn't exist yet (i.e., first time signing up)
        if (!userDoc.exists()) {
            try {
                // Create the document with their basic info
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    createdAt: serverTimestamp()
                });
            } catch (error) {
                console.error("Error creating user document in Firestore:", error);
            }
        }

        // Update the UI to show the "logged in" view
        loggedOutView.classList.add('hidden');
        loggedInView.classList.remove('hidden');
        loggedInView.classList.add('flex');
        userIdDisplay.textContent = user.uid;
        closeAuthModal();

    } else {
        // No user is logged in.
        
        // Update the UI to show the "logged out" view
        loggedOutView.classList.remove('hidden');
        loggedInView.classList.add('hidden');
        loggedInView.classList.remove('flex');
        userIdDisplay.textContent = '';
    }
    // Make the authentication section visible now that we know the status
    authContainer.classList.remove('hidden');
});

// -----------------------------------------------------------------------------
// SECTION 3: MODAL AND FORM HANDLING
// -----------------------------------------------------------------------------

// Function to open the sign-in/sign-up popup
const openAuthModal = (mode = 'signup') => {
    // HTML for the sign-up form
    const signupForm = `
        <h2 class="text-2xl font-bold text-center text-slate-800">Create Your Account</h2>
        <p class="text-center text-slate-500 mt-2">Join ChillSaathi to start your wellness journey.</p>
        <form id="signup-form" class="mt-8 space-y-4">
            <div>
                <label for="signup-email" class="text-sm font-medium text-slate-700">Email Address</label>
                <input id="signup-email" type="email" required class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label for="signup-password" class="text-sm font-medium text-slate-700">Password</label>
                <input id="signup-password" type="password" required minlength="6" class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <p id="auth-error" class="text-sm text-red-500 text-center hidden"></p>
            <button type="submit" class="w-full bg-blue-500 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-600 shadow-sm">Create Account</button>
        </form>
        <p class="text-center text-sm text-slate-500 mt-6">
            Already have an account? <button id="switch-to-signin" class="font-semibold text-blue-500 hover:underline">Sign In</button>
        </p>
    `;
    
    // HTML for the sign-in form
    const signinForm = `
        <h2 class="text-2xl font-bold text-center text-slate-800">Welcome Back!</h2>
        <p class="text-center text-slate-500 mt-2">Sign in to continue your journey.</p>
        <form id="signin-form" class="mt-8 space-y-4">
            <div>
                <label for="signin-email" class="text-sm font-medium text-slate-700">Email Address</label>
                <input id="signin-email" type="email" required class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
                <label for="signin-password" class="text-sm font-medium text-slate-700">Password</label>
                <input id="signin-password" type="password" required class="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <p id="auth-error" class="text-sm text-red-500 text-center hidden"></p>
            <button type="submit" class="w-full bg-blue-500 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-600 shadow-sm">Sign In</button>
        </form>
        <p class="text-center text-sm text-slate-500 mt-6">
            Don't have an account? <button id="switch-to-signup" class="font-semibold text-blue-500 hover:underline">Sign Up</button>
        </p>
    `;
    
    modalContent.innerHTML = mode === 'signup' ? signupForm : signinForm;
    modal.classList.remove('hidden');
    modalBackdrop.classList.remove('opacity-0');
    modalPanel.classList.remove('scale-95', 'opacity-0');
    feather.replace();
    addFormListeners();
};

// Function to close the popup
const closeAuthModal = () => {
    modalBackdrop.classList.add('opacity-0');
    modalPanel.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
};

// Function to show user-friendly error messages
const handleAuthError = (error) => {
    console.error("Firebase Auth Error:", error);
    const errorElement = document.getElementById('auth-error');
    if (errorElement) {
        let message = 'An unexpected error occurred. Please try again.';
        switch (error.code) {
            case 'auth/invalid-email':
                message = 'Please enter a valid email address.';
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                message = 'Invalid email or password.';
                break;
            case 'auth/email-already-in-use':
                message = 'An account with this email already exists.';
                break;
            case 'auth/weak-password':
                message = 'Password should be at least 6 characters.';
                break;
            case 'auth/api-key-not-valid':
                 message = 'The project API key is not valid. Please ensure it is correct.';
                 break;
        }
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
};

// Function to add event listeners to the forms inside the modal
function addFormListeners() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            document.getElementById('auth-error').classList.add('hidden');
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            try {
                await createUserWithEmailAndPassword(auth, email, password);
            } catch (error) {
                handleAuthError(error);
            }
        });
    }

    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            document.getElementById('auth-error').classList.add('hidden');
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                handleAuthError(error);
            }
        });
    }
    
    const switchToSignin = document.getElementById('switch-to-signin');
    if (switchToSignin) switchToSignin.addEventListener('click', () => openAuthModal('signin'));

    const switchToSignup = document.getElementById('switch-to-signup');
    if (switchToSignup) switchToSignup.addEventListener('click', () => openAuthModal('signup'));
}

// Main event listeners for header buttons
signInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openAuthModal('signin');
});

getStartedBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openAuthModal('signup');
});

signOutBtn.addEventListener('click', () => {
    signOut(auth);
});

closeModalBtn.addEventListener('click', closeAuthModal);
modalBackdrop.addEventListener('click', closeAuthModal);

