// Database initialization script for Casino Max
// This script initializes the localStorage database with sample data

class DatabaseInit {
    constructor() {
        this.init();
    }

    init() {
        // Initialize users if not exists
        if (!localStorage.getItem('users')) {
            this.initUsers();
        }

        // Initialize games if not exists
        if (!localStorage.getItem('games')) {
            this.initGames();
        }

        // Initialize transactions if not exists
        if (!localStorage.getItem('transactions')) {
            this.initTransactions();
        }

        // Initialize promotions if not exists
        if (!localStorage.getItem('promotions')) {
            this.initPromotions();
        }

        // Initialize security logs if not exists
        if (!localStorage.getItem('security_logs')) {
            this.initSecurityLogs();
        }

        // Initialize user achievements if not exists
        if (!localStorage.getItem('user_achievements')) {
            this.initUserAchievements();
        }

        console.log('Database initialized successfully');
    }

    initUsers() {
        // Hash passwords using the same method as the security utils
        const hashPassword = (password) => {
            let hash = 0;
            for (let i = 0; i < password.length; i++) {
                const char = password.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return Math.abs(hash).toString(16);
        };

        const users = [
            {
                id: 'admin-001',
                email: 'admin@casinomax.com',
                password: hashPassword('admin123'),
                firstName: 'Admin',
                lastName: 'User',
                country: 'US',
                currency: 'USD',
                dateOfBirth: '1990-01-01',
                balance: 10000.00,
                isActive: true,
                createdAt: new Date().toISOString(),
                lastLogin: null,
                emailVerified: true,
                twoFactorEnabled: false
            },
            {
                id: 'demo-001',
                email: 'demo@casinomax.com',
                password: hashPassword('demo123'),
                firstName: 'Demo',
                lastName: 'User',
                country: 'US',
                currency: 'USD',
                dateOfBirth: '1995-05-15',
                balance: 1000.00,
                isActive: true,
                createdAt: new Date().toISOString(),
                lastLogin: null,
                emailVerified: true,
                twoFactorEnabled: false
            }
        ];

        localStorage.setItem('users', JSON.stringify(users));
    }

    initGames() {
        const games = [
            {
                id: 'book-of-ra',
                name: 'Book of Ra',
                description: 'Ancient Egyptian slot adventure with mystical treasures and golden rewards',
                category: 'slots',
                provider: 'CasinoMax',
                rtp: 96.50,
                minBet: 0.10,
                maxBet: 100.00,
                isActive: true,
                thumbnailUrl: '/images/book-of-ra-thumbnail.jpg',
                gameUrl: 'book-of-ra-game.html',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'blackjack',
                name: 'Blackjack',
                description: 'Classic card game where skill meets luck. Beat the dealer to win big!',
                category: 'table',
                provider: 'CasinoMax',
                rtp: 99.50,
                minBet: 1.00,
                maxBet: 500.00,
                isActive: true,
                thumbnailUrl: '/images/blackjack-thumbnail.jpg',
                gameUrl: 'blackjack-game.html',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'ocean-hunter',
                name: 'Ocean Hunter',
                description: 'Dive deep into the ocean and hunt for treasures with your cannon',
                category: 'arcade',
                provider: 'CasinoMax',
                rtp: 97.20,
                minBet: 0.50,
                maxBet: 200.00,
                isActive: true,
                thumbnailUrl: '/images/ocean-hunter-thumbnail.jpg',
                gameUrl: 'fish-game.html',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('games', JSON.stringify(games));
    }

    initTransactions() {
        const transactions = [
            {
                id: 'tx-001',
                userId: 'demo-001',
                type: 'bonus',
                amount: 1000.00,
                currency: 'USD',
                status: 'completed',
                description: 'Welcome bonus',
                createdAt: new Date().toISOString(),
                completedAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    initPromotions() {
        const promotions = [
            {
                id: 'welcome-bonus',
                name: 'Welcome Bonus',
                description: '200% bonus up to $2000 on your first deposit',
                type: 'welcome_bonus',
                bonusPercentage: 200.00,
                minDeposit: 10.00,
                maxBonus: 2000.00,
                wageringRequirement: 35.00,
                isActive: true,
                validFrom: new Date().toISOString(),
                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
                createdAt: new Date().toISOString()
            },
            {
                id: 'deposit-bonus',
                name: 'Weekly Deposit Bonus',
                description: '50% bonus up to $500 on deposits over $20',
                type: 'deposit_bonus',
                bonusPercentage: 50.00,
                minDeposit: 20.00,
                maxBonus: 500.00,
                wageringRequirement: 25.00,
                isActive: true,
                validFrom: new Date().toISOString(),
                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date().toISOString()
            },
            {
                id: 'free-spins',
                name: 'Free Spins Friday',
                description: '50 free spins on Book of Ra every Friday',
                type: 'free_spins',
                bonusAmount: 0.00,
                freeSpins: 50,
                minDeposit: 0.00,
                maxBonus: 0.00,
                wageringRequirement: 0.00,
                isActive: true,
                validFrom: new Date().toISOString(),
                validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('promotions', JSON.stringify(promotions));
    }

    initSecurityLogs() {
        const securityLogs = [
            {
                id: 'log-001',
                userId: null,
                eventType: 'system_init',
                eventDescription: 'Database initialized',
                ipAddress: '127.0.0.1',
                userAgent: navigator.userAgent,
                details: { version: '1.0.0' },
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    }

    initUserAchievements() {
        const achievements = [
            {
                id: 'ach-001',
                name: 'First Deposit',
                description: 'Make your first deposit',
                type: 'deposit',
                rewardAmount: 10.00,
                requirement: 1,
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'ach-002',
                name: 'High Roller',
                description: 'Place a bet of $100 or more',
                type: 'bet',
                rewardAmount: 25.00,
                requirement: 100.00,
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'ach-003',
                name: 'Lucky Streak',
                description: 'Win 5 games in a row',
                type: 'win_streak',
                rewardAmount: 50.00,
                requirement: 5,
                isActive: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'ach-004',
                name: 'Jackpot Hunter',
                description: 'Win a jackpot of $1000 or more',
                type: 'jackpot',
                rewardAmount: 100.00,
                requirement: 1000.00,
                isActive: true,
                createdAt: new Date().toISOString()
            }
        ];

        localStorage.setItem('achievements', JSON.stringify(achievements));
        localStorage.setItem('user_achievements', JSON.stringify([]));
    }

    // Utility methods for database operations
    static getUserById(userId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        return users.find(user => user.id === userId);
    }

    static getGameById(gameId) {
        const games = JSON.parse(localStorage.getItem('games') || '[]');
        return games.find(game => game.id === gameId);
    }

    static getTransactionsByUserId(userId) {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        return transactions.filter(transaction => transaction.userId === userId);
    }

    static addTransaction(transaction) {
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }

    static updateUserBalance(userId, newBalance) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            users[userIndex].balance = newBalance;
            users[userIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('users', JSON.stringify(users));
        }
    }

    static addSecurityLog(event) {
        const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
        logs.push({
            id: 'log-' + Date.now(),
            ...event,
            createdAt: new Date().toISOString()
        });
        
        // Keep only last 1000 logs
        if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
        }
        
        localStorage.setItem('security_logs', JSON.stringify(logs));
    }

    static getActivePromotions() {
        const promotions = JSON.parse(localStorage.getItem('promotions') || '[]');
        const now = new Date();
        return promotions.filter(promo => 
            promo.isActive && 
            new Date(promo.validFrom) <= now && 
            new Date(promo.validUntil) >= now
        );
    }

    static getUserAchievements(userId) {
        const userAchievements = JSON.parse(localStorage.getItem('user_achievements') || '[]');
        return userAchievements.filter(achievement => achievement.userId === userId);
    }

    static addUserAchievement(userId, achievementId) {
        const userAchievements = JSON.parse(localStorage.getItem('user_achievements') || '[]');
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        const achievement = achievements.find(a => a.id === achievementId);
        
        if (achievement && !userAchievements.find(ua => ua.userId === userId && ua.achievementId === achievementId)) {
            userAchievements.push({
                id: 'ua-' + Date.now(),
                userId: userId,
                achievementId: achievementId,
                achievementName: achievement.name,
                description: achievement.description,
                rewardAmount: achievement.rewardAmount,
                unlockedAt: new Date().toISOString()
            });
            
            localStorage.setItem('user_achievements', JSON.stringify(userAchievements));
            
            // Add reward to user balance
            const user = this.getUserById(userId);
            if (user) {
                this.updateUserBalance(userId, user.balance + achievement.rewardAmount);
            }
        }
    }
}

// Initialize database when script loads
document.addEventListener('DOMContentLoaded', function() {
    new DatabaseInit();
});

// Export for use in other scripts
window.DatabaseInit = DatabaseInit;
