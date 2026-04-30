/**
 * VELVET AUTH - Premium Authentication System
 * Firebase Integration, GSAP Animations, Form Handling
 */

// ============================================
// FIREBASE CONFIGURATION
// ============================================
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3GIr6IvG4zPHNrYx4b0dKD5yPLEQvoTY",
    authDomain: "hariskhan-b3b81.firebaseapp.com",
    projectId: "hariskhan-b3b81",
    storageBucket: "hariskhan-b3b81.firebasestorage.app",
    messagingSenderId: "476505875257",
    appId: "1:476505875257:web:bffa142f0c52382e1cbee8",
    measurementId: "G-L5MZGCNWY2"
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    // Loading Screen
    loadingScreen: document.getElementById('loading-screen'),
    
    // Toast Container
    toastContainer: document.getElementById('toast-container'),
    
    // Auth Container
    authContainer: document.getElementById('auth-container'),
    
    // Forms
    signinForm: document.getElementById('signin-form'),
    signupForm: document.getElementById('signup-form'),
    forgotForm: document.getElementById('forgot-form'),
    
    // Form Elements - Sign In
    loginForm: document.getElementById('login-form'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    loginBtn: document.getElementById('login-btn'),
    rememberMe: document.getElementById('remember-me'),
    
    // Form Elements - Sign Up
    registerForm: document.getElementById('register-form'),
    signupName: document.getElementById('signup-name'),
    signupEmail: document.getElementById('signup-email'),
    signupPassword: document.getElementById('signup-password'),
    signupConfirm: document.getElementById('signup-confirm'),
    signupBtn: document.getElementById('signup-btn'),
    passwordStrength: document.getElementById('password-strength'),
    strengthBar: document.querySelector('.strength-bar'),
    strengthText: document.querySelector('.strength-text'),
    
    // Form Elements - Forgot Password
    resetForm: document.getElementById('reset-form'),
    resetEmail: document.getElementById('reset-email'),
    resetBtn: document.getElementById('reset-btn'),
    
    // Social Buttons
    googleSignin: document.getElementById('google-signin'),
    githubSignin: document.getElementById('github-signin'),
    googleSignup: document.getElementById('google-signup'),
    githubSignup: document.getElementById('github-signup'),
    
    // Dashboard
    dashboardContainer: document.getElementById('dashboard-container'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    sidebarClose: document.getElementById('sidebar-close'),
    dashboardSidebar: document.getElementById('dashboard-sidebar'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // User Profile Elements
    mobileAvatar: document.getElementById('mobile-avatar'),
    sidebarAvatar: document.getElementById('sidebar-avatar'),
    sidebarName: document.getElementById('sidebar-name'),
    sidebarEmail: document.getElementById('sidebar-email'),
    welcomeName: document.getElementById('welcome-name'),
    profileAvatar: document.getElementById('profile-avatar'),
    profileName: document.getElementById('profile-name'),
    profileEmail: document.getElementById('profile-email'),
    memberSince: document.getElementById('member-since'),
    lastLogin: document.getElementById('last-login'),
    recentActivity: document.getElementById('recent-activity'),
    fullActivity: document.getElementById('full-activity'),
    
    // Settings
    settingsName: document.getElementById('settings-name'),
    settingsEmail: document.getElementById('settings-email'),
    saveSettings: document.getElementById('save-settings'),
    changePasswordBtn: document.getElementById('change-password-btn'),
    
    // Navigation
    navItems: document.querySelectorAll('.nav-item'),
    dashboardSections: document.querySelectorAll('.dashboard-section')
};

// ============================================
// INITIALIZATION
// ============================================

// Initialize Firebase
let auth;
try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    showToast('Firebase not configured. Please add your Firebase config.', 'error', 'Configuration Error');
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Loading screen animation
    animateLoadingScreen();
    
    // Initialize form handlers
    initFormHandlers();
    
    // Initialize password strength indicator
    initPasswordStrength();
    
    // Initialize social auth
    initSocialAuth();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize dashboard
    initDashboard();
    
    // Initialize auth state listener
    initAuthStateListener();
    
    // Initialize toggle password buttons
    initTogglePassword();
    
    // Handle redirect result (for Google/GitHub auth)
    handleRedirectResult();
}

// ============================================
// LOADING SCREEN ANIMATION
// ============================================
function animateLoadingScreen() {
    const tl = gsap.timeline();
    
    // Animate loader circles
    tl.to('.loader-circle', {
        scale: 1.1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 2
    })
    .to('.loader-text', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
    }, '-=0.5')
    .to('.loading-screen', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
            elements.loadingScreen.style.display = 'none';
        }
    }, '+=0.5');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info', title = '') {
    const toastId = 'toast-' + Date.now();
    const icons = {
        success: '<polyline points="20 6 9 17 4 12"></polyline>',
        error: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
        info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
    };
    
    const titles = {
        success: title || 'Success',
        error: title || 'Error',
        info: title || 'Info'
    };
    
    const toastHTML = `
        <div id="${toastId}" class="toast toast-${type}">
            <div class="toast-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${icons[type]}
                </svg>
            </div>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="dismissToast('${toastId}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
    
    elements.toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    // Animate in
    gsap.fromTo(`#${toastId}`,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
        dismissToast(toastId);
    }, 4000);
}

function dismissToast(toastId) {
    const toast = document.getElementById(toastId);
    if (!toast) return;
    
    gsap.to(toast, {
        x: 100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            toast.remove();
        }
    });
}

// ============================================
// FORM HANDLERS
// ============================================
function initFormHandlers() {
    // Switch between forms
    document.querySelectorAll('.switch-form, .forgot-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetForm = e.target.dataset.form;
            switchForm(targetForm);
        });
    });
    
    // Sign In Form
    elements.loginForm.addEventListener('submit', handleSignIn);
    
    // Sign Up Form
    elements.registerForm.addEventListener('submit', handleSignUp);
    
    // Forgot Password Form
    elements.resetForm.addEventListener('submit', handleForgotPassword);
}

function switchForm(targetFormId) {
    const currentForm = document.querySelector('.form-container.active');
    const targetForm = document.getElementById(targetFormId + '-form');
    
    if (!targetForm || currentForm === targetForm) return;
    
    // Animate out current form
    gsap.to(currentForm, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
            currentForm.classList.remove('active');
            targetForm.classList.add('active');
            
            // Animate in target form
            gsap.fromTo(targetForm,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
            );
        }
    });
}

async function handleSignIn(e) {
    e.preventDefault();
    
    const email = elements.loginEmail.value.trim();
    const password = elements.loginPassword.value;
    
    // Validation
    if (!email || !password) {
        showToast('Please fill in all fields', 'error', 'Validation Error');
        return;
    }
    
    // Show loading state
    setLoading(elements.loginBtn, true);
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        showToast('Successfully signed in!', 'success');
        
        // Clear form
        elements.loginForm.reset();
        
    } catch (error) {
        handleFirebaseError(error, 'signin');
    } finally {
        setLoading(elements.loginBtn, false);
    }
}

async function handleSignUp(e) {
    e.preventDefault();
    
    const name = elements.signupName.value.trim();
    const email = elements.signupEmail.value.trim();
    const password = elements.signupPassword.value;
    const confirm = elements.signupConfirm.value;
    const terms = document.getElementById('terms').checked;
    
    // Validation
    if (!name || !email || !password || !confirm) {
        showToast('Please fill in all fields', 'error', 'Validation Error');
        return;
    }
    
    if (password !== confirm) {
        showToast('Passwords do not match', 'error', 'Validation Error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password should be at least 6 characters', 'error', 'Validation Error');
        return;
    }
    
    if (!terms) {
        showToast('Please accept the Terms & Conditions', 'error', 'Validation Error');
        return;
    }
    
    // Show loading state
    setLoading(elements.signupBtn, true);
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Update profile with name
        await userCredential.user.updateProfile({
            displayName: name,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6B4423&color=FFF8F0`
        });
        
        showToast('Account created successfully!', 'success');
        
        // Clear form
        elements.registerForm.reset();
        
    } catch (error) {
        handleFirebaseError(error, 'signup');
    } finally {
        setLoading(elements.signupBtn, false);
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = elements.resetEmail.value.trim();
    
    if (!email) {
        showToast('Please enter your email address', 'error', 'Validation Error');
        return;
    }
    
    // Show loading state
    setLoading(elements.resetBtn, true);
    
    try {
        await auth.sendPasswordResetEmail(email);
        showToast('Password reset email sent! Check your inbox.', 'success');
        
        // Switch back to sign in after a delay
        setTimeout(() => {
            switchForm('signin');
        }, 2000);
        
    } catch (error) {
        handleFirebaseError(error, 'reset');
    } finally {
        setLoading(elements.resetBtn, false);
    }
}

// ============================================
// PASSWORD STRENGTH INDICATOR
// ============================================
function initPasswordStrength() {
    elements.signupPassword.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthUI(strength);
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
}

function updatePasswordStrengthUI(strength) {
    const classes = ['weak', 'medium', 'strong'];
    const labels = {
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong'
    };
    
    // Remove all classes
    classes.forEach(c => {
        elements.strengthBar.classList.remove(c);
        elements.strengthText.classList.remove(c);
    });
    
    // Add current class
    elements.strengthBar.classList.add(strength);
    elements.strengthText.classList.add(strength);
    elements.strengthText.textContent = labels[strength];
}

// ============================================
// SOCIAL AUTHENTICATION
// ============================================
function initSocialAuth() {
    // Google Sign In
    elements.googleSignin.addEventListener('click', () => handleSocialAuth('google'));
    elements.googleSignup.addEventListener('click', () => handleSocialAuth('google'));
    
    // GitHub Sign In
    elements.githubSignin.addEventListener('click', () => handleSocialAuth('github'));
    elements.githubSignup.addEventListener('click', () => handleSocialAuth('github'));
}

async function handleSocialAuth(provider) {
    let authProvider;
    
    if (provider === 'google') {
        authProvider = new firebase.auth.GoogleAuthProvider();
    } else if (provider === 'github') {
        authProvider = new firebase.auth.GithubAuthProvider();
    }
    
    try {
        // Use redirect instead of popup for better compatibility
        await auth.signInWithRedirect(authProvider);
    } catch (error) {
        handleFirebaseError(error, provider);
    }
}

// Handle redirect result when page loads
async function handleRedirectResult() {
    try {
        const result = await auth.getRedirectResult();
        if (result.user) {
            showToast(`Welcome back!`, 'success');
        }
    } catch (error) {
        // Only show error if it's not the "no redirect operation" error
        if (error.code !== 'auth/redirect-cancelled-by-user') {
            handleFirebaseError(error, 'redirect');
        }
    }
}

// ============================================
// FIREBASE ERROR HANDLING
// ============================================
function handleFirebaseError(error, context) {
    console.error('Firebase Error:', error);
    
    const errorMessages = {
        // Sign In Errors
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-email': 'Please enter a valid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/too-many-requests': 'Too many attempts. Please try again later',
        'auth/invalid-credential': 'Invalid email or password',
        
        // Sign Up Errors
        'auth/email-already-in-use': 'This email is already registered',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/invalid-password': 'Invalid password format',
        
        // Reset Password Errors
        'auth/missing-email': 'Please enter an email address',
        
        // Social Auth Errors
        'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method',
        'auth/popup-closed-by-user': 'Sign-in popup was closed before completing',
        'auth/popup-blocked': 'Sign-in popup was blocked by the browser',
        'auth/cancelled-popup-request': 'Another sign-in request is in progress',
        'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations',
        'auth/operation-not-supported-in-this-environment': 'This operation is not supported in this environment',
        
        // Network Errors
        'auth/network-request-failed': 'Network error. Please check your internet connection',
        'auth/timeout': 'Request timed out. Please try again',
        
        // Generic Errors
        'auth/internal-error': 'An internal error occurred. Please try again',
        'auth/unknown': 'An unknown error occurred. Please try again'
    };
    
    const message = errorMessages[error.code] || error.message || 'An error occurred. Please try again.';
    showToast(message, 'error', 'Authentication Error');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function initTogglePassword() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.dataset.target;
            const input = document.getElementById(targetId);
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            
            // Update icon
            const icon = e.currentTarget.querySelector('svg');
            if (type === 'text') {
                icon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                `;
            } else {
                icon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                `;
            }
        });
    });
}

// ============================================
// AUTH STATE LISTENER
// ============================================
function initAuthStateListener() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            showDashboard(user);
        } else {
            // User is signed out
            showAuth();
        }
    });
}

function showDashboard(user) {
    // Update user info in dashboard
    updateUserInfo(user);
    
    // Animate transition
    gsap.to(elements.authContainer, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            elements.authContainer.style.display = 'none';
            elements.dashboardContainer.style.display = 'flex';
            
            gsap.fromTo(elements.dashboardContainer,
                { opacity: 0, scale: 1.05 },
                { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
            );
            
            // Animate dashboard elements
            animateDashboardElements();
        }
    });
}

function showAuth() {
    elements.authContainer.style.display = 'flex';
    elements.dashboardContainer.style.display = 'none';
    
    gsap.fromTo(elements.authContainer,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
    );
}

function updateUserInfo(user) {
    const displayName = user.displayName || user.email.split('@')[0];
    const photoURL = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6B4423&color=FFF8F0`;
    const email = user.email;
    const metadata = user.metadata;
    
    // Update all user elements
    elements.mobileAvatar.src = photoURL;
    elements.sidebarAvatar.src = photoURL;
    elements.profileAvatar.src = photoURL;
    
    elements.sidebarName.textContent = displayName;
    elements.welcomeName.textContent = displayName;
    elements.profileName.textContent = displayName;
    elements.settingsName.value = displayName;
    
    elements.sidebarEmail.textContent = email;
    elements.profileEmail.textContent = email;
    elements.settingsEmail.value = email;
    
    // Format dates
    const memberDate = metadata.creationTime ? new Date(metadata.creationTime) : new Date();
    elements.memberSince.textContent = memberDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    const lastSignIn = metadata.lastSignInTime ? new Date(metadata.lastSignInTime) : new Date();
    const timeDiff = Math.floor((new Date() - lastSignIn) / 1000);
    
    let lastLoginText;
    if (timeDiff < 60) {
        lastLoginText = 'Just now';
    } else if (timeDiff < 3600) {
        lastLoginText = `${Math.floor(timeDiff / 60)} minutes ago`;
    } else if (timeDiff < 86400) {
        lastLoginText = `${Math.floor(timeDiff / 3600)} hours ago`;
    } else {
        lastLoginText = lastSignIn.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
    elements.lastLogin.textContent = lastLoginText;
    
    // Add activity entry
    addActivityEntry('Successfully logged in', 'success');
}

function animateDashboardElements() {
    // Animate stat cards
    gsap.from('.stat-card', {
        y: 30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2
    });
    
    // Animate dashboard cards
    gsap.from('.dashboard-card', {
        y: 30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.4
    });
}

function addActivityEntry(title, type = 'info') {
    const time = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
    });
    
    const icons = {
        success: '<polyline points="20 6 9 17 4 12"></polyline>',
        info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
    };
    
    const activityHTML = `
        <div class="activity-item">
            <div class="activity-icon ${type}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${icons[type]}
                </svg>
            </div>
            <div class="activity-content">
                <span class="activity-title">${title}</span>
                <span class="activity-time">${time}</span>
            </div>
        </div>
    `;
    
    // Add to recent activity
    const recentList = elements.recentActivity;
    recentList.insertAdjacentHTML('afterbegin', activityHTML);
    
    // Keep only 5 items
    while (recentList.children.length > 5) {
        recentList.removeChild(recentList.lastChild);
    }
    
    // Add to full activity
    const fullList = elements.fullActivity;
    const timelineHTML = `
        <div class="timeline-item">
            <div class="timeline-marker ${type}"></div>
            <div class="timeline-content">
                <h4>${title}</h4>
                <p>Account activity recorded</p>
                <span class="timeline-time">${time}</span>
            </div>
        </div>
    `;
    fullList.insertAdjacentHTML('afterbegin', timelineHTML);
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    // Sidebar navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.currentTarget.dataset.section;
            switchSection(section);
            
            // Update active state
            elements.navItems.forEach(nav => nav.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            // Close mobile sidebar
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });
    
    // Mobile menu toggle
    elements.mobileMenuToggle.addEventListener('click', openMobileSidebar);
    elements.sidebarClose.addEventListener('click', closeMobileSidebar);
    elements.sidebarOverlay.addEventListener('click', closeMobileSidebar);
    
    // Card header buttons
    document.querySelectorAll('.card-header .btn-text').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.dataset.section;
            if (section) {
                switchSection(section);
                elements.navItems.forEach(nav => {
                    nav.classList.toggle('active', nav.dataset.section === section);
                });
            }
        });
    });
}

function switchSection(sectionId) {
    const currentSection = document.querySelector('.dashboard-section.active');
    const targetSection = document.getElementById(sectionId + '-section');
    
    if (!targetSection || currentSection === targetSection) return;
    
    gsap.to(currentSection, {
        opacity: 0,
        x: -20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
            currentSection.classList.remove('active');
            targetSection.classList.add('active');
            
            gsap.fromTo(targetSection,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
            );
        }
    });
}

function openMobileSidebar() {
    elements.dashboardSidebar.classList.add('active');
    elements.sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileSidebar() {
    elements.dashboardSidebar.classList.remove('active');
    elements.sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// DASHBOARD FUNCTIONALITY
// ============================================
function initDashboard() {
    // Logout button
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Save settings
    elements.saveSettings.addEventListener('click', handleSaveSettings);
    
    // Change password button
    elements.changePasswordBtn.addEventListener('click', () => {
        showToast('Password change feature coming soon!', 'info');
    });
}

async function handleLogout() {
    try {
        await auth.signOut();
        showToast('Successfully logged out!', 'success');
        closeMobileSidebar();
    } catch (error) {
        handleFirebaseError(error, 'logout');
    }
}

async function handleSaveSettings() {
    const newName = elements.settingsName.value.trim();
    
    if (!newName) {
        showToast('Please enter a display name', 'error');
        return;
    }
    
    try {
        const user = auth.currentUser;
        if (user) {
            await user.updateProfile({
                displayName: newName,
                photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=6B4423&color=FFF8F0`
            });
            
            // Update UI
            elements.sidebarName.textContent = newName;
            elements.welcomeName.textContent = newName;
            elements.profileName.textContent = newName;
            
            showToast('Settings saved successfully!', 'success');
            addActivityEntry('Profile updated', 'success');
        }
    } catch (error) {
        handleFirebaseError(error, 'settings');
    }
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileSidebar();
    }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Escape to close mobile sidebar
    if (e.key === 'Escape') {
        closeMobileSidebar();
    }
});

console.log('Velvet Auth - Premium Authentication System Loaded');
