// community.js - Handles the Community Wellness Challenge functionality (FRONTEND ONLY)

// --- 1. GET HTML ELEMENTS ---
// Get the button that opens the modal
const submitEntryBtn = document.getElementById('submit-entry-btn');

// Get the modal and its components
const submissionModal = document.getElementById('submission-modal');
const submissionModalPanel = submissionModal.querySelector('.transform');
const closeSubmissionModalBtn = document.getElementById('close-submission-modal-btn');
const submissionForm = document.getElementById('submission-form');

// --- 2. MODAL HANDLING LOGIC ---
// Function to open the modal with a smooth animation
const openSubmissionModal = () => {
    submissionModal.classList.remove('hidden');
    submissionModal.classList.add('flex');
    // A tiny delay allows the browser to apply the initial styles before transitioning
    setTimeout(() => {
        submissionModal.classList.remove('opacity-0');
        submissionModalPanel.classList.remove('scale-95', 'opacity-0');
    }, 10);
};

// Function to close the modal with a smooth animation
const closeSubmissionModal = () => {
    submissionModal.classList.add('opacity-0');
    submissionModalPanel.classList.add('scale-95', 'opacity-0');
    // Wait for the animation to finish before hiding the modal completely
    setTimeout(() => {
        submissionModal.classList.add('hidden');
        submissionModal.classList.remove('flex');
    }, 300); // This duration should match your CSS transition duration
};

// --- 3. FORM SUBMISSION LOGIC (PLACEHOLDER) ---
const handleSubmission = (e) => {
    // Prevent the form from actually submitting and reloading the page
    e.preventDefault();
    
    // Show the "upcoming feature" message to the user
    alert("Thank you for your interest! Full submission functionality is an upcoming feature and will be available soon.");

    // For a better user experience, we can still close the modal and reset the form
    submissionForm.reset();
    closeSubmissionModal();
};


// --- 4. EVENT LISTENERS ---
// When the main "Submit Your Entry" button is clicked, open the modal
submitEntryBtn.addEventListener('click', openSubmissionModal);

// When the 'X' button inside the modal is clicked, close the modal
closeSubmissionModalBtn.addEventListener('click', closeSubmissionModal);

// When the form is submitted, run our placeholder function
submissionForm.addEventListener('submit', handleSubmission);

// Optional: Close the modal if the user clicks on the dark background
submissionModal.addEventListener('click', (event) => {
    if (event.target === submissionModal) {
        closeSubmissionModal();
    }
});
