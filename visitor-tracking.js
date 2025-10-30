// Visitor Tracking System for Casino Max
// This script tracks visitor analytics and stores data in localStorage

class VisitorTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.pageViews = 0;
        this.init();
    }

    init() {
        // Track page view
        this.trackPageView();
        
        // Track session time on page unload
        window.addEventListener('beforeunload', () => {
            this.trackSessionTime();
        });

        // Track user interactions
        this.trackInteractions();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    trackPageView() {
        const visitorData = this.getVisitorData();
        
        // Reset counters for production launch
        visitorData.totalVisitors = 0;
        visitorData.pageViews = 0;
        this.pageViews = 0;

        // Reset unique visitors for production launch
        visitorData.uniqueVisitors = 0;

        // Track traffic source
        this.trackTrafficSource();

        // Track geographic location (simplified)
        this.trackGeographicLocation();

        // Track device and browser info
        this.trackDeviceInfo();

        // Update daily visitor data
        this.updateDailyVisitorData();

        // Save data
        this.saveVisitorData(visitorData);
    }

    trackSessionTime() {
        const sessionTime = Math.floor((Date.now() - this.startTime) / 1000); // in seconds
        const visitorData = this.getVisitorData();
        
        // Update average session time
        const totalSessions = visitorData.totalSessions || 0;
        const currentAvg = visitorData.avgSessionTime || 0;
        visitorData.avgSessionTime = Math.floor(((currentAvg * totalSessions) + sessionTime) / (totalSessions + 1));
        visitorData.totalSessions = totalSessions + 1;

        // Calculate bounce rate (simplified)
        if (this.pageViews <= 1) {
            visitorData.bounceRate = ((visitorData.bounceRate || 0) + 1) / 2;
        }

        this.saveVisitorData(visitorData);
    }

    trackTrafficSource() {
        const visitorData = this.getVisitorData();
        const referrer = document.referrer;
        
        if (!referrer) {
            visitorData.trafficSources = visitorData.trafficSources || {};
            visitorData.trafficSources.direct = (visitorData.trafficSources.direct || 0) + 1;
        } else if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo')) {
            visitorData.trafficSources = visitorData.trafficSources || {};
            visitorData.trafficSources.search = (visitorData.trafficSources.search || 0) + 1;
        } else if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('instagram')) {
            visitorData.trafficSources = visitorData.trafficSources || {};
            visitorData.trafficSources.social = (visitorData.trafficSources.social || 0) + 1;
        } else {
            visitorData.trafficSources = visitorData.trafficSources || {};
            visitorData.trafficSources.referral = (visitorData.trafficSources.referral || 0) + 1;
        }

        this.saveVisitorData(visitorData);
    }

    trackGeographicLocation() {
        // In a real application, you would use a geolocation API
        // For demo purposes, we'll simulate geographic distribution
        const visitorData = this.getVisitorData();
        const countries = ['us', 'uk', 'ca', 'au', 'other'];
        const weights = [35, 20, 15, 10, 20]; // percentages
        
        const random = Math.random() * 100;
        let cumulative = 0;
        let selectedCountry = 'other';
        
        for (let i = 0; i < countries.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                selectedCountry = countries[i];
                break;
            }
        }

        visitorData.geographic = visitorData.geographic || {};
        visitorData.geographic[selectedCountry] = (visitorData.geographic[selectedCountry] || 0) + 1;

        this.saveVisitorData(visitorData);
    }

    trackDeviceInfo() {
        const visitorData = this.getVisitorData();
        const userAgent = navigator.userAgent;
        
        // Track device type
        visitorData.deviceTypes = visitorData.deviceTypes || {};
        if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
            if (/iPad/.test(userAgent)) {
                visitorData.deviceTypes.tablet = (visitorData.deviceTypes.tablet || 0) + 1;
            } else {
                visitorData.deviceTypes.mobile = (visitorData.deviceTypes.mobile || 0) + 1;
            }
        } else {
            visitorData.deviceTypes.desktop = (visitorData.deviceTypes.desktop || 0) + 1;
        }

        // Track browser
        visitorData.browsers = visitorData.browsers || {};
        if (userAgent.includes('Chrome')) {
            visitorData.browsers.chrome = (visitorData.browsers.chrome || 0) + 1;
        } else if (userAgent.includes('Safari')) {
            visitorData.browsers.safari = (visitorData.browsers.safari || 0) + 1;
        } else if (userAgent.includes('Firefox')) {
            visitorData.browsers.firefox = (visitorData.browsers.firefox || 0) + 1;
        } else if (userAgent.includes('Edge')) {
            visitorData.browsers.edge = (visitorData.browsers.edge || 0) + 1;
        }

        this.saveVisitorData(visitorData);
    }

    updateDailyVisitorData() {
        const visitorData = this.getVisitorData();
        const today = new Date().toISOString().split('T')[0];
        
        visitorData.dailyVisitors = visitorData.dailyVisitors || [];
        
        // Find today's data
        let todayData = visitorData.dailyVisitors.find(d => d.date === today);
        if (!todayData) {
            todayData = {
                date: today,
                visitors: 0,
                pageViews: 0,
                uniqueVisitors: 0
            };
            visitorData.dailyVisitors.push(todayData);
        }
        
        todayData.visitors += 1;
        todayData.pageViews += 1;
        
        // Keep only last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        visitorData.dailyVisitors = visitorData.dailyVisitors.filter(d => 
            new Date(d.date) >= thirtyDaysAgo
        );

        this.saveVisitorData(visitorData);
    }

    trackInteractions() {
        // Track clicks on important elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, a, .game-card, .nav-item')) {
                this.trackEvent('click', e.target.textContent || e.target.className);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackEvent('form_submit', e.target.id || 'unknown_form');
        });

        // Track game plays
        document.addEventListener('click', (e) => {
            if (e.target.closest('.game-card') || e.target.closest('[onclick*="playGame"]')) {
                this.trackEvent('game_play', 'game_clicked');
            }
        });
    }

    trackEvent(eventType, eventData) {
        const visitorData = this.getVisitorData();
        visitorData.events = visitorData.events || [];
        visitorData.events.push({
            type: eventType,
            data: eventData,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId
        });

        // Keep only last 100 events
        if (visitorData.events.length > 100) {
            visitorData.events = visitorData.events.slice(-100);
        }

        this.saveVisitorData(visitorData);
    }

    getVisitorData() {
        return JSON.parse(localStorage.getItem('visitor_analytics') || '{}');
    }

    saveVisitorData(data) {
        localStorage.setItem('visitor_analytics', JSON.stringify(data));
    }

    // Method to simulate real-time visitors (for demo)
    simulateRealtimeVisitors() {
        const visitorData = this.getVisitorData();
        const pages = ['Homepage', 'Login Page', 'Registration', 'Book of Ra Game', 'Blackjack', 'Ocean Hunter'];
        const locations = ['🇺🇸 New York', '🇬🇧 London', '🇨🇦 Toronto', '🇦🇺 Sydney', '🇩🇪 Berlin', '🇫🇷 Paris'];
        
        visitorData.realtimeVisitors = visitorData.realtimeVisitors || [];
        
        // Add a new visitor every 30 seconds (for demo)
        setInterval(() => {
            const newVisitor = {
                id: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
                page: pages[Math.floor(Math.random() * pages.length)],
                time: 'just now',
                location: locations[Math.floor(Math.random() * locations.length)],
                timestamp: Date.now()
            };
            
            visitorData.realtimeVisitors.unshift(newVisitor);
            
            // Keep only last 10 visitors
            if (visitorData.realtimeVisitors.length > 10) {
                visitorData.realtimeVisitors = visitorData.realtimeVisitors.slice(0, 10);
            }
            
            this.saveVisitorData(visitorData);
        }, 30000); // 30 seconds
    }
}

// Initialize visitor tracking when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const tracker = new VisitorTracker();
    
    // Start simulating real-time visitors (for demo purposes)
    tracker.simulateRealtimeVisitors();
    
    // Make tracker globally available for admin panel
    window.visitorTracker = tracker;
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisitorTracker;
}
