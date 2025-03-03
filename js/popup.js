// State management
let state = {
    startDate: null,
    targetDate: null,
    theme: 'light',
    autoHide: false
};

// DOM Elements
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const startDateInput = document.getElementById('start-date');
const targetDateInput = document.getElementById('target-date');
const daysInput = document.getElementById('days-input');
const settingsToggle = document.getElementById('settings-toggle');
const settingsModal = document.getElementById('settings-modal');
const themeSelect = document.getElementById('theme-select');
const autoHideCheckbox = document.getElementById('auto-hide');
const progressContainer = document.getElementById('progress-container');

// Load saved state
chrome.storage.local.get(['startDate', 'targetDate', 'theme', 'autoHide'], (result) => {
    if (result.startDate) {
        state.startDate = new Date(result.startDate);
        startDateInput.value = state.startDate.toISOString().split('T')[0];
    }
    if (result.targetDate) {
        state.targetDate = new Date(result.targetDate);
        targetDateInput.value = state.targetDate.toISOString().split('T')[0];
        updateProgress();
    }
    if (result.theme) {
        state.theme = result.theme;
        themeSelect.value = state.theme;
        document.body.setAttribute('data-theme', state.theme);
    }
    if (result.autoHide !== undefined) {
        state.autoHide = result.autoHide;
        autoHideCheckbox.checked = state.autoHide;
    }
});

// Update progress
function updateProgress() {
    if (!state.targetDate || !state.startDate) return;

    const now = new Date();
    const timeDiff = state.targetDate - now;
    const isCountdown = timeDiff > 0;
    
    // Calculate progress percentage
    let progress;
    let text;
    
    if (isCountdown) {
        const totalDuration = state.targetDate - state.startDate;
        const elapsedDuration = now - state.startDate;
        const progressPercent = (elapsedDuration / totalDuration) * 100;
        progress = Math.min(100, Math.max(0, progressPercent));
        text = `${progress.toFixed(2)}%`;
    } else {
        progress = 100;
        text = '100%';
    }

    // Update UI
    progressBar.style.width = `${progress}%`;
    progressText.textContent = text;

    // Auto-hide logic
    if (state.autoHide) {
        progressContainer.style.opacity = '0.3';
        progressContainer.addEventListener('mouseenter', () => {
            progressContainer.style.opacity = '1';
        });
        progressContainer.addEventListener('mouseleave', () => {
            progressContainer.style.opacity = '0.3';
        });
    } else {
        progressContainer.style.opacity = '1';
    }
}

// Event Listeners
startDateInput.addEventListener('change', (e) => {
    const selectedDate = new Date(e.target.value);
    selectedDate.setHours(0, 0, 0, 0); // Set to start of day
    state.startDate = selectedDate;
    chrome.storage.local.set({ startDate: state.startDate.toISOString() });
    updateProgress();
});

targetDateInput.addEventListener('change', (e) => {
    const selectedDate = new Date(e.target.value);
    selectedDate.setHours(23, 59, 59, 999); // Set to end of day
    state.targetDate = selectedDate;
    chrome.storage.local.set({ targetDate: state.targetDate.toISOString() });
    updateProgress();
});

daysInput.addEventListener('change', (e) => {
    const days = parseInt(e.target.value);
    if (isNaN(days)) return;
    
    // Set start date to today start
    const now = new Date();
    state.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    startDateInput.value = state.startDate.toISOString().split('T')[0];
    
    // Set target date to X days from now end
    state.targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, 23, 59, 59, 999);
    targetDateInput.value = state.targetDate.toISOString().split('T')[0];
    
    // Save both dates
    chrome.storage.local.set({ 
        startDate: state.startDate.toISOString(),
        targetDate: state.targetDate.toISOString()
    });
    updateProgress();
});

settingsToggle.addEventListener('click', () => {
    settingsModal.classList.toggle('hidden');
});

themeSelect.addEventListener('change', (e) => {
    state.theme = e.target.value;
    document.body.setAttribute('data-theme', state.theme);
    chrome.storage.local.set({ theme: state.theme });
});

autoHideCheckbox.addEventListener('change', (e) => {
    state.autoHide = e.target.checked;
    chrome.storage.local.set({ autoHide: state.autoHide });
    updateProgress();
});

// Drag functionality
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;

progressContainer.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);

function dragStart(e) {
    initialX = e.clientX - progressContainer.offsetLeft;
    initialY = e.clientY - progressContainer.offsetTop;
    isDragging = true;
}

function drag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    currentX = e.clientX - initialX;
    currentY = e.clientY - initialY;
    
    progressContainer.style.transform = `translate(${currentX}px, ${currentY}px)`;
}

function dragEnd() {
    isDragging = false;
}

// Update progress every second
setInterval(updateProgress, 1000); 