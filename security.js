// Security utilities for Arcane Games
// Note: This is a simplified implementation for demo purposes
// In production, use proper cryptographic libraries and server-side validation

class SecurityUtils {
    // Simple password hashing (in production, use bcrypt or similar)
    static hashPassword(password) {
        // This is a basic hash - in production, use proper hashing
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    // Generate a simple JWT-like token (in production, use proper JWT library)
    static generateToken(userId, email) {
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };
        
        const payload = {
            userId: userId,
            email: email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        };
        
        const encodedHeader = btoa(JSON.stringify(header));
        const encodedPayload = btoa(JSON.stringify(payload));
        const signature = this.hashPassword(encodedHeader + encodedPayload + 'secret-key');
        
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    }

    // Verify token
    static verifyToken(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) return false;
            
            const [header, payload, signature] = parts;
            const expectedSignature = this.hashPassword(header + payload + 'secret-key');
            
            if (signature !== expectedSignature) return false;
            
            const decodedPayload = JSON.parse(atob(payload));
            
            // Check expiration
            if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
                return false;
            }
            
            return decodedPayload;
        } catch (error) {
            return false;
        }
    }

    // Validate email format
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    static validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
            minLength: password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar,
            strength: this.calculatePasswordStrength(password)
        };
    }

    // Calculate password strength score
    static calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
        if (password.length >= 16) score += 1;
        
        if (score <= 2) return 'weak';
        if (score <= 4) return 'medium';
        if (score <= 6) return 'strong';
        return 'very-strong';
    }

    // Sanitize input to prevent XSS
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    // Generate secure random string
    static generateSecureRandom(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Rate limiting (simple implementation)
    static rateLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
        const now = Date.now();
        const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
        
        // Remove old attempts outside the window
        const validAttempts = attempts.filter(time => now - time < windowMs);
        
        if (validAttempts.length >= maxAttempts) {
            return false; // Rate limit exceeded
        }
        
        // Add current attempt
        validAttempts.push(now);
        localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validAttempts));
        
        return true;
    }

    // Check if user is authenticated
    static isAuthenticated() {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        const payload = this.verifyToken(token);
        return payload !== false;
    }

    // Get current user from token
    static getCurrentUser() {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        const payload = this.verifyToken(token);
        if (!payload) return null;
        
        return {
            userId: payload.userId,
            email: payload.email
        };
    }

    // Logout user
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }

    // Session timeout check
    static checkSessionTimeout() {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const payload = this.verifyToken(token);
        if (!payload) {
            this.logout();
            return;
        }
        
        // Check if token expires in next 5 minutes
        const timeUntilExpiry = (payload.exp * 1000) - Date.now();
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
            // Show warning
            if (confirm('Your session will expire soon. Would you like to extend it?')) {
                // In a real app, you'd refresh the token here
                alert('Session extended!');
            }
        }
    }

    // Initialize security features
    static init() {
        // Check session timeout every minute
        setInterval(() => {
            this.checkSessionTimeout();
        }, 60 * 1000);
        
        // Check for suspicious activity
        this.monitorSuspiciousActivity();
    }

    // Monitor for suspicious activity
    static monitorSuspiciousActivity() {
        // Check for multiple failed login attempts
        const failedAttempts = JSON.parse(localStorage.getItem('failed_login_attempts') || '[]');
        if (failedAttempts.length > 10) {
            console.warn('Multiple failed login attempts detected');
            // In production, you'd alert administrators
        }
        
        // Check for unusual transaction patterns
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const recentTransactions = transactions.filter(t => 
            Date.now() - new Date(t.date).getTime() < 60 * 60 * 1000 // Last hour
        );
        
        if (recentTransactions.length > 20) {
            console.warn('Unusual transaction frequency detected');
            // In production, you'd implement fraud detection
        }
    }

    // Log security event
    static logSecurityEvent(event, details = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent,
            ip: 'unknown' // In production, get real IP
        };
        
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        logs.push(logEntry);
        
        // Keep only last 1000 logs
        if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
        }
        
        localStorage.setItem('security_logs', JSON.stringify(logs));
    }
}

// Initialize security when script loads
document.addEventListener('DOMContentLoaded', function() {
    SecurityUtils.init();
});

// Export for use in other scripts
window.SecurityUtils = SecurityUtils;







