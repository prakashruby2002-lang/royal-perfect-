// Authentication Functions - Simple Password Protection

// Check if admin is logged in
function isAdminLoggedIn() {
    return sessionStorage.getItem('rp_admin_token') === 'authenticated';
}

// Admin login
function adminLogin(password) {
    const correctPassword = 'RoyalPerfect2024'; // Default password - update in settings
    
    if (password === correctPassword) {
        sessionStorage.setItem('rp_admin_token', 'authenticated');
        console.log('[v0] Admin logged in');
        return true;
    }
    
    console.warn('[v0] Invalid admin password');
    return false;
}

// Admin logout
function adminLogout() {
    sessionStorage.removeItem('rp_admin_token');
    console.log('[v0] Admin logged out');
    window.location.href = 'admin.html';
}

// Check admin access on page load
function checkAdminAccess() {
    if (window.location.pathname.includes('admin.html')) {
        if (!isAdminLoggedIn()) {
            const password = prompt('Enter admin password:');
            if (!password || !adminLogin(password)) {
                alert('Invalid password');
                window.location.href = 'index.html';
            }
        }
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', checkAdminAccess);

// Mock user login (can be expanded for full auth later)
let currentUser = null;

function loginUser(email, password) {
    // Mock login - stores user in session
    currentUser = { email, id: 'user_' + Date.now() };
    sessionStorage.setItem('rp_user', JSON.stringify(currentUser));
    console.log('[v0] User logged in:', email);
    return currentUser;
}

function logoutUser() {
    currentUser = null;
    sessionStorage.removeItem('rp_user');
    console.log('[v0] User logged out');
}

function getCurrentUser() {
    if (!currentUser) {
        const stored = sessionStorage.getItem('rp_user');
        if (stored) {
            currentUser = JSON.parse(stored);
        }
    }
    return currentUser;
}

// Open login modal
function openLogin() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h2>Login to Royal Perfect</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <form onsubmit="handleUserLogin(event)">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="login-email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="btn-primary">Login</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleUserLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    loginUser(email, password);
    showNotification('Logged in successfully');
    document.querySelector('.modal').remove();
    
    // Update UI
    const userBtn = document.querySelector('.user-btn');
    if (userBtn) {
        userBtn.textContent = 'Logout';
        userBtn.onclick = logoutUser;
    }
}
