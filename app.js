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
    mobileLogoutBtn: document.getElementById('mobile-logout-btn'),
    
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
    
    // Analytics Elements
    analyticsSecurity: document.getElementById('analytics-security'),
    analyticsMember: document.getElementById('analytics-member'),
    analyticsLogin: document.getElementById('analytics-login'),
    analyticsSession: document.getElementById('analytics-session'),
    analyticsTotal: document.getElementById('analytics-total'),
    analyticsProvider: document.getElementById('analytics-provider'),
    
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
    
    // Enable session persistence for redirect auth
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            console.log('Auth persistence set to LOCAL');
        })
        .catch((error) => {
            console.error('Auth persistence error:', error);
        });
    
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    showToast('Firebase not configured. Please add your Firebase config.', 'error', 'Configuration Error');
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    console.log('=== initApp starting ===');
    
    // Loading screen animation
    animateLoadingScreen();
    
    // Check URL for OAuth redirect indicators
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('error');
    console.log('URL has OAuth params:', hasOAuthParams);
    
    // If this is a redirect return, wait for auth to settle
    if (hasOAuthParams) {
        console.log('Redirect detected - waiting for auth state...');
        
        // Wait for auth state to stabilize after redirect
        const user = await waitForAuthState();
        
        if (user) {
            console.log('User found after redirect:', user.email);
            showDashboard(user);
        } else {
            console.log('No user after redirect');
            showAuth();
        }
        
        hideLoadingScreen();
    } else {
        // Normal page load - check redirect result then auth state
        const redirectHandled = await handleRedirectResult();
        
        if (redirectHandled) {
            console.log('Redirect handled successfully');
            hideLoadingScreen();
        } else {
            // No redirect - initialize auth listener
            initAuthStateListener();
            
            // Check current auth state
            const currentUser = auth.currentUser;
            if (currentUser) {
                console.log('Already signed in:', currentUser.email);
                showDashboard(currentUser);
            } else {
                showAuth();
            }
            hideLoadingScreen();
        }
    }
    
    // Initialize all other components
    initFormHandlers();
    initPasswordStrength();
    initSocialAuth();
    initNavigation();
    initDashboard();
    initTogglePassword();
    
    console.log('=== initApp complete ===');
}

// Helper function to wait for auth state after redirect
function waitForAuthState(timeout = 5000) {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log('waitForAuthState - user:', user ? user.email : 'null');
            unsubscribe();
            resolve(user);
        });
        
        // Timeout fallback
        setTimeout(() => {
            console.log('waitForAuthState timeout');
            unsubscribe();
            resolve(auth.currentUser);
        }, timeout);
    });
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
    }, '-=0.5');
    // Don't hide loading screen here - wait for auth state
}

function hideLoadingScreen() {
    gsap.to('.loading-screen', {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
            elements.loadingScreen.style.display = 'none';
        }
    });
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
    console.log('Initializing social auth...');
    
    // Get buttons directly to ensure they exist
    const googleSigninBtn = document.getElementById('google-signin');
    const githubSigninBtn = document.getElementById('github-signin');
    const googleSignupBtn = document.getElementById('google-signup');
    const githubSignupBtn = document.getElementById('github-signup');
    
    console.log('Buttons found:', {
        googleSignin: !!googleSigninBtn,
        githubSignin: !!githubSigninBtn,
        googleSignup: !!googleSignupBtn,
        githubSignup: !!githubSignupBtn
    });
    
    // Google Sign In
    if (googleSigninBtn) {
        googleSigninBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Google signin clicked');
            handleSocialAuth('google');
        });
    }
    
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Google signup clicked');
            handleSocialAuth('google');
        });
    }
    
    // GitHub Sign In
    if (githubSigninBtn) {
        githubSigninBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Github signin clicked');
            handleSocialAuth('github');
        });
    }
    
    if (githubSignupBtn) {
        githubSignupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Github signup clicked');
            handleSocialAuth('github');
        });
    }
}

async function handleSocialAuth(provider) {
    console.log('handleSocialAuth called for:', provider);
    
    // Check if Firebase is initialized
    if (!auth) {
        console.error('Firebase auth not initialized');
        showToast('Authentication not ready. Please refresh the page.', 'error');
        return;
    }
    
    let authProvider;
    
    if (provider === 'google') {
        authProvider = new firebase.auth.GoogleAuthProvider();
    } else if (provider === 'github') {
        authProvider = new firebase.auth.GithubAuthProvider();
    }
    
    // Add scopes
    authProvider.addScope('email');
    authProvider.addScope('profile');
    
    console.log('Starting sign in with popup...');
    showToast('Opening ' + provider + ' sign-in window...', 'info');
    
    try {
        // Open popup centered on screen
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        const popup = window.open(
            'about:blank',
            'SignIn',
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
        );
        
        if (!popup || popup.closed) {
            throw { code: 'auth/popup-blocked', message: 'Popup was blocked' };
        }
        
        // Close the blank popup and use Firebase's popup
        popup.close();
        
        const result = await auth.signInWithPopup(authProvider);
        console.log('Popup sign-in successful:', result.user);
        showToast(`Welcome ${result.user.displayName || result.user.email}!`, 'success');
    } catch (error) {
        console.error('Popup error:', error);
        
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
            showToast('⚠️ Please allow popups for this site!', 'error', 'Popup Blocked');
            console.log('To allow popups: Look for blocked popup icon in address bar and click "Always allow"');
        } else {
            handleFirebaseError(error, provider);
        }
    }
}

// Handle redirect result when page loads
async function handleRedirectResult() {
    console.log('Checking for redirect result...');
    
    // Check URL for redirect indicators
    const urlParams = new URLSearchParams(window.location.search);
    const hasCode = urlParams.has('code');
    const hasState = urlParams.has('state');
    const hasError = urlParams.has('error');
    console.log('URL params - code:', hasCode, 'state:', hasState, 'error:', hasError);
    console.log('Current URL:', window.location.href);
    console.log('Full URL search:', window.location.search);
    
    // Check if user is already signed in (session persistence)
    const currentUser = auth.currentUser;
    console.log('Current user from auth:', currentUser);
    
    if (currentUser) {
        console.log('User already signed in via session:', currentUser);
        return true;
    }
    
    // Check for OAuth errors in URL
    if (hasError) {
        const errorDesc = urlParams.get('error_description') || 'Unknown error';
        console.error('OAuth error in URL:', urlParams.get('error'), errorDesc);
        showToast('Sign-in failed: ' + errorDesc, 'error');
        return false;
    }
    
    try {
        console.log('Calling getRedirectResult()...');
        const result = await auth.getRedirectResult();
        
        console.log('Redirect result received:', result);
        console.log('Result credential:', result ? result.credential : 'null');
        console.log('Result user:', result ? result.user : 'null');
        
        if (result && result.user) {
            console.log('Redirect result: User signed in!', result.user);
            showToast(`Welcome ${result.user.displayName || result.user.email}!`, 'success');
            return true;
        } else {
            console.log('No redirect result - this is a normal page load or redirect failed');
            return false;
        }
    } catch (error) {
        console.error('Redirect result error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        if (error.code !== 'auth/redirect-cancelled-by-user') {
            handleFirebaseError(error, 'redirect');
        }
        return false;
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
let authInitialized = false;

function initAuthStateListener() {
    console.log('Initializing auth state listener...');
    
    auth.onAuthStateChanged((user) => {
        console.log('Auth state changed:', user ? 'User signed in' : 'No user');
        
        if (user) {
            // User is signed in
            console.log('User details:', user.email, user.displayName);
            showDashboard(user);
        } else {
            // User is signed out
            showAuth();
        }
        
        // Hide loading screen after auth state is determined
        if (!authInitialized) {
            authInitialized = true;
            setTimeout(hideLoadingScreen, 500);
        }
    });
}

function showDashboard(user) {
    // Update user info in dashboard
    updateUserInfo(user);
    
    // Ensure all dashboard content is visible
    gsap.set('.stat-card, .dashboard-card, .dashboard-section', { opacity: 1, y: 0, x: 0 });
    
    // Animate transition
    gsap.to(elements.authContainer, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            elements.authContainer.style.display = 'none';
            elements.dashboardContainer.style.display = 'flex';
            
            // Ensure overview section is active and visible
            const overviewSection = document.getElementById('overview-section');
            if (overviewSection) {
                document.querySelectorAll('.dashboard-section').forEach(s => {
                    s.classList.remove('active');
                    s.style.display = 'none';
                });
                overviewSection.classList.add('active');
                overviewSection.style.display = 'flex';
                gsap.set(overviewSection, { opacity: 1 });
            }
            
            gsap.fromTo(elements.dashboardContainer,
                { opacity: 0 },
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
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
    
    // Update Analytics
    if (elements.analyticsSecurity) elements.analyticsSecurity.textContent = '98%';
    if (elements.analyticsMember) elements.analyticsMember.textContent = elements.memberSince.textContent;
    if (elements.analyticsLogin) elements.analyticsLogin.textContent = lastLoginText;
    if (elements.analyticsProvider) {
        const provider = user.providerData[0]?.providerId || 'email';
        elements.analyticsProvider.textContent = provider === 'password' ? 'Email' : 
                                                  provider === 'google.com' ? 'Google' : 
                                                  provider === 'github.com' ? 'GitHub' : provider;
    }
    
    // Start session timer
    startSessionTimer();
}

// Session timer for analytics
let sessionStartTime = Date.now();
let sessionTimerInterval;

function startSessionTimer() {
    sessionStartTime = Date.now();
    if (sessionTimerInterval) clearInterval(sessionTimerInterval);
    
    sessionTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const hours = Math.floor(minutes / 60);
        
        let timeText;
        if (hours > 0) {
            timeText = `${hours}h ${minutes % 60}m`;
        } else {
            timeText = `${minutes}m`;
        }
        
        if (elements.analyticsSession) {
            elements.analyticsSession.textContent = timeText;
        }
    }, 60000); // Update every minute
}

function animateDashboardElements() {
    // Set all elements to fully visible immediately - no opacity animations
    gsap.set('.stat-card, .dashboard-card', { 
        opacity: 1, 
        y: 0,
        clearProps: 'transform' 
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
    
    // Hide current section
    currentSection.classList.remove('active');
    currentSection.style.display = 'none';
    
    // Show target section
    targetSection.classList.add('active');
    targetSection.style.display = 'flex';
    
    // Scroll to top after a slight delay to ensure section is rendered
    setTimeout(() => {
        const mainContent = document.querySelector('.dashboard-main');
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }, 10);
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
    // Logout button (sidebar)
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Mobile logout button
    if (elements.mobileLogoutBtn) {
        elements.mobileLogoutBtn.addEventListener('click', handleLogout);
    }
    
    // Save settings
    if (elements.saveSettings) {
        elements.saveSettings.addEventListener('click', handleSaveSettings);
    }
    
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
