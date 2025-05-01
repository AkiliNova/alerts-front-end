// Check if user is authenticated
function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// Add token to API requests
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

// Handle logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

// Verify token is still valid
async function verifyToken() {
    try {
        const response = await fetch('/auth/verify', {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            logout();
            return false;
        }
        return true;
    } catch (error) {
        logout();
        return false;
    }
} 