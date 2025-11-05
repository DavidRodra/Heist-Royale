// User Activity Tracker for Arcane Games
// Tracks all user interactions for commercial analytics

class UserActivityTracker {
    constructor() {
        this.init();
    }

    init() {
        // Initialize activity logs storage
        if (!localStorage.getItem('activity_logs')) {
            localStorage.setItem('activity_logs', JSON.stringify([]));
        }
        if (!localStorage.getItem('login_logs')) {
            localStorage.setItem('login_logs', JSON.stringify([]));
        }
        if (!localStorage.getItem('transaction_logs')) {
            localStorage.setItem('transaction_logs', JSON.stringify([]));
        }
    }

    // Track user login
    trackLogin(userId, email, method = 'email') {
        const loginLog = {
            id: 'login_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            userId: userId,
            email: email,
            method: method, // 'email' or 'phone'
            timestamp: new Date().toISOString(),
            ipAddress: this.getIPAddress(), // Will be 'unknown' in browser, but structure ready
            userAgent: navigator.userAgent,
            success: true
        };

        const loginLogs = JSON.parse(localStorage.getItem('login_logs') || '[]');
        loginLogs.push(loginLog);
        
        // Keep only last 1000 logins to prevent storage bloat
        if (loginLogs.length > 1000) {
            loginLogs.shift();
        }
        
        localStorage.setItem('login_logs', JSON.stringify(loginLogs));
        return loginLog;
    }

    // Track failed login attempt
    trackFailedLogin(email, method = 'email', reason = 'invalid_credentials') {
        const loginLog = {
            id: 'login_failed_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            userId: null,
            email: email,
            method: method,
            timestamp: new Date().toISOString(),
            ipAddress: this.getIPAddress(),
            userAgent: navigator.userAgent,
            success: false,
            reason: reason
        };

        const loginLogs = JSON.parse(localStorage.getItem('login_logs') || '[]');
        loginLogs.push(loginLog);
        
        if (loginLogs.length > 1000) {
            loginLogs.shift();
        }
        
        localStorage.setItem('login_logs', JSON.stringify(loginLogs));
        return loginLog;
    }

    // Track transaction
    trackTransaction(transaction) {
        const transactionLog = {
            id: transaction.id || 'tx_' + Date.now(),
            userId: transaction.userId || transaction.user_id,
            type: transaction.type, // 'deposit', 'withdrawal', 'bet', 'win'
            amount: transaction.amount,
            currency: transaction.currency || 'USD',
            status: transaction.status || 'completed',
            paymentMethod: transaction.paymentMethod || transaction.payment_method,
            gameId: transaction.gameId || transaction.game_id,
            timestamp: transaction.createdAt || transaction.created_at || new Date().toISOString()
        };

        const transactionLogs = JSON.parse(localStorage.getItem('transaction_logs') || '[]');
        transactionLogs.push(transactionLog);
        
        if (transactionLogs.length > 1000) {
            transactionLogs.shift();
        }
        
        localStorage.setItem('transaction_logs', JSON.stringify(transactionLogs));
        return transactionLog;
    }

    // Track general activity
    trackActivity(activityType, details = {}) {
        const activityLog = {
            id: 'activity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: activityType, // 'game_played', 'page_view', 'button_click', etc.
            userId: details.userId || null,
            details: details,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            userAgent: navigator.userAgent
        };

        const activityLogs = JSON.parse(localStorage.getItem('activity_logs') || '[]');
        activityLogs.push(activityLog);
        
        if (activityLogs.length > 1000) {
            activityLogs.shift();
        }
        
        localStorage.setItem('activity_logs', JSON.stringify(activityLogs));
        return activityLog;
    }

    // Get login analytics
    getLoginAnalytics(dateRange = 'today') {
        const loginLogs = JSON.parse(localStorage.getItem('login_logs') || '[]');
        const now = new Date();
        let startDate;

        switch(dateRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'yesterday':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }

        const filteredLogs = loginLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= startDate && log.success === true;
        });

        const emailLogins = filteredLogs.filter(log => log.method === 'email').length;
        const phoneLogins = filteredLogs.filter(log => log.method === 'phone').length;
        const totalLogins = filteredLogs.length;
        const uniqueUsers = [...new Set(filteredLogs.map(log => log.userId))].length;

        // Get yesterday's data for comparison
        const yesterdayStart = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
        const yesterdayEnd = startDate;
        const yesterdayLogs = loginLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= yesterdayStart && logDate < yesterdayEnd && log.success === true;
        });
        const yesterdayEmail = yesterdayLogs.filter(log => log.method === 'email').length;
        const yesterdayPhone = yesterdayLogs.filter(log => log.method === 'phone').length;
        const yesterdayTotal = yesterdayLogs.length;

        // Calculate peak login hour
        const hourCounts = {};
        filteredLogs.forEach(log => {
            const hour = new Date(log.timestamp).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        const peakHour = Object.keys(hourCounts).reduce((a, b) => 
            hourCounts[a] > hourCounts[b] ? a : b, '0'
        ) || '0';

        // Calculate success rate
        const allTodayLogs = loginLogs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= startDate;
        });
        const successCount = allTodayLogs.filter(log => log.success === true).length;
        const successRate = allTodayLogs.length > 0 ? (successCount / allTodayLogs.length * 100) : 0;

        // Calculate returning users
        const userLoginCounts = {};
        filteredLogs.forEach(log => {
            if (log.userId) {
                userLoginCounts[log.userId] = (userLoginCounts[log.userId] || 0) + 1;
            }
        });
        const returningUsers = Object.values(userLoginCounts).filter(count => count > 1).length;

        return {
            emailLoginsToday: emailLogins,
            phoneLoginsToday: phoneLogins,
            totalLoginsToday: totalLogins,
            uniqueUsersToday: uniqueUsers,
            returningUsers: returningUsers,
            peakLoginHour: peakHour + ':00',
            loginSuccessRate: Math.round(successRate),
            emailChange: yesterdayEmail > 0 ? (((emailLogins - yesterdayEmail) / yesterdayEmail) * 100).toFixed(1) : '0',
            phoneChange: yesterdayPhone > 0 ? (((phoneLogins - yesterdayPhone) / yesterdayPhone) * 100).toFixed(1) : '0',
            totalChange: yesterdayTotal > 0 ? (((totalLogins - yesterdayTotal) / yesterdayTotal) * 100).toFixed(1) : '0'
        };
    }

    // Get transaction analytics
    getTransactionAnalytics(dateRange = 'today') {
        const transactionLogs = JSON.parse(localStorage.getItem('transaction_logs') || '[]');
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        
        // Combine both sources
        const allTransactions = [...transactionLogs, ...transactions];
        
        const now = new Date();
        let startDate;

        switch(dateRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'yesterday':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }

        const filtered = allTransactions.filter(t => {
            const txDate = new Date(t.timestamp || t.createdAt || t.created_at);
            return txDate >= startDate && (t.status === 'completed' || !t.status);
        });

        const deposits = filtered.filter(t => t.type === 'deposit');
        const withdrawals = filtered.filter(t => t.type === 'withdrawal');
        const bets = filtered.filter(t => t.type === 'bet');
        const wins = filtered.filter(t => t.type === 'win');

        const totalDeposits = deposits.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        const totalWithdrawals = withdrawals.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        const totalBets = bets.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        const netProfit = totalDeposits - totalWithdrawals - totalBets + wins.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        return {
            totalDeposits: totalDeposits,
            totalWithdrawals: totalWithdrawals,
            totalBets: totalBets,
            netProfit: netProfit,
            depositCount: deposits.length,
            withdrawalCount: withdrawals.length,
            betCount: bets.length,
            winCount: wins.length,
            totalTransactions: filtered.length
        };
    }

    // Helper: Get IP address (simplified - will be 'unknown' in browser)
    getIPAddress() {
        // In a real implementation, this would come from server-side
        // For now, return 'unknown' as browser can't access real IP
        return 'unknown';
    }
}

// Initialize tracker
const activityTracker = new UserActivityTracker();

// Make it globally available
window.activityTracker = activityTracker;

