// Arcane Games Webapp JavaScript

// Friend interaction functions - Define immediately at top level
function messageFriend(friendId) {
    console.log('=== MESSAGE FRIEND CALLED ===');
    console.log('Friend ID:', friendId);
    
    // Get friend name for display
    const friendNames = {
        'alice': 'Alice Johnson',
        'bob': 'Bob Smith', 
        'diana': 'Diana Prince'
    };
    
    const friendName = friendNames[friendId] || friendId;
    
    // Show immediate feedback
    alert(`Opening chat with ${friendName}!`);
    
    // Try to focus on the existing chat sidebar
    const chatSidebar = document.getElementById('chat-sidebar');
    if (chatSidebar) {
        chatSidebar.style.display = 'flex';
        chatSidebar.classList.remove('hidden');
        
        // Add a message to the chat
        const chatMessages = chatSidebar.querySelector('.chat-messages');
        if (chatMessages) {
            const messageElement = document.createElement('div');
            messageElement.className = 'chat-message';
            messageElement.innerHTML = `
                <div class="message-avatar ${friendId}-pro">${friendName.charAt(0)}</div>
                <div class="message-content">
                    <div class="message-header">
                        <span class="message-user">${friendName}</span>
                        <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div class="message-text">Hey! Let's chat!</div>
                </div>
            `;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    } else {
        alert('Chat sidebar not found!');
    }
}

function viewFriendProfile(friendId) {
    console.log('=== VIEW FRIEND PROFILE CALLED ===');
    console.log('Friend ID:', friendId);
    
    // Get friend name for display
    const friendNames = {
        'alice': 'Alice Johnson',
        'bob': 'Bob Smith',
        'diana': 'Diana Prince'
    };
    
    const friendName = friendNames[friendId] || friendId;
    
    // Show immediate feedback
    alert(`Loading ${friendName}'s profile...`);
    
    // Show profile in a simple alert for now
    const userData = getUserData(friendId, 'friend');
    alert(`${friendName}'s Profile:\n\nLevel: ${userData.level}\nBalance: $${userData.balance.toLocaleString()}\nStatus: ${userData.statusText}\nGames Played: ${userData.gamesPlayed}\nWin Rate: ${userData.winRate}%\nFriends: ${userData.friends}`);
}

function addFriend(userId) {
    console.log('=== ADD FRIEND CALLED ===');
    console.log('User ID:', userId);
    
    // Get current friends list
    const friendsList = JSON.parse(localStorage.getItem('friends') || '[]');
    
    // Check if already a friend
    if (friendsList.includes(userId)) {
        alert('This user is already your friend!');
        return;
    }
    
    // Add to friends list
    friendsList.push(userId);
    localStorage.setItem('friends', JSON.stringify(friendsList));
    
    // Reload community data to show updated friends list
    loadCommunityData();
    
    // Get user name from real users database
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => (u.id || u.email) === userId);
    const userName = user ? (user.name || user.firstName + ' ' + user.lastName || user.email) : userId;
    
    alert(`${userName} added as friend successfully!`);
}

function viewSuggestionProfile(userId) {
    console.log('=== VIEW SUGGESTION PROFILE CALLED ===');
    console.log('User ID:', userId);
    
    // Get user name from real users database
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => (u.id || u.email) === userId);
    const userName = user ? (user.name || user.firstName + ' ' + user.lastName || user.email) : userId;
    
    // Show profile in a simple alert for now
    const userData = getUserData(userId, 'suggestion');
    alert(`${userName}'s Profile:\n\nLevel: ${userData.level}\nBalance: $${userData.balance.toLocaleString()}\nStatus: ${userData.statusText}\nGames Played: ${userData.gamesPlayed}\nWin Rate: ${userData.winRate}%\nFriends: ${userData.friends}`);
}

// Helper function to get user data from real users database
function getUserData(userId, type) {
    // Get real users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId || u.email === userId || u.username === userId);
    
    if (user) {
        return {
            level: user.level || 1,
            balance: user.balance || 0,
            status: user.status || 'offline',
            statusText: user.status === 'online' ? 'Online' : 'Offline',
            gamesPlayed: user.gamesPlayed || 0,
            winRate: user.winRate || 0,
            friends: user.friends || 0
        };
    }
    
    // Return default if user not found
    return { level: 1, balance: 0, status: 'offline', statusText: 'Offline', gamesPlayed: 0, winRate: 0, friends: 0 };
}

// Function to handle friend request sending
function sendFriendRequest(button, friendName) {
    if (confirm('Send friend request to ' + friendName + '?')) {
        alert('Friend request sent to ' + friendName + '!');
        
        // Change button appearance
        button.innerHTML = '<i class="fas fa-check"></i> Request Sent';
        button.disabled = true;
        button.className = 'btn btn-sm btn-outline';
        
        // Store in localStorage to remember the state
        localStorage.setItem('friend_request_' + friendName.toLowerCase().replace(' ', '_'), 'sent');
    }
}

// Make functions globally available immediately
window.messageFriend = messageFriend;
window.viewFriendProfile = viewFriendProfile;
window.addFriend = addFriend;
window.viewSuggestionProfile = viewSuggestionProfile;
window.sendFriendRequest = sendFriendRequest;

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== PAGE LOADED ===');
    
    // Initialize the application
    initializeApp();
    
    // Initialize security
    if (typeof SecurityUtils !== 'undefined') {
        SecurityUtils.init();
    }
    
    // Check if user data exists (only from real logins)
    console.log('=== CHECKING USER DATA ===');
    
    let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    
    // Only show logged-in user if they have a valid token and email
    if (token && currentUser && currentUser.email) {
        // Verify user exists in users database (for real authentication)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(u => 
            (u.id && u.id === currentUser.id) || 
            (u.email && u.email === currentUser.email)
        );
        
        if (userExists) {
            console.log('Valid logged-in user found:', currentUser);
            showLoggedInUser(currentUser);
        } else {
            console.log('User not found in database, showing guest state');
            // Clear invalid user data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            showGuestState();
        }
    } else {
        console.log('No user logged in, showing guest state');
        showGuestState();
    }
    
    // Add event listener to logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Show home content by default
    setTimeout(() => {
        showHome();
    }, 500);
});

// Simple function to show logged-in user
function showLoggedInUser(user) {
    console.log('=== SHOWING LOGGED IN USER ===');
    console.log('User data:', user);
    
    // Get elements
    const userProfile = document.getElementById('userProfile');
    const authButtons = document.getElementById('authButtons');
    const userName = document.getElementById('userName');
    const userBalance = document.getElementById('userBalance');
    const userAvatar = document.getElementById('userAvatar');
    const topbarBrand = document.getElementById('topbarBrand');
    const topbarBalance = document.getElementById('topbarBalance');
    
    console.log('Elements found:');
    console.log('- userProfile:', !!userProfile);
    console.log('- authButtons:', !!authButtons);
    console.log('- userName:', !!userName);
    console.log('- userBalance:', !!userBalance);
    console.log('- userAvatar:', !!userAvatar);
    console.log('- topbarBrand:', !!topbarBrand);
    console.log('- topbarBalance:', !!topbarBalance);
    
    // Show user profile, hide auth buttons
    if (userProfile) {
        userProfile.style.display = 'flex';
        console.log('✅ User profile shown');
    }
    
    if (authButtons) {
        authButtons.style.display = 'none';
        console.log('✅ Auth buttons hidden');
    }
    
    // Get display name (prioritize full name, then firstName + lastName, then email)
    const displayName = user.name || 
                       (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '') ||
                       (user.firstName ? user.firstName : '') ||
                       user.email || 
                       'User';
    
    // Update user info in sidebar
    if (userName) {
        userName.textContent = displayName;
        console.log('✅ User name updated to:', displayName);
    }
    
    if (userBalance) {
        const balance = user.balance || 0;
        userBalance.textContent = `$${balance.toLocaleString()}`;
        console.log('✅ User balance updated to:', balance);
    }
    
    if (userAvatar) {
        const name = user.name || user.firstName || user.email || 'U';
        userAvatar.textContent = name.charAt(0).toUpperCase();
        console.log('✅ User avatar updated to:', name.charAt(0).toUpperCase());
    }
    
    // Update topbar with user's name
    if (topbarBrand) {
        topbarBrand.textContent = displayName;
        console.log('✅ Topbar brand updated to:', displayName);
    }
    
    // Update topbar balance
    if (topbarBalance) {
        const balance = user.balance || 0;
        topbarBalance.textContent = `$${balance.toLocaleString()}`;
        console.log('✅ Topbar balance updated to:', balance);
    }
    
    console.log('✅ User profile display completed');
}

// Function to show guest state
function showGuestState() {
    console.log('=== SHOWING GUEST STATE ===');
    
    // Reset topbar to default
    const topbarBrand = document.getElementById('topbarBrand');
    const topbarBalance = document.getElementById('topbarBalance');
    if (topbarBrand) {
        topbarBrand.textContent = 'Arcane Games';
    }
    if (topbarBalance) {
        topbarBalance.textContent = '$0.00';
    }
    
    // Reset sidebar user info
    const userName = document.getElementById('userName');
    const userBalance = document.getElementById('userBalance');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userName) {
        userName.textContent = 'Guest';
    }
    if (userBalance) {
        userBalance.textContent = '$0.00';
    }
    if (userAvatar) {
        userAvatar.textContent = 'G';
    }
    
    const userProfile = document.getElementById('userProfile');
    const authButtons = document.getElementById('authButtons');
    
    if (userProfile) {
        userProfile.style.display = 'none';
        console.log('✅ User profile hidden');
    }
    
    if (authButtons) {
        authButtons.style.display = 'block';
        console.log('✅ Auth buttons shown');
    }
}

// Function to update user display when someone logs in
function updateUserDisplay(userData) {
    console.log('=== UPDATING USER DISPLAY ===');
    console.log('New user data:', userData);
    
    // Update localStorage with new user data
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', 'user_token_' + Date.now());
    
    // Show the new user
    showLoggedInUser(userData);
}

// Make updateUserDisplay available globally
window.updateUserDisplay = updateUserDisplay;

// Universal login function - works for any user
function loginUser(userInfo) {
    console.log('=== LOGIN USER ===');
    console.log('User info:', userInfo);
    
    // Extract user data from various possible formats
    const userData = {
        id: userInfo.id || 'user_' + Date.now(),
        email: userInfo.email || userInfo.username || userInfo.login,
        name: userInfo.name || userInfo.fullName || userInfo.displayName || userInfo.username,
        balance: userInfo.balance || userInfo.money || 1000,
        firstName: userInfo.firstName || userInfo.first_name || (userInfo.name ? userInfo.name.split(' ')[0] : ''),
        lastName: userInfo.lastName || userInfo.last_name || (userInfo.name ? userInfo.name.split(' ').slice(1).join(' ') : ''),
        username: userInfo.username || userInfo.login || userInfo.email
    };
    
    console.log('Processed user data:', userData);
    
    // Store in multiple localStorage keys for compatibility
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('loggedInUser', JSON.stringify(userData));
    localStorage.setItem('token', 'auth_token_' + Date.now());
    
    // Track login activity
    if (window.activityTracker) {
        window.activityTracker.trackLogin(
            userData.id,
            userData.email,
            userData.email.includes('@') ? 'email' : 'phone'
        );
    }
    
    // Update display immediately
    showLoggedInUser(userData);
    
    console.log('✅ User logged in successfully:', userData.name);
    return userData;
}

// Function to manually set user data for testing
function setUserData(name, email, balance = 1000) {
    console.log('=== SETTING USER DATA ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Balance:', balance);
    
    const userData = {
        id: 'user_' + Date.now(),
        email: email,
        name: name,
        balance: balance,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ')[1] || ''
    };
    
    // Use the universal login function
    loginUser(userData);
}

// Test accounts for quick testing
const testAccounts = {
    'alice@example.com': {
        password: 'password123',
        name: 'Alice Johnson',
        balance: 1500,
        firstName: 'Alice',
        lastName: 'Johnson'
    },
    'bob@example.com': {
        password: 'password123',
        name: 'Bob Smith',
        balance: 2000,
        firstName: 'Bob',
        lastName: 'Smith'
    },
    'charlie@example.com': {
        password: 'password123',
        name: 'Charlie Brown',
        balance: 3000,
        firstName: 'Charlie',
        lastName: 'Brown'
    },
    'diana@example.com': {
        password: 'password123',
        name: 'Diana Prince',
        balance: 2500,
        firstName: 'Diana',
        lastName: 'Prince'
    },
    'eve@example.com': {
        password: 'password123',
        name: 'Eve Wilson',
        balance: 1800,
        firstName: 'Eve',
        lastName: 'Wilson'
    }
};

// Function to login with email and password
function loginWithCredentials(email, password) {
    console.log('=== LOGIN WITH CREDENTIALS ===');
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Check if account exists
    if (testAccounts[email]) {
        const account = testAccounts[email];
        
        // Check password
        if (account.password === password) {
            console.log('✅ Login successful for:', account.name);
            
            // Create user data
            const userData = {
                id: 'user_' + Date.now(),
                email: email,
                name: account.name,
                balance: account.balance,
                firstName: account.firstName,
                lastName: account.lastName
            };
            
            // Login the user
            loginUser(userData);
            return { success: true, user: userData };
        } else {
            console.log('❌ Invalid password');
            return { success: false, error: 'Invalid password' };
        }
    } else {
        console.log('❌ Account not found');
        return { success: false, error: 'Account not found' };
    }
}

// Function to show all test accounts
function showTestAccounts() {
    console.log('=== TEST ACCOUNTS ===');
    console.log('Email | Password | Name | Balance');
    console.log('------|----------|------|--------');
    
    for (let email in testAccounts) {
        const account = testAccounts[email];
        console.log(`${email} | ${account.password} | ${account.name} | $${account.balance}`);
    }
    
    console.log('\n=== QUICK LOGIN EXAMPLES ===');
    console.log('loginWithCredentials("alice@example.com", "password123")');
    console.log('loginWithCredentials("bob@example.com", "password123")');
    console.log('loginWithCredentials("charlie@example.com", "password123")');
}

// Function to refresh user profile display
function refreshUserProfile() {
    console.log('=== REFRESHING USER PROFILE ===');
    
    // Check all possible localStorage keys for user data
    const allKeys = Object.keys(localStorage);
    console.log('All localStorage keys:', allKeys);
    
    let foundUser = null;
    
    // Look for user data in any key
    for (let key of allKeys) {
        const data = localStorage.getItem(key);
        try {
            const parsed = JSON.parse(data);
            if (parsed && (parsed.name || parsed.email || parsed.username) && (parsed.balance !== undefined || parsed.money !== undefined)) {
                console.log('✅ Found user data in key:', key, parsed);
                foundUser = parsed;
                break;
            }
        } catch (e) {
            // Not JSON data, skip
        }
    }
    
    if (foundUser) {
        console.log('✅ Displaying user profile for:', foundUser.name || foundUser.email);
        showLoggedInUser(foundUser);
    } else {
        console.log('❌ No user data found');
        showGuestState();
    }
}

// Make functions available globally
window.loginUser = loginUser;
window.setUserData = setUserData;
window.loginWithCredentials = loginWithCredentials;
window.showTestAccounts = showTestAccounts;
window.refreshUserProfile = refreshUserProfile;

// Manual function to test authentication
function testAuth() {
    console.log('=== MANUAL AUTH TEST ===');
    
    const sarahUser = {
        id: 'user_001',
        email: 'sarah.wilson@email.com',
        name: 'Sarah Wilson',
        balance: 1000,
        firstName: 'Sarah',
        lastName: 'Wilson'
    };
    
    localStorage.setItem('user', JSON.stringify(sarahUser));
    localStorage.setItem('token', 'user_token_123');
    
    showLoggedInUser(sarahUser);
}

// Make it available globally
window.testAuth = testAuth;

// Logout function
function logout() {
    console.log('=== LOGOUT FUNCTION CALLED ===');
    alert('Logout clicked! Redirecting...'); // Temporary test alert
    
    // Clear user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('✅ User data cleared');
    
    // Try multiple redirect methods
    console.log('Attempting redirect to login.html');
    
    // Method 1: window.location.href
    try {
        window.location.href = 'login.html';
        console.log('✅ Redirect attempted with window.location.href');
    } catch (error) {
        console.error('❌ Error with window.location.href:', error);
    }
    
    // Method 2: window.location.replace (backup)
    setTimeout(() => {
        try {
            window.location.replace('login.html');
            console.log('✅ Backup redirect attempted with window.location.replace');
        } catch (error) {
            console.error('❌ Error with window.location.replace:', error);
        }
    }, 100);
}

// Make logout available globally
window.logout = logout;

// Slider functionality
class GameSlider {
    constructor(sliderId) {
        this.sliderId = sliderId;
        this.slider = document.getElementById(sliderId);
        if (!this.slider) {
            console.error(`Slider with id "${sliderId}" not found`);
            return;
        }
        
        this.container = this.slider.parentElement;
        this.cards = this.slider.querySelectorAll('.game-card, .win-card');
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
        
        console.log(`Initialized slider ${sliderId}:`, {
            cardsCount: this.cards.length,
            cardsPerView: this.cardsPerView,
            maxIndex: this.maxIndex,
            containerWidth: this.container.offsetWidth
        });
        
        this.init();
    }
    
    init() {
        this.updateSliderPosition();
        this.setupEventListeners();
        this.updateButtonStates();
    }
    
    getCardsPerView() {
        const containerWidth = this.container.offsetWidth;
        // Different card widths for different sliders
        const cardWidth = this.sliderId === 'wins-slider' ? 200 : 180;
        const gap = 20; // Gap between cards
        const cardsPerView = Math.floor((containerWidth + gap) / (cardWidth + gap));
        return Math.max(1, cardsPerView); // At least 1 card per view
    }
    
    setupEventListeners() {
        // Find buttons within the same section
        const section = this.slider.closest('.section');
        if (!section) {
            console.warn(`Section not found for slider ${this.sliderId}`);
            return;
        }
        
        const prevBtn = section.querySelector(`[data-target="${this.sliderId}"].prev-btn`);
        const nextBtn = section.querySelector(`[data-target="${this.sliderId}"].next-btn`);
        
        console.log(`Setting up event listeners for ${this.sliderId}:`, {
            prevBtn: !!prevBtn,
            nextBtn: !!nextBtn,
            section: !!section
        });
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Previous button clicked for ${this.sliderId}`);
                this.prev();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Next button clicked for ${this.sliderId}`);
                this.next();
            });
        }
        
        // Touch/swipe support
        this.setupTouchEvents();
        
        // Keyboard support
        this.setupKeyboardEvents();
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            // Prevent page scrolling
            e.preventDefault();
        });
        
        this.slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            // Always prevent default to stop page scrolling
            e.preventDefault();
            e.stopPropagation();
        });
        
        this.slider.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            
            isDragging = false;
            e.preventDefault();
        });
    }
    
    setupKeyboardEvents() {
        // Only listen for keyboard events when this slider is focused
        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.next();
            }
        });
        
        // Make slider focusable
        this.slider.setAttribute('tabindex', '0');
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            console.log(`Moving to previous: index ${this.currentIndex}`);
            this.updateSliderPosition();
            this.updateButtonStates();
        }
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            console.log(`Moving to next: index ${this.currentIndex}`);
            this.updateSliderPosition();
            this.updateButtonStates();
        }
    }
    
    updateSliderPosition() {
        // Different card widths for different sliders
        const cardWidth = this.sliderId === 'wins-slider' ? 200 : 180;
        const gap = 20; // Gap between cards
        const translateX = -(this.currentIndex * (cardWidth + gap));
        
        // Ensure the slider doesn't go beyond its container
        const maxTranslate = Math.max(0, (this.cards.length - this.cardsPerView) * (cardWidth + gap));
        const clampedTranslateX = Math.min(translateX, 0);
        
        this.slider.style.transform = `translateX(${clampedTranslateX}px)`;
        console.log(`Updated slider position for ${this.sliderId}: translateX(${clampedTranslateX}px)`);
    }
    
    updateButtonStates() {
        const section = this.slider.closest('.section');
        if (!section) {
            console.warn(`Section not found for slider ${this.sliderId} in updateButtonStates`);
            return;
        }
        
        const prevBtn = section.querySelector(`[data-target="${this.sliderId}"].prev-btn`);
        const nextBtn = section.querySelector(`[data-target="${this.sliderId}"].next-btn`);
        
        if (prevBtn) {
            prevBtn.disabled = this.currentIndex === 0;
            prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentIndex >= this.maxIndex;
            nextBtn.style.opacity = this.currentIndex >= this.maxIndex ? '0.5' : '1';
        }
        
        console.log(`Button states updated for ${this.sliderId}: prev=${this.currentIndex === 0}, next=${this.currentIndex >= this.maxIndex}`);
    }
    
    // Update on window resize
    updateCardsPerView() {
        this.cardsPerView = this.getCardsPerView();
        this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
        
        if (this.currentIndex > this.maxIndex) {
            this.currentIndex = this.maxIndex;
        }
        
        this.updateSliderPosition();
        this.updateButtonStates();
    }
}

function initializeApp() {
    // Set up event listeners
    setupNavigation();
    setupGameCards();
    setupChat();
    setupBanners();
    setupUserProfile();
    setupSliders();
    
    // Set up chat toggle with a small delay to ensure DOM is ready
    setTimeout(() => {
        setupChatToggle();
    }, 100);
    
    // DIRECT CHAT TOGGLE FIX - This will definitely work
    setTimeout(() => {
        console.log('=== DIRECT CHAT TOGGLE SETUP ===');
        
        const floatingToggle = document.getElementById('floating-chat-btn');
        const chatSidebar = document.getElementById('chat-sidebar');
        const mainContent = document.querySelector('.main-content');
        
        console.log('Elements found:', {
            floatingToggle: !!floatingToggle,
            chatSidebar: !!chatSidebar,
            mainContent: !!mainContent
        });
        
        if (floatingToggle && chatSidebar && mainContent) {
            let chatVisible = true;
            
            // Direct click handler
            floatingToggle.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('DIRECT CHAT TOGGLE CLICKED! State:', chatVisible);
                
                chatVisible = !chatVisible;
                
                if (chatVisible) {
                    // Show chat - it's now part of flexbox layout
                    chatSidebar.style.display = 'flex';
                    chatSidebar.classList.remove('hidden');
                    mainContent.classList.remove('chat-hidden');
                    const profileSection = document.getElementById('profile-section');
                    if (profileSection) {
                        profileSection.style.right = '300px';
                    }
                    
                    floatingToggle.innerHTML = '<i class="fas fa-comments"></i>';
                    floatingToggle.title = 'Hide Chat';
                    console.log('DIRECT: Chat shown');
                } else {
                    // Hide chat - completely remove from layout
                    chatSidebar.style.display = 'none';
                    chatSidebar.classList.add('hidden');
                    mainContent.classList.add('chat-hidden');
                    const profileSection = document.getElementById('profile-section');
                    if (profileSection) {
                        profileSection.style.right = '0';
                    }
                    
                    floatingToggle.innerHTML = '<i class="fas fa-eye"></i>';
                    floatingToggle.title = 'Show Chat';
                    console.log('DIRECT: Chat hidden');
                }
            };
            
            console.log('DIRECT chat toggle setup complete!');
        } else {
            console.error('DIRECT: Missing elements for chat toggle');
        }
    }, 500);
    
    // BACKUP FAVORITES NAVIGATION FIX
    setTimeout(() => {
        console.log('=== BACKUP FAVORITES NAVIGATION SETUP ===');
        
        const favoritesNav = document.getElementById('favorites-nav');
        console.log('Backup favorites nav found:', !!favoritesNav);
        
        if (favoritesNav) {
            // Backup click handler
            favoritesNav.onclick = function(e) {
                e.preventDefault();
                console.log('BACKUP FAVORITES CLICKED!');
                
                // Hide all main content
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    const children = mainContent.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.display = 'none';
                    }
                }
                
                // Create or show favorites section
                let favoritesSection = document.getElementById('favorites-section');
                if (!favoritesSection) {
                    favoritesSection = document.createElement('div');
                    favoritesSection.id = 'favorites-section';
                    favoritesSection.className = 'section';
                    favoritesSection.innerHTML = `
                        <div class="section-header">
                            <h2><i class="fas fa-star"></i> My Favorites</h2>
                        </div>
                        <div class="favorites-container">
                            <div class="no-favorites-message">
                                <div class="no-favorites-icon">
                                    <i class="fas fa-star"></i>
                                </div>
                                <h3>No Favorites Yet</h3>
                                <p>Games you favorite will appear here. Start exploring and add games to your favorites!</p>
                                <button class="btn btn-primary" id="browse-games-btn-backup">
                                    <i class="fas fa-gamepad"></i> Browse Games
                                </button>
                            </div>
                        </div>
                    `;
                    mainContent.appendChild(favoritesSection);
                }
                
                // Show favorites section
                favoritesSection.style.display = 'block';
                
                // Update navigation active state
                document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
                favoritesNav.classList.add('active');
                
                console.log('BACKUP FAVORITES PAGE SHOWN!');
                
                // Set up Browse Games button after creating the section
                setTimeout(function() {
                    const browseBtn = document.getElementById('browse-games-btn-backup');
                    if (browseBtn) {
                        browseBtn.addEventListener('click', function(e) {
                            e.preventDefault();
                            console.log('BACKUP BROWSE GAMES BUTTON CLICKED!');
                            
                            // Hide favorites section
                            const favoritesSection = document.getElementById('favorites-section');
                            if (favoritesSection) {
                                favoritesSection.style.display = 'none';
                            }
                            
                            // Show home content
                            const mainContent = document.querySelector('.main-content');
                            if (mainContent) {
                                const children = mainContent.children;
                                for (let i = 0; i < children.length; i++) {
                                    const child = children[i];
                                    if (child.id !== 'favorites-section' && child.id !== 'profile-section') {
                                        child.style.display = 'block';
                                        console.log('Backup: Showing home element:', child.className || child.tagName);
                                    }
                                }
                            }
                            
                            // Update navigation to show Home as active
                            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
                            const homeNav = document.querySelector('[onclick="showHome()"]');
                            if (homeNav) {
                                homeNav.classList.add('active');
                            }
                            
                            console.log('BACKUP: REDIRECTED TO HOMEPAGE!');
                        });
                        console.log('Backup Browse Games button setup complete!');
                    } else {
                        console.error('Backup: Browse Games button not found!');
                    }
                }, 100);
            };
            
            console.log('Backup favorites navigation setup complete!');
        } else {
            console.error('Backup: Favorites nav element not found!');
        }
    }, 1500);
    
    // Start live updates
    startLiveUpdates();
}

function setupSliders() {
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        console.log('Initializing sliders...');
        
        // Initialize sliders only if elements exist
        if (document.getElementById('slots-slider')) {
            window.slotsSlider = new GameSlider('slots-slider');
        }
        if (document.getElementById('roulette-slider')) {
            window.rouletteSlider = new GameSlider('roulette-slider');
        }
        if (document.getElementById('wins-slider')) {
            window.winsSlider = new GameSlider('wins-slider');
        }
        
        console.log('Sliders initialized:', {
            slots: !!window.slotsSlider,
            roulette: !!window.rouletteSlider,
            wins: !!window.winsSlider
        });
    }, 100);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.slotsSlider) {
            window.slotsSlider.updateCardsPerView();
        }
        if (window.rouletteSlider) {
            window.rouletteSlider.updateCardsPerView();
        }
        if (window.winsSlider) {
            window.winsSlider.updateCardsPerView();
        }
    });
}

function setupChatToggle() {
    console.log('Setting up chat toggle...');
    
    // Check if we're on the All Games page - if so, skip setup
    if (window.location.pathname.includes('all-games.html')) {
        console.log('Skipping chat toggle setup on All Games page - handled by all-games.js');
        return;
    }
    
    const floatingToggle = document.getElementById('floating-chat-btn');
    const chatSidebar = document.getElementById('chat-sidebar');
    const mainContent = document.querySelector('.main-content');
    
    console.log('Chat toggle elements found:', {
        floatingToggle: !!floatingToggle,
        chatSidebar: !!chatSidebar,
        mainContent: !!mainContent
    });
    
    if (!chatSidebar || !mainContent) {
        console.error('Chat sidebar or main content not found');
        return;
    }
    
    // Start with chat HIDDEN by default
    let isChatVisible = false;
    
    // Ensure chat is hidden on initialization
    chatSidebar.classList.add('hidden');
    chatSidebar.style.display = 'none';
    mainContent.classList.add('chat-hidden');
    
    // Set button to show state
    if (floatingToggle) {
        floatingToggle.innerHTML = '<i class="fas fa-comments"></i>';
        floatingToggle.title = 'Show Chat';
    }
    
    // Initialize from actual DOM state
    if (chatSidebar.classList.contains('hidden') || chatSidebar.style.display === 'none') {
        isChatVisible = false;
        if (floatingToggle) {
            floatingToggle.innerHTML = '<i class="fas fa-comments"></i>';
            floatingToggle.title = 'Show Chat';
        }
    }
    
    // Function to toggle chat
    function toggleChat() {
        console.log('TOGGLE CHAT CALLED! State:', isChatVisible);
        
        isChatVisible = !isChatVisible;
        const isMobile = window.innerWidth <= 768;
        
        if (isChatVisible) {
            // Show chat
            if (isMobile) {
                // Mobile: use fixed positioning overlay
                chatSidebar.style.cssText = 'display: flex !important; visibility: visible !important; opacity: 1 !important; position: fixed !important; top: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; max-width: 100vw !important; z-index: 2000 !important; background: rgba(10, 9, 30, 0.98) !important; padding: 70px 15px 90px 15px !important;';
            } else {
                // Desktop: normal display
                chatSidebar.style.display = 'flex';
                chatSidebar.style.cssText = 'display: flex !important;';
            }
            chatSidebar.classList.remove('hidden');
            mainContent.classList.remove('chat-hidden');
            if (floatingToggle) {
                floatingToggle.innerHTML = '<i class="fas fa-times"></i>';
                floatingToggle.title = 'Hide Chat';
            }
            const profileSection = document.getElementById('profile-section');
            if (profileSection) {
                if (isMobile) {
                    profileSection.style.right = '0';
                } else {
                    profileSection.style.right = '300px';
                }
            }
            console.log('Chat shown');
        } else {
            // Hide chat
            if (isMobile) {
                chatSidebar.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
            } else {
                chatSidebar.style.display = 'none';
            }
            chatSidebar.classList.add('hidden');
            mainContent.classList.add('chat-hidden');
            if (floatingToggle) {
                floatingToggle.innerHTML = '<i class="fas fa-comments"></i>';
                floatingToggle.title = 'Show Chat';
            }
            const profileSection = document.getElementById('profile-section');
            if (profileSection) {
                profileSection.style.right = '0';
            }
            console.log('Chat hidden');
        }
    }
    
    // Floating chat toggle (always visible)
    if (floatingToggle) {
        floatingToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleChat();
        });
    }
    
    console.log('Chat toggle setup complete');
}

// Navigation functionality
function setupNavigation() {
    // Navigation is now handled by onclick handlers in HTML
    // This function is kept for compatibility but doesn't interfere with onclick
    console.log('Navigation setup complete - using onclick handlers');
}

function updateNavigationActiveState(navText) {
    console.log('Updating navigation active state for:', navText);
    
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to the clicked item
    const navItemsArray = Array.from(navItems);
    const activeItem = navItemsArray.find(item => 
        item.textContent.includes(navText)
    );
    
    if (activeItem) {
        activeItem.classList.add('active');
        console.log('Set active nav item:', activeItem);
    } else {
        console.warn('Could not find nav item for:', navText);
    }
}

function handleNavigation(navText) {
    console.log(`Navigating to: ${navText}`);
    
    // Show notification
    showNotification(`Switched to ${navText}`);
    
    // Here you would implement actual navigation logic
    // For now, we'll just show a message
    switch(navText) {
        case 'Home':
            // Navigate to home page
            window.location.href = 'index.html';
            break;
        case 'All Games':
            // Navigate to all games page
            window.location.href = 'all-games.html';
            break;
        case 'Favorites':
            showFavorites();
            break;
        case 'Live Casino':
            showNotification('Connecting to live casino...');
            break;
        case 'Tournaments':
            showNotification('Loading tournaments...');
            break;
        case 'Promotions':
            showNotification('Loading promotions...');
            break;
        case 'Community':
            showCommunity();
            break;
        case 'Settings':
            showNotification('Opening settings...');
            break;
    }
}

// Game cards functionality
function setupGameCards() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('click', function() {
            const gameName = this.querySelector('h3').textContent;
            showNotification(`Starting ${gameName}...`);
            
            // Add loading effect
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 1000);
        });
    });
    
    // Favorite buttons
    const favoriteButtons = document.querySelectorAll('.game-favorite');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('favorited');
            
            if (this.classList.contains('favorited')) {
                this.style.color = '#f39c12';
                showNotification('Added to favorites');
            } else {
                this.style.color = '#95a5a6';
                showNotification('Removed from favorites');
            }
        });
    });
}

// Play game function
function playGame(gameUrl) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        if (confirm('You need to login to play games. Would you like to login now?')) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    console.log('Playing game:', gameUrl);
    window.location.href = gameUrl;
}

// Authentication functions
function initializeAuth() {
    console.log('=== INITIALIZING AUTH ===');
    
    // Force create a test user for demonstration
    const testUser = {
        id: 'test_001',
        email: 'test@example.com',
        name: 'Test User',
        balance: 1000,
        firstName: 'Test',
        lastName: 'User'
    };
    const testToken = 'test_token_123';
    
    // Always set test user data
    localStorage.setItem('user', JSON.stringify(testUser));
    localStorage.setItem('token', testToken);
    
    console.log('Test user data set:', testUser);
    
    // Force show user profile
    showUserProfile(testUser);
}

function showUserProfile(user) {
    console.log('=== SHOW USER PROFILE ===');
    console.log('User data:', user);
    
    const userProfile = document.getElementById('userProfile');
    const authButtons = document.getElementById('authButtons');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminBtn');
    
    console.log('Elements found:');
    console.log('- userProfile:', !!userProfile);
    console.log('- authButtons:', !!authButtons);
    console.log('- logoutBtn:', !!logoutBtn);
    console.log('- adminBtn:', !!adminBtn);
    
    if (userProfile && authButtons) {
        console.log('✅ Elements found, updating display');
        
        // Show user profile, hide auth buttons
        userProfile.style.display = 'flex';
        authButtons.style.display = 'none';
        console.log('✅ User profile shown, auth buttons hidden');
        
        // Show logout button
        if (logoutBtn) {
            logoutBtn.style.display = 'flex';
            console.log('✅ Logout button shown');
        } else {
            console.log('❌ Logout button not found');
        }
        
        // Hide admin button for regular users
        if (adminBtn) {
            adminBtn.style.display = 'none';
            console.log('✅ Admin button hidden');
        }
        
        // Update user name
        const userName = document.getElementById('userName');
        if (userName) {
            const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';
            userName.textContent = displayName;
            console.log('✅ Updated user name to:', displayName);
        } else {
            console.log('❌ User name element not found');
        }
        
        // Update user balance
        const userBalance = document.getElementById('userBalance');
        if (userBalance) {
            const balance = user.balance || 0;
            userBalance.textContent = `$${balance}`;
            console.log('✅ Updated user balance to:', balance);
        } else {
            console.log('❌ User balance element not found');
        }
        
        // Update user avatar
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            const name = user.name || user.email || 'U';
            userAvatar.textContent = name.charAt(0).toUpperCase();
            console.log('✅ Updated user avatar to letter:', name.charAt(0).toUpperCase());
        } else {
            console.log('❌ User avatar element not found');
        }
    } else {
        console.error('❌ User profile or auth buttons elements not found');
        console.log('userProfile:', userProfile);
        console.log('authButtons:', authButtons);
    }
}

function showAuthButtons() {
    console.log('showAuthButtons called - showing login/register buttons');
    
    const userProfile = document.getElementById('userProfile');
    const authButtons = document.getElementById('authButtons');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminBtn');
    
    if (userProfile && authButtons) {
        console.log('Hiding user profile, showing auth buttons');
        userProfile.style.display = 'none';
        authButtons.style.display = 'flex';
        
        // Hide logout button
        if (logoutBtn) {
            logoutBtn.style.display = 'none';
            console.log('Logout button hidden');
        }
        
        // Hide admin button
        if (adminBtn) {
            adminBtn.style.display = 'none';
            console.log('Admin button hidden');
        }
    } else {
        console.error('User profile or auth buttons elements not found');
    }
}

function goToAdmin() {
    // Redirect to admin dashboard
    window.location.href = 'admin.html';
}


// Chat functionality
function setupChat() {
    const messageInput = document.querySelector('.message-input');
    const sendButton = document.querySelector('.send-button');
    
    // Check if elements exist before adding event listeners
    if (sendButton) {
        // Send message on button click
        sendButton.addEventListener('click', function() {
            sendMessage();
        });
    } else {
        console.warn('Send button not found - chat functionality may be limited');
    }
    
    if (messageInput) {
        // Send message on Enter key
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    } else {
        console.warn('Message input not found - chat functionality may be limited');
    }
    
    // Auto-scroll to bottom of chat
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function sendMessage() {
    const messageInput = document.querySelector('.message-input');
    const message = messageInput.value.trim();
    
    if (message) {
        addChatMessage('You', message, true);
        messageInput.value = '';
        
        // Simulate response after a delay
        setTimeout(() => {
            const responses = [
                'Nice win!',
                'Good luck!',
                'I love this game too!',
                'Amazing!',
                'Keep it up!'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage('CasinoBot', randomResponse, false);
        }, 1000);
    }
}

function addChatMessage(user, message, isUser) {
    const chatMessages = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    
    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${isUser ? 'user' : 'bot'}`;
    avatar.textContent = user.charAt(0);
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const header = document.createElement('div');
    header.className = 'message-header';
    
    const userName = document.createElement('span');
    userName.className = 'message-user';
    userName.textContent = user;
    
    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    header.appendChild(userName);
    header.appendChild(time);
    
    const text = document.createElement('div');
    text.className = 'message-text';
    text.textContent = message;
    
    content.appendChild(header);
    content.appendChild(text);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Banner functionality
function setupBanners() {
    const claimButton = document.querySelector('.btn-primary');
    const learnMoreButton = document.querySelector('.btn-secondary');
    
    if (claimButton) {
        claimButton.addEventListener('click', function() {
            showNotification('Bonus claimed! +$2,000 added to your balance');
            updateBalance(2000);
        });
    }
    
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', function() {
            showNotification('Welcome to Elite Club! Exclusive benefits unlocked');
        });
    }
}

// User profile functionality
function setupUserProfile() {
    const userAvatar = document.querySelector('.user-avatar');
    const userBalance = document.querySelector('.user-balance');
    
    userAvatar.addEventListener('click', function() {
        showNotification('Opening user profile...');
    });
    
    // Store initial balance
    window.initialBalance = 1234.56;
}

function updateBalance(amount) {
    const userBalance = document.querySelector('.user-balance');
    const currentBalance = parseFloat(userBalance.textContent.replace('$', '').replace(',', ''));
    const newBalance = currentBalance + amount;
    
    userBalance.textContent = `$${newBalance.toLocaleString()}`;
    
    // Add animation
    userBalance.style.color = '#27ae60';
    setTimeout(() => {
        userBalance.style.color = '#f39c12';
    }, 1000);
}

// Live updates simulation - Optimized for mobile
function startLiveUpdates() {
    const isMobile = window.innerWidth <= 768;
    
    // On mobile: slower updates, less frequent to save battery and performance
    const onlineInterval = isMobile ? 15000 : 5000;  // 15s on mobile, 5s on desktop
    const chatInterval = isMobile ? 30000 : 10000;   // 30s on mobile, 10s on desktop
    const winsInterval = isMobile ? 45000 : 15000;    // 45s on mobile, 15s on desktop
    
    // Update online count
    setInterval(() => {
        const onlineCount = document.querySelector('.online-count');
        if (onlineCount) {
            const currentCount = parseInt(onlineCount.textContent.replace(',', '').replace(' online', ''));
            const newCount = currentCount + Math.floor(Math.random() * 3) - 1;
            onlineCount.textContent = newCount.toLocaleString() + ' online';
        }
    }, onlineInterval);
    
    // Add random chat messages - only if chat is visible
    setInterval(() => {
        const chatSidebar = document.getElementById('chat-sidebar');
        if (chatSidebar && !chatSidebar.classList.contains('hidden')) {
            if (Math.random() < (isMobile ? 0.15 : 0.3)) { // Lower chance on mobile
                addRandomChatMessage();
            }
        }
    }, chatInterval);
    
    // Update recent wins - only on desktop or if wins section is visible
    if (!isMobile) {
        setInterval(() => {
            if (Math.random() < 0.2) {
                addRandomWin();
            }
        }, winsInterval);
    }
}

function addRandomChatMessage() {
    const messages = [
        'Just won big on slots!',
        'Anyone playing blackjack?',
        'This casino is amazing!',
        'Good luck everyone!',
        'Red or black?',
        'Lady luck is with me tonight!',
        'Amazing win!',
        'Keep spinning!'
    ];
    
    const users = ['LuckyPlayer', 'SlotMaster', 'VegasVibes', 'RoulettePro', 'CasinoKing'];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    
    addChatMessage(randomUser, randomMessage, false);
}

function addRandomWin() {
    const wins = [
        { player: 'LuckyPlayer', game: 'Mega Fortune', amount: '$5,240', multiplier: 'x52' },
        { player: 'SlotMaster', game: 'Dragon\'s Gold', amount: '$3,750', multiplier: 'x37' },
        { player: 'VegasVibes', game: 'Blackjack Pro', amount: '$1,850', multiplier: '' },
        { player: 'RoulettePro', game: 'European Roulette', amount: '$2,950', multiplier: '' }
    ];
    
    const randomWin = wins[Math.floor(Math.random() * wins.length)];
    
    // Add to recent wins
    const winsGrid = document.querySelector('.wins-grid');
    if (winsGrid) {
        const winCard = document.createElement('div');
        winCard.className = 'win-card';
        winCard.innerHTML = `
            <div class="win-player">${randomWin.player}</div>
            <div class="win-game">${randomWin.game}</div>
            <div class="win-amount">${randomWin.amount}</div>
            ${randomWin.multiplier ? `<div class="win-multiplier">${randomWin.multiplier}</div>` : ''}
            <div class="win-time">Just now</div>
        `;
        
        // Insert at the beginning
        winsGrid.insertBefore(winCard, winsGrid.firstChild);
        
        // Remove last item if more than 5
        if (winsGrid.children.length > 5) {
            winsGrid.removeChild(winsGrid.lastChild);
        }
        
        // Add animation (moved inside the if block so winCard is in scope)
        winCard.style.opacity = '0';
        winCard.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            winCard.style.transition = 'all 0.5s ease';
            winCard.style.opacity = '1';
            winCard.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Notification system
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add some CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        font-family: Arial, sans-serif;
    }
    
    .game-favorite.favorited {
        color: #f39c12 !important;
    }
    
    .message-avatar.user {
        background-color: #3498db;
    }
    
    .message-avatar.bot {
        background-color: #95a5a6;
    }
`;
document.head.appendChild(style);

// Profile Management Functions
// Add debounce to prevent multiple rapid calls
let profileTimeout;
let isProfileLoading = false;

// Function to hide profile section
function hideProfileSection() {
    const profileSection = document.getElementById('profile-section');
    if (profileSection) {
        profileSection.style.display = 'none';
        profileSection.classList.remove('profile-visible');
        console.log('Profile section hidden');
    }
}

// SIMPLE navigation system that actually works
function hideAllSections() {
    console.log('=== hideAllSections called ===');
    
    // FORCE HIDE profile section
    const profileSection = document.getElementById('profile-section');
    if (profileSection) {
        profileSection.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: fixed !important; top: -9999px !important; left: -9999px !important; z-index: -9999 !important; pointer-events: none !important;';
        profileSection.setAttribute('hidden', 'true');
        console.log('Profile section FORCE HIDDEN and moved off-screen');
    }
    
    // FORCE HIDE community section
    const communitySection = document.getElementById('community-section');
    if (communitySection) {
        communitySection.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
        console.log('Community section FORCE HIDDEN');
    }
    
    // FORCE HIDE favorites section
    const favoritesSection = document.getElementById('favorites-section');
    if (favoritesSection) {
        favoritesSection.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
        console.log('Favorites section FORCE HIDDEN');
    }
    
    console.log('All sections FORCE HIDDEN');
}

function showOnlyProfile() {
    console.log('=== showOnlyProfile called ===');
    
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.error('Main content not found!');
        return;
    }
    
    // Remove all existing sections
    mainContent.querySelectorAll('#profile-section, #community-section, #favorites-section').forEach(el => {
        if (el) el.remove();
    });
    
    // Hide all children by default
    Array.from(mainContent.children).forEach(child => {
        child.style.display = 'none';
    });
    
    // Create new profile section
    let profileSection = document.createElement('div');
    profileSection.id = 'profile-section';
    profileSection.style.cssText = `
        display: block !important;
        background: #1a1a1a;
        color: white;
        padding: 20px;
        margin: 0;
        min-height: 500px;
    `;
    
    // Set the content
    profileSection.innerHTML = `
        <div style="background: #2a2a2a; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #00ff88; margin-bottom: 20px;"><i class="fas fa-user"></i> My Profile</h2>
            
            <div style="background: #333; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: #00ff88; margin-bottom: 10px;">Personal Information</h3>
                <p><strong style="color: #00ff88;">Name:</strong> <span id="profileName">Guest User</span></p>
                <p><strong style="color: #00ff88;">Email:</strong> <span id="profileEmail">guest@example.com</span></p>
                <p><strong style="color: #00ff88;">Phone:</strong> <span id="profilePhone">Not provided</span></p>
                <p><strong style="color: #00ff88;">Country:</strong> <span id="profileCountry">Not specified</span></p>
                <p><strong style="color: #00ff88;">Member Since:</strong> <span id="memberSince">Today</span></p>
            </div>
            
            <div style="background: #333; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: #00ff88; margin-bottom: 10px;">Account Balance</h3>
                <p><strong style="color: #00ff88;">Current Balance:</strong> <span id="profileBalance" style="font-size: 18px; color: #00ff88;">$0.00</span></p>
                <div style="margin-top: 15px;">
                    <button class="btn btn-success" onclick="addBalance()" style="margin-right: 10px;">
                        <i class="fas fa-plus"></i> Add Funds
                    </button>
                    <button class="btn btn-secondary" onclick="withdrawBalance()">
                        <i class="fas fa-minus"></i> Withdraw
                    </button>
                </div>
            </div>
            
            <div style="background: #333; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: #00ff88; margin-bottom: 10px;">Game Statistics</h3>
                <p><strong style="color: #00ff88;">Total Games Played:</strong> <span id="gamesPlayed">0</span></p>
                <p><strong style="color: #00ff88;">Win Rate:</strong> <span id="winRate">0%</span></p>
                <p><strong style="color: #00ff88;">Total Winnings:</strong> <span id="totalWinnings">$0.00</span></p>
                <p><strong style="color: #00ff88;">Favorite Game:</strong> <span id="favoriteGame">None yet</span></p>
            </div>
            
            <div style="background: #333; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: #00ff88; margin-bottom: 10px;">Account Actions</h3>
                <div>
                    <button class="btn btn-primary" id="editProfileBtn" onclick="editProfile()" style="margin-right: 10px; margin-bottom: 10px;">
                        <i class="fas fa-edit"></i> Edit Profile
                    </button>
                    <button class="btn btn-info" onclick="changePassword()" style="margin-right: 10px; margin-bottom: 10px;">
                        <i class="fas fa-key"></i> Change Password
                    </button>
                    <button class="btn btn-warning" onclick="viewTransactionHistory()" style="margin-right: 10px; margin-bottom: 10px;">
                        <i class="fas fa-history"></i> Transaction History
                    </button>
                    <button class="btn btn-danger" onclick="clearUserDataAndReset()" style="margin-bottom: 10px;">
                        <i class="fas fa-trash"></i> Reset Account
                    </button>
                </div>
            </div>
            
            <div id="profileForm" style="display: none; background: #333; padding: 15px; border-radius: 8px;">
                <h3 style="color: #00ff88; margin-bottom: 15px;">Edit Profile Information</h3>
                <form id="editProfileForm">
                    <div style="margin-bottom: 15px;">
                        <label style="color: white; display: block; margin-bottom: 5px;">First Name:</label>
                        <input type="text" id="editFirstName" name="firstName" required style="width: 200px; padding: 8px; background: #444; border: 1px solid #666; color: white; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="color: white; display: block; margin-bottom: 5px;">Last Name:</label>
                        <input type="text" id="editLastName" name="lastName" required style="width: 200px; padding: 8px; background: #444; border: 1px solid #666; color: white; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="color: white; display: block; margin-bottom: 5px;">Email:</label>
                        <input type="email" id="editEmail" name="email" required style="width: 200px; padding: 8px; background: #444; border: 1px solid #666; color: white; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="color: white; display: block; margin-bottom: 5px;">Phone:</label>
                        <input type="tel" id="editPhone" name="phone" style="width: 200px; padding: 8px; background: #444; border: 1px solid #666; color: white; border-radius: 4px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="color: white; display: block; margin-bottom: 5px;">Country:</label>
                        <select id="editCountry" name="country" style="width: 200px; padding: 8px; background: #444; border: 1px solid #666; color: white; border-radius: 4px;">
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="ES">Spain</option>
                            <option value="IT">Italy</option>
                            <option value="NL">Netherlands</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <button type="button" class="btn btn-secondary" onclick="cancelEditProfile()" style="margin-right: 10px;">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add to main content
    mainContent.appendChild(profileSection);
    
    console.log('Profile section created and appended');
    
    // Load profile data
    loadProfileData();
}

function showOnlyHome() {
    console.log('=== showOnlyHome called ===');
    
    // Restore main-content padding for home page
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // Restore mobile padding
            mainContent.style.paddingTop = '';
            mainContent.style.removeProperty('padding-top');
        } else {
            // Restore desktop padding
            mainContent.style.paddingTop = '';
            mainContent.style.removeProperty('padding-top');
        }
    }
    
    // FORCE HIDE profile section first - move it completely off-screen
    const profileSection = document.getElementById('profile-section');
    if (profileSection) {
        profileSection.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: fixed !important; top: -9999px !important; left: -9999px !important; z-index: -9999 !important; pointer-events: none !important;';
        profileSection.setAttribute('hidden', 'true');
        console.log('Profile section FORCE HIDDEN and moved off-screen');
    }
    
    // Hide all other sections
    hideAllSections();
    
    // Show all home content (non-section elements)
    if (mainContent) {
        const children = mainContent.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            // Show only elements that are NOT sections
            if (!child.id || (!child.id.includes('section') && !child.id.includes('profile'))) {
                child.style.display = 'block';
                child.style.visibility = 'visible';
                child.style.opacity = '1';
                console.log('Showing home element:', child.className || child.tagName);
            } else {
                child.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
                console.log('FORCE HIDING section element:', child.id);
            }
        }
    }
    
    console.log('Home content should be visible, profile FORCE HIDDEN');
}

function showOnlyCommunity() {
    console.log('=== showOnlyCommunity called ===');
    
    // Hide profile section
    const profileSection = document.getElementById('profile-section');
    if (profileSection) {
        profileSection.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: fixed !important; top: -9999px !important; left: -9999px !important; z-index: -9999 !important; pointer-events: none !important;';
        profileSection.setAttribute('hidden', 'true');
    }
    
    // Hide all other sections (favorites, etc.)
    hideAllSections();
    
    // Hide ALL home content (topbar, banners, sections)
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const children = mainContent.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            // Hide everything that's NOT the community section
            if (!child.id || child.id !== 'community-section') {
                child.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
            }
        }
    }
    
    // Show community section
    const communitySection = document.getElementById('community-section');
    const mainContent = document.querySelector('.main-content');
    if (communitySection) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // Mobile: full width, no padding - AGGRESSIVE FIX
            communitySection.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; width: 100% !important; max-width: 100% !important; padding: 20px 15px !important; margin: 0 !important; padding-top: 20px !important; margin-top: 0 !important; position: relative !important; z-index: 100 !important;';
            // Also remove top padding from main-content when showing community
            if (mainContent) {
                mainContent.style.paddingTop = '0px';
                mainContent.style.setProperty('padding-top', '0px', 'important');
            }
        } else {
            // Desktop: no top padding
            communitySection.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; padding: 20px !important; margin: 0 !important; padding-top: 20px !important; margin-top: 0 !important; position: relative !important; z-index: 100 !important;';
            // Also remove top padding from main-content on desktop
            if (mainContent) {
                mainContent.style.paddingTop = '0px';
                mainContent.style.setProperty('padding-top', '0px', 'important');
            }
        }
        // Remove padding from section-header too
        const sectionHeader = communitySection.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.style.paddingTop = '20px';
            sectionHeader.style.marginTop = '0px';
            sectionHeader.style.setProperty('padding-top', '0px', 'important');
            sectionHeader.style.setProperty('margin-top', '0px', 'important');
        }
        console.log('Community section shown');
    } else {
        console.log('Community section does not exist yet - will be created by showCommunity()');
    }
}

function showOnlyFavorites() {
    console.log('=== showOnlyFavorites called ===');
    
    // Hide profile section
    const profileSection = document.getElementById('profile-section');
    if (profileSection) {
        profileSection.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: fixed !important; top: -9999px !important; left: -9999px !important; z-index: -9999 !important; pointer-events: none !important;';
        profileSection.setAttribute('hidden', 'true');
    }
    
    // Hide all other sections (community, etc.)
    hideAllSections();
    
    // Hide ALL home content (topbar, banners, sections)
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const children = mainContent.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            // Hide everything that's NOT the favorites section
            if (!child.id || child.id !== 'favorites-section') {
                child.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
            }
        }
    }
    
    // Show favorites section
    const favoritesSection = document.getElementById('favorites-section');
    const mainContent = document.querySelector('.main-content');
    if (favoritesSection) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // Mobile: full width, no padding - AGGRESSIVE FIX
            favoritesSection.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 !important; padding-top: 0 !important; margin-top: 0 !important;';
            // Also remove top padding from main-content when showing favorites
            if (mainContent) {
                mainContent.style.paddingTop = '0px';
                mainContent.style.setProperty('padding-top', '0px', 'important');
            }
        } else {
            // Desktop: no top padding
            favoritesSection.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; padding-top: 0 !important; margin-top: 0 !important;';
            // Also remove top padding from main-content on desktop
            if (mainContent) {
                mainContent.style.paddingTop = '0px';
                mainContent.style.setProperty('padding-top', '0px', 'important');
            }
        }
        // Remove padding from section-header too
        const sectionHeader = favoritesSection.querySelector('.section-header');
        if (sectionHeader) {
            sectionHeader.style.paddingTop = '0px';
            sectionHeader.style.marginTop = '0px';
            sectionHeader.style.setProperty('padding-top', '0px', 'important');
            sectionHeader.style.setProperty('margin-top', '0px', 'important');
        }
        console.log('Favorites section shown');
    } else {
        console.log('Favorites section does not exist yet - will be created by showFavorites()');
    }
}

function showProfile() {
    console.log('=== showProfile called ===');
    
    // Hide all other sections
    hideAllSections();
    
    // Show profile section - FORCE IT TO SHOW with fixed positioning
    const profileSection = document.getElementById('profile-section');
    if (profileSection) {
        profileSection.removeAttribute('hidden');
        
        // Mobile vs Desktop positioning
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // Mobile: full width, account for top padding and bottom nav
            profileSection.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; z-index: 1000 !important; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%) !important; color: white !important; padding: 70px 15px 90px 15px !important; overflow-y: auto !important; pointer-events: auto !important; width: 100vw !important; max-width: 100vw !important;';
        } else {
            // Desktop: respect sidebar and chat
            profileSection.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; position: fixed !important; top: 0 !important; left: 200px !important; right: 300px !important; bottom: 0 !important; z-index: 1000 !important; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%) !important; color: white !important; padding: 30px !important; overflow-y: auto !important; pointer-events: auto !important;';
        }
        console.log('Profile section FORCED to show with fixed positioning');
        
        // Load profile data
        if (typeof loadProfileData === 'function') {
            loadProfileData();
        }
    } else {
        console.error('Profile section not found in HTML!');
    }
    
    // Update navigation
    updateNavigationActiveState('Profile');
}

function showHome() {
    showOnlyHome();
    updateNavigationActiveState('Home');
}

// Function to go to home page (for Browse Games button)
function goToHomePage() {
    console.log('goToHomePage called - redirecting to homepage');
    
    // Hide all main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const children = mainContent.children;
        for (let i = 0; i < children.length; i++) {
            children[i].style.display = 'none';
        }
    }
    
    // Show home content
    const homeSection = document.querySelector('.section:not(#profile-section)');
    if (homeSection) {
        homeSection.style.display = 'block';
    }
    
    // Update navigation to show Home as active
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const homeNav = document.querySelector('[onclick="showHome()"]');
    if (homeNav) {
        homeNav.classList.add('active');
    }
    
    console.log('Redirected to homepage successfully');
}

function showTournaments() {
    console.log('showTournaments called');
    
    // Hide ALL main content and show only tournaments
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        // Hide all children of main content
        const children = mainContent.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child.style.display = 'none';
            console.log('Hiding element:', child.className || child.tagName);
        }
    }
    
    // Create tournaments content if it doesn't exist
    let tournamentsSection = document.getElementById('tournaments-section');
    if (!tournamentsSection) {
        tournamentsSection = document.createElement('div');
        tournamentsSection.id = 'tournaments-section';
        tournamentsSection.className = 'section';
        tournamentsSection.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-trophy"></i> Tournaments</h2>
            </div>
            <div class="tournaments-container">
                <div class="no-tournaments-message">
                    <div class="no-tournaments-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <h3>No Tournaments Available</h3>
                    <p>Tournaments will be added by the admin team. Check back soon for exciting competitions!</p>
                </div>
            </div>
        `;
        mainContent.appendChild(tournamentsSection);
    }
    
    tournamentsSection.style.display = 'block';
    tournamentsSection.style.visibility = 'visible';
    tournamentsSection.style.opacity = '1';
    
    // Update navigation active state
    updateNavigationState('tournaments');
}

function showPromotions() {
    console.log('showPromotions called');
    
    // Hide ALL main content and show only promotions
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        // Hide all children of main content
        const children = mainContent.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child.style.display = 'none';
            console.log('Hiding element:', child.className || child.tagName);
        }
    }
    
    // Create promotions content if it doesn't exist
    let promotionsSection = document.getElementById('promotions-section');
    if (!promotionsSection) {
        promotionsSection = document.createElement('div');
        promotionsSection.id = 'promotions-section';
        promotionsSection.className = 'section';
        promotionsSection.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-gift"></i> Promotions</h2>
            </div>
            <div class="promotions-container">
                <div class="no-promotions-message">
                    <div class="no-promotions-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    <h3>No Promotions Available</h3>
                    <p>Promotions will be added by the admin team. Check back soon for exciting offers!</p>
                </div>
            </div>
        `;
        mainContent.appendChild(promotionsSection);
    }
    
    promotionsSection.style.display = 'block';
    promotionsSection.style.visibility = 'visible';
    promotionsSection.style.opacity = '1';
    
    // Update navigation active state
    updateNavigationState('promotions');
}

function showFavorites() {
    // Create favorites content if it doesn't exist FIRST (before calling showOnlyFavorites)
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.error('Main content not found!');
        return;
    }
    
    let favoritesSection = document.getElementById('favorites-section');
    if (!favoritesSection) {
        favoritesSection = document.createElement('div');
        favoritesSection.id = 'favorites-section';
        favoritesSection.className = 'section';
        favoritesSection.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-star"></i> My Favorites</h2>
            </div>
            <div class="favorites-container">
                <div class="no-favorites-message">
                    <div class="no-favorites-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <h3>No Favorites Yet</h3>
                    <p>Games you favorite will appear here. Start exploring and add games to your favorites!</p>
                    <button class="btn btn-primary" onclick="showHome()">
                        <i class="fas fa-gamepad"></i> Browse Games
                    </button>
                </div>
            </div>
        `;
        mainContent.appendChild(favoritesSection);
    }
    
    // Now show the section (after it's created)
    showOnlyFavorites();
    updateNavigationActiveState('Favorites');
}

// Function to load community data dynamically
function loadCommunityData() {
    const communitySection = document.getElementById('community-section');
    if (!communitySection) return;
    
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Get current user's friends list (stored in localStorage)
    const friendsList = JSON.parse(localStorage.getItem('friends') || '[]');
    const currentUserId = currentUser ? (currentUser.id || currentUser.email) : null;
    
    // Filter out current user from all users
    const otherUsers = allUsers.filter(u => {
        const userId = u.id || u.email;
        return userId !== currentUserId;
    });
    
    // Get friends (users who are in friends list)
    const friends = friendsList.map(friendId => {
        return allUsers.find(u => (u.id || u.email) === friendId);
    }).filter(Boolean);
    
    // Get suggestions (users not in friends list, excluding current user)
    const suggestions = otherUsers
        .filter(u => !friendsList.includes(u.id || u.email))
        .slice(0, 5); // Limit to 5 suggestions
    
    // Calculate community stats
    const activeUsers = allUsers.filter(u => u.status === 'online' || !u.status).length;
    const totalUsers = allUsers.length;
    const chatMessages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    const todayMessages = chatMessages.filter(msg => {
        const msgDate = new Date(msg.timestamp || msg.date);
        const today = new Date();
        return msgDate.toDateString() === today.toDateString();
    }).length;
    
    // Update friends section
    const friendsSection = communitySection.querySelector('.friends-section');
    if (friendsSection) {
        const friendsListEl = friendsSection.querySelector('.friends-list');
        const friendCountEl = friendsSection.querySelector('.friend-count');
        
        if (friendCountEl) {
            friendCountEl.textContent = `${friends.length} ${friends.length === 1 ? 'friend' : 'friends'}`;
        }
        
        if (friendsListEl) {
            if (friends.length === 0) {
                friendsListEl.innerHTML = `
                    <div class="empty-state" style="text-align: center; padding: 60px 20px; color: var(--text-light); background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <i class="fas fa-user-friends" style="font-size: 4rem; margin-bottom: 20px; color: var(--accent-2); opacity: 0.6;"></i>
                        <h3 style="font-size: 1.5rem; margin-bottom: 10px; color: var(--text-light);">No friends yet</h3>
                        <p style="color: var(--text-muted); font-size: 1rem;">Start building your community by adding friends from suggestions!</p>
                    </div>
                `;
            } else {
                friendsListEl.innerHTML = friends.map(friend => {
                    const name = friend.name || friend.firstName + ' ' + friend.lastName || friend.email || 'User';
                    const initial = name.charAt(0).toUpperCase();
                    const balance = friend.balance || 0;
                    const level = friend.level || 1;
                    const status = friend.status || 'offline';
                    const statusText = status === 'online' ? 'Online' : 'Offline';
                    const friendId = friend.id || friend.email;
                    
                    return `
                        <div class="friend-card">
                            <div class="friend-avatar">${initial}</div>
                            <div class="friend-info">
                                <h4>${name}</h4>
                                <p class="friend-status ${status}">${statusText}</p>
                                <p class="friend-level">Level ${level} • $${balance.toLocaleString()}</p>
                            </div>
                            <div class="friend-actions">
                                <button class="btn btn-sm btn-outline" onclick="messageFriend('${friendId}')">
                                    <i class="fas fa-comment"></i>
                                </button>
                                <button class="btn btn-sm btn-outline" onclick="viewFriendProfile('${friendId}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }
    
    // Update suggestions section
    const suggestionsSection = communitySection.querySelector('.suggestions-section');
    if (suggestionsSection) {
        const suggestionsListEl = suggestionsSection.querySelector('.suggestions-list');
        const suggestionCountEl = suggestionsSection.querySelector('.suggestion-count');
        
        if (suggestionCountEl) {
            suggestionCountEl.textContent = `${suggestions.length} ${suggestions.length === 1 ? 'suggestion' : 'suggestions'}`;
        }
        
        if (suggestionsListEl) {
            if (suggestions.length === 0) {
                suggestionsListEl.innerHTML = `
                    <div class="empty-state" style="text-align: center; padding: 60px 20px; color: var(--text-light); background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <i class="fas fa-user-plus" style="font-size: 4rem; margin-bottom: 20px; color: var(--accent-2); opacity: 0.6;"></i>
                        <h3 style="font-size: 1.5rem; margin-bottom: 10px; color: var(--text-light);">No suggestions available</h3>
                        <p style="color: var(--text-muted); font-size: 1rem;">As more players join and register, suggestions will appear here!</p>
                    </div>
                `;
            } else {
                suggestionsListEl.innerHTML = suggestions.map(user => {
                    const name = user.name || user.firstName + ' ' + user.lastName || user.email || 'User';
                    const initial = name.charAt(0).toUpperCase();
                    const balance = user.balance || 0;
                    const level = user.level || 1;
                    const userId = user.id || user.email;
                    const createdAt = user.createdAt || user.created_at;
                    const isRecent = createdAt && (new Date() - new Date(createdAt)) < 7 * 24 * 60 * 60 * 1000;
                    const reason = isRecent ? 'Recently joined community' : 'Active player';
                    
                    return `
                        <div class="suggestion-card">
                            <div class="suggestion-avatar">${initial}</div>
                            <div class="suggestion-info">
                                <h4>${name}</h4>
                                <p class="suggestion-reason">${reason}</p>
                                <p class="suggestion-level">Level ${level} • $${balance.toLocaleString()}</p>
                            </div>
                            <div class="suggestion-actions">
                                <button class="btn btn-sm btn-primary" onclick="addFriend('${userId}')">
                                    <i class="fas fa-user-plus"></i> Add
                                </button>
                                <button class="btn btn-sm btn-outline" onclick="viewSuggestionProfile('${userId}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    }
    
    // Update community stats
    const statsSection = communitySection.querySelector('.community-stats');
    if (statsSection) {
        statsSection.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>${totalUsers.toLocaleString()}</h3>
                    <p>Total Players</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-user-check"></i>
                </div>
                <div class="stat-info">
                    <h3>${activeUsers.toLocaleString()}</h3>
                    <p>Active Players</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="stat-info">
                    <h3>${todayMessages.toLocaleString()}</h3>
                    <p>Messages Today</p>
                </div>
            </div>
        `;
    }
}

function showCommunity() {
    // Create community content if it doesn't exist FIRST (before calling showOnlyCommunity)
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        console.error('Main content not found!');
        return;
    }
    
    let communitySection = document.getElementById('community-section');
    if (!communitySection) {
        communitySection = document.createElement('div');
        communitySection.id = 'community-section';
        communitySection.className = 'section';
        communitySection.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-users"></i> Community</h2>
            </div>
            <div class="community-container">
                <!-- Friends Section -->
                <div class="friends-section">
                    <div class="section-subheader">
                        <h3><i class="fas fa-user-friends"></i> My Friends</h3>
                        <span class="friend-count">0 friends</span>
                    </div>
                    <div class="friends-list">
                        <div class="empty-state" style="text-align: center; padding: 60px 20px; color: var(--text-light); background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <i class="fas fa-user-friends" style="font-size: 4rem; margin-bottom: 20px; color: var(--accent-2); opacity: 0.6;"></i>
                            <h3 style="font-size: 1.5rem; margin-bottom: 10px; color: var(--text-light);">No friends yet</h3>
                            <p style="color: var(--text-muted); font-size: 1rem;">Start building your community by adding friends from suggestions!</p>
                        </div>
                    </div>
                </div>
                
                <!-- Friend Suggestions Section -->
                <div class="suggestions-section">
                    <div class="section-subheader">
                        <h3><i class="fas fa-user-plus"></i> Suggested Friends</h3>
                        <span class="suggestion-count">0 suggestions</span>
                    </div>
                    <div class="suggestions-list">
                        <div class="empty-state" style="text-align: center; padding: 60px 20px; color: var(--text-light); background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <i class="fas fa-user-plus" style="font-size: 4rem; margin-bottom: 20px; color: var(--accent-2); opacity: 0.6;"></i>
                            <h3 style="font-size: 1.5rem; margin-bottom: 10px; color: var(--text-light);">No suggestions available</h3>
                            <p style="color: var(--text-muted); font-size: 1rem;">As more players join and register, suggestions will appear here!</p>
                        </div>
                    </div>
                </div>
                
                <!-- Community Stats -->
                <div class="community-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3>0</h3>
                            <p>Total Players</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-user-check"></i>
                        </div>
                        <div class="stat-info">
                            <h3>0</h3>
                            <p>Active Players</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-comments"></i>
                        </div>
                        <div class="stat-info">
                            <h3>0</h3>
                            <p>Messages Today</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        mainContent.appendChild(communitySection);
    }
    
    // Load real community data
    loadCommunityData();
    
    // Now show the section (after it's created and loaded)
    showOnlyCommunity();
    updateNavigationActiveState('Community');
}

// Duplicate functions removed - using top-level definitions

let isProfileDataLoading = false;

function loadProfileData() {
    // Prevent multiple simultaneous calls
    if (isProfileDataLoading) {
        console.log('Profile data already loading, skipping...');
        return;
    }
    
    isProfileDataLoading = true;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    console.log('Loading profile data:', { user, token: !!token });
    
    if (!token || !user.email) {
        console.log('No user data found, showing guest state');
        // Show guest state instead of redirecting
        updateProfileInfo({
            name: 'Guest User',
            email: 'guest@example.com',
            balance: 0,
            firstName: 'Guest',
            lastName: 'User'
        });
        isProfileDataLoading = false;
        return;
    }
    
    // Update profile information
    updateProfileInfo(user);
    loadTransactionHistory();
    
    // Also update the sidebar user info
    updateSidebarUserInfo(user);
    
    // Reset loading flag
    isProfileDataLoading = false;
}

function updateSidebarUserInfo(user) {
    // Update sidebar user name
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';
    }
    
    // Update sidebar user balance
    const userBalance = document.getElementById('userBalance');
    if (userBalance) {
        userBalance.textContent = `$${user.balance || 0}`;
    }
    
    // Update sidebar avatar
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        if (user.avatar) {
            // Show saved avatar image
            userAvatar.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
            // Show initial letter
            const name = user.name || user.email || 'U';
            userAvatar.textContent = name.charAt(0).toUpperCase();
        }
    }
}

function updateProfileInfo(user) {
    // Update profile name and email
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');
    const profileBalance = document.getElementById('profileBalance');
    
    if (profileName) {
        profileName.textContent = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Guest User';
    }
    
    if (profileEmail) {
        profileEmail.textContent = user.email || 'guest@example.com';
    }
    
    if (profileAvatar) {
        if (user.avatar) {
            // Show saved avatar image
            profileAvatar.innerHTML = `<img src="${user.avatar}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
            // Show initial letter
            const name = user.name || user.email || 'G';
            profileAvatar.textContent = name.charAt(0).toUpperCase();
        }
    }
    
    if (profileBalance) {
        profileBalance.textContent = `$${user.balance || 0}`;
    }
    
    // Update member since date
    const memberSince = document.getElementById('memberSince');
    if (memberSince) {
        const joinDate = user.joinDate || new Date().toISOString();
        const date = new Date(joinDate);
        memberSince.textContent = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
    
    // Update game stats
    const gamesPlayed = document.getElementById('gamesPlayed');
    const winRate = document.getElementById('winRate');
    
    if (gamesPlayed) {
        gamesPlayed.textContent = user.gamesPlayed || 0;
    }
    
    if (winRate) {
        const wins = user.gamesWon || 0;
        const total = user.gamesPlayed || 0;
        const rate = total > 0 ? Math.round((wins / total) * 100) : 0;
        winRate.textContent = `${rate}%`;
    }
}

function editProfile() {
    const profileForm = document.getElementById('profileForm');
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (profileForm) profileForm.style.display = 'block';
    if (editProfileBtn) editProfileBtn.style.display = 'none';
    populateProfileForm();
}

function cancelEditProfile() {
    const profileForm = document.getElementById('profileForm');
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (profileForm) profileForm.style.display = 'none';
    if (editProfileBtn) editProfileBtn.style.display = 'inline-flex';
}

function populateProfileForm() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Populate form fields
    const firstNameField = document.getElementById('editFirstName');
    const lastNameField = document.getElementById('editLastName');
    const emailField = document.getElementById('editEmail');
    const phoneField = document.getElementById('editPhone');
    const dateOfBirthField = document.getElementById('editDateOfBirth');
    const countryField = document.getElementById('editCountry');
    
    if (firstNameField) firstNameField.value = user.firstName || '';
    if (lastNameField) lastNameField.value = user.lastName || '';
    if (emailField) emailField.value = user.email || '';
    if (phoneField) phoneField.value = user.phone || '';
    if (dateOfBirthField) dateOfBirthField.value = user.dateOfBirth || '';
    if (countryField) countryField.value = user.country || '';
}

function addBalance() {
    const amount = prompt('Enter amount to add to your balance:');
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const currentBalance = parseFloat(user.balance || 0);
        const newBalance = currentBalance + parseFloat(amount);
        
        // Update user balance
        user.balance = newBalance;
        localStorage.setItem('user', JSON.stringify(user));
        
        // Add transaction to history
        addTransaction('Deposit', parseFloat(amount), 'positive');
        
        // Update UI - both profile and sidebar
        updateProfileInfo(user);
        updateSidebarUserInfo(user);
        
        console.log('Balance updated:', newBalance);
        alert(`Successfully added $${amount} to your balance!`);
    }
}

function withdrawBalance() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentBalance = parseFloat(user.balance || 0);
    
    if (currentBalance <= 0) {
        showNotification('Insufficient balance for withdrawal', 'error');
        return;
    }
    
    const amount = prompt(`Enter amount to withdraw (Available: $${currentBalance}):`);
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        const withdrawAmount = parseFloat(amount);
        
        if (withdrawAmount > currentBalance) {
            showNotification('Insufficient balance for withdrawal', 'error');
            return;
        }
        
        const newBalance = currentBalance - withdrawAmount;
        
        // Update user balance
        user.balance = newBalance;
        localStorage.setItem('user', JSON.stringify(user));
        
        // Add transaction to history
        addTransaction('Withdrawal', withdrawAmount, 'negative');
        
        // Update UI - both profile and sidebar
        updateProfileInfo(user);
        updateSidebarUserInfo(user);
        
        console.log('Balance updated:', newBalance);
        alert(`Successfully withdrew $${amount} from your balance!`);
    }
}

function addTransaction(type, amount, category) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transaction = {
        id: Date.now(),
        userId: user.id || user.email,
        type: type.toLowerCase(), // Normalize to lowercase: 'deposit', 'withdrawal', etc.
        amount: amount,
        category: category,
        status: 'completed',
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        timestamp: new Date().toLocaleString()
    };
    
    transactions.unshift(transaction);
    
    // Keep only last 20 transactions
    if (transactions.length > 20) {
        transactions.splice(20);
    }
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Track transaction in activity tracker
    if (window.activityTracker) {
        window.activityTracker.trackTransaction(transaction);
    }
    
    loadTransactionHistory();
}

// Transaction History Modal - open and close handlers
function openTransactionHistoryModal() {
    // If already open, just refresh contents
    const existing = document.getElementById('transactionHistoryModal');
    if (existing) {
        existing.style.display = 'flex';
        loadTransactionHistory();
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'transactionHistoryModal';
    overlay.style.cssText = [
        'position:fixed','inset:0','background:rgba(0,0,0,0.8)','z-index:10001',
        'display:flex','align-items:center','justify-content:center','backdrop-filter:blur(5px)'
    ].join(';');
    
    const panel = document.createElement('div');
    panel.style.cssText = [
        'background:linear-gradient(135deg, rgba(52,73,94,0.95) 0%, rgba(44,62,80,0.95) 100%)',
        'border:1px solid rgba(39,174,96,0.3)','border-radius:16px','padding:24px','width:90%',
        'max-width:720px','max-height:80vh','box-shadow:0 20px 60px rgba(0,0,0,0.5)',
        'position:relative','display:flex','flex-direction:column','overflow:hidden'
    ].join(';');
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', 'Close');
    closeBtn.onclick = closeTransactionHistoryModal;
    closeBtn.style.cssText = [
        'position:absolute','top:12px','right:12px','background:transparent','border:none',
        'color:#2ecc71','font-size:28px','cursor:pointer','width:36px','height:36px',
        'display:flex','align-items:center','justify-content:center','border-radius:50%'
    ].join(';');
    
    const heading = document.createElement('h2');
    heading.textContent = 'Transaction History';
    heading.style.cssText = 'color:#2ecc71;margin:0 0 16px 0;font-size:22px;display:flex;align-items:center;gap:10px;';
    
    const listWrap = document.createElement('div');
    listWrap.id = 'transactionList';
    listWrap.style.cssText = 'overflow:auto;max-height:60vh;padding-right:6px;';
    
    panel.appendChild(closeBtn);
    panel.appendChild(heading);
    panel.appendChild(listWrap);
    overlay.appendChild(panel);
    
    overlay.addEventListener('click', function(e){
        if (e.target === overlay) closeTransactionHistoryModal();
    });
    
    document.body.appendChild(overlay);
    loadTransactionHistory();
}

function closeTransactionHistoryModal() {
    const modal = document.getElementById('transactionHistoryModal');
    if (modal) modal.remove();
}

function loadTransactionHistory() {
    const transactionList = document.getElementById('transactionList');
    if (!transactionList) return;
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    if (transactions.length === 0) {
        transactionList.innerHTML = `
            <div class="no-transactions">
                <i class="fas fa-receipt"></i>
                <p>No transactions yet</p>
            </div>
        `;
        return;
    }
    
    transactionList.innerHTML = transactions.map(transaction => `
        <div class="transaction-item">
            <div class="transaction-details">
                <div class="transaction-type">${transaction.type}</div>
                <div class="transaction-date">${transaction.timestamp}</div>
            </div>
            <div class="transaction-amount ${transaction.category}">
                ${transaction.category === 'positive' ? '+' : '-'}$${transaction.amount.toFixed(2)}
            </div>
        </div>
    `).join('');
}

function uploadAvatar() {
    // Create file input for avatar upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showNotification('Please select a valid image file', 'error');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('Image size must be less than 5MB', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                
                // Update profile avatar (main profile section)
                const profileAvatar = document.getElementById('profileAvatar');
                if (profileAvatar) {
                    profileAvatar.innerHTML = `<img src="${imageData}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                    console.log('Updated profile avatar');
                }
                
                // Update sidebar avatar
                const userAvatar = document.getElementById('userAvatar');
                if (userAvatar) {
                    userAvatar.innerHTML = `<img src="${imageData}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                    console.log('Updated sidebar avatar');
                }
                
                // Save avatar to localStorage
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                user.avatar = imageData;
                localStorage.setItem('user', JSON.stringify(user));
                console.log('Saved avatar to localStorage');
                
                showNotification('Avatar updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function updateNavigationState(activeSection) {
    console.log('Updating navigation state for:', activeSection);
    
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to current section
    let currentNavItem;
    if (activeSection === 'home') {
        currentNavItem = document.querySelector('[onclick="showHome()"]');
    } else if (activeSection === 'profile') {
        currentNavItem = document.querySelector('[onclick="showProfile()"]');
    } else if (activeSection === 'settings') {
        currentNavItem = document.querySelector('[onclick="showSettings()"]');
    } else if (activeSection === 'tournaments') {
        currentNavItem = document.querySelector('[onclick="showTournaments()"]');
    } else if (activeSection === 'promotions') {
        currentNavItem = document.querySelector('[onclick="showPromotions()"]');
    } else if (activeSection === 'favorites') {
        // Find nav item with Favorites text
        const navItems = document.querySelectorAll('.nav-item');
        for (let item of navItems) {
            if (item.textContent.includes('Favorites')) {
                currentNavItem = item;
                break;
            }
        }
    } else if (activeSection === 'community') {
        // Find nav item with Community text
        const navItems = document.querySelectorAll('.nav-item');
        for (let item of navItems) {
            if (item.textContent.includes('Community')) {
                currentNavItem = item;
                break;
            }
        }
    }
    
    if (currentNavItem) {
        currentNavItem.classList.add('active');
        console.log('Set active nav item:', currentNavItem);
    } else {
        console.warn('Could not find nav item for:', activeSection);
        // Try alternative selectors
        if (activeSection === 'home') {
            currentNavItem = document.querySelector('a[href="#"]:first-child');
        }
        if (currentNavItem) {
            currentNavItem.classList.add('active');
            console.log('Set active nav item (alternative):', currentNavItem);
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' : 
                    type === 'error' ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' : 
                    'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
    }
`;
document.head.appendChild(notificationStyle);

// Handle profile form submission
document.addEventListener('DOMContentLoaded', function() {
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges();
        });
    }
});

function saveProfileChanges() {
    console.log('=== saveProfileChanges called ===');
    const formData = new FormData(document.getElementById('editProfileForm'));
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('Form data:', {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email')
    });
    
    // Update user data
    user.firstName = formData.get('firstName') || user.firstName;
    user.lastName = formData.get('lastName') || user.lastName;
    user.email = formData.get('email') || user.email;
    user.phone = formData.get('phone') || user.phone;
    user.dateOfBirth = formData.get('dateOfBirth') || user.dateOfBirth;
    user.country = formData.get('country') || user.country;
    user.name = `${user.firstName} ${user.lastName}`.trim();
    
    console.log('Updated user data:', user);
    
    // Save updated user data
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update profile display
    updateProfileInfo(user);
    
    // Update sidebar user info
    updateSidebarUserInfo(user);
    
    // Hide form and show edit button
    cancelEditProfile();
    
    console.log('=== Profile updated successfully ===');
    alert('Profile updated successfully!');
}

// Function to clear all user data and reset demo accounts
function clearUserDataAndReset() {
    console.log('Clearing all user data and resetting demo accounts...');
    
    // Clear all localStorage data
    localStorage.clear();
    
    // Force page reload to reinitialize everything
    window.location.reload();
}

// Settings Management Functions - REMOVED
function loadUserSettings() {
    // Load saved settings from localStorage
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    // Apply settings to form elements
    if (settings.emailNotifications !== undefined) {
        document.getElementById('emailNotifications').checked = settings.emailNotifications;
    }
    if (settings.pushNotifications !== undefined) {
        document.getElementById('pushNotifications').checked = settings.pushNotifications;
    }
    if (settings.marketingEmails !== undefined) {
        document.getElementById('marketingEmails').checked = settings.marketingEmails;
    }
    if (settings.winNotifications !== undefined) {
        document.getElementById('winNotifications').checked = settings.winNotifications;
    }
    if (settings.soundEffects !== undefined) {
        document.getElementById('soundEffects').checked = settings.soundEffects;
    }
    if (settings.autoPlay !== undefined) {
        document.getElementById('autoPlay').checked = settings.autoPlay;
    }
    if (settings.quickBet !== undefined) {
        document.getElementById('quickBet').checked = settings.quickBet;
    }
    if (settings.twoFactorEnabled !== undefined) {
        document.getElementById('twoFactorEnabled').checked = settings.twoFactorEnabled;
    }
    if (settings.dataAnalytics !== undefined) {
        document.getElementById('dataAnalytics').checked = settings.dataAnalytics;
    }
    if (settings.realityCheck !== undefined) {
        document.getElementById('realityCheck').checked = settings.realityCheck;
    }
    if (settings.rememberMe !== undefined) {
        document.getElementById('rememberMe').checked = settings.rememberMe;
    }
    if (settings.loginNotifications !== undefined) {
        document.getElementById('loginNotifications').checked = settings.loginNotifications;
    }
    
    // Set select values
    if (settings.theme) {
        document.getElementById('themeSelect').value = settings.theme;
    }
    if (settings.language) {
        document.getElementById('languageSelect').value = settings.language;
    }
    if (settings.currency) {
        document.getElementById('currencySelect').value = settings.currency;
    }
    if (settings.profileVisibility) {
        document.getElementById('profileVisibility').value = settings.profileVisibility;
    }
    if (settings.coolingOffPeriod) {
        document.getElementById('coolingOffPeriod').value = settings.coolingOffPeriod;
    }
    if (settings.autoLogout) {
        document.getElementById('autoLogout').value = settings.autoLogout;
    }
    
    // Set limits
    if (settings.dailyDepositLimit) {
        document.getElementById('dailyDepositLimit').value = settings.dailyDepositLimit;
    }
    if (settings.dailyBettingLimit) {
        document.getElementById('dailyBettingLimit').value = settings.dailyBettingLimit;
    }
    if (settings.sessionTimeLimit) {
        document.getElementById('sessionTimeLimit').value = settings.sessionTimeLimit;
    }
    if (settings.dailyLossLimit) {
        document.getElementById('dailyLossLimit').value = settings.dailyLossLimit;
    }
    
    // Set game categories
    if (settings.slotsCategory !== undefined) {
        document.getElementById('slotsCategory').checked = settings.slotsCategory;
    }
    if (settings.tableCategory !== undefined) {
        document.getElementById('tableCategory').checked = settings.tableCategory;
    }
    if (settings.liveCategory !== undefined) {
        document.getElementById('liveCategory').checked = settings.liveCategory;
    }
    
    // Set font size
    if (settings.fontSize) {
        const fontButtons = document.querySelectorAll('.font-size-btn');
        fontButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.size === settings.fontSize) {
                btn.classList.add('active');
            }
        });
    }
    
    // Setup event listeners
    setupSettingsEventListeners();
    
    // Initialize demo data if not exists
    initializeSettingsDemoData();
}

function initializeSettingsDemoData() {
    // Initialize demo login history
    if (!localStorage.getItem('loginHistory')) {
        const loginHistory = [
            {
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                device: 'Chrome on Windows',
                location: 'New York, US',
                ip: '192.168.1.100',
                success: true
            },
            {
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                device: 'Safari on iPhone',
                location: 'New York, US',
                ip: '192.168.1.101',
                success: true
            },
            {
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                device: 'Firefox on Mac',
                location: 'Los Angeles, US',
                ip: '10.0.0.50',
                success: false
            }
        ];
        localStorage.setItem('loginHistory', JSON.stringify(loginHistory));
    }
    
    // Initialize demo active sessions
    if (!localStorage.getItem('activeSessions')) {
        const activeSessions = [
            {
                device: 'Chrome on Windows',
                location: 'New York, US',
                ip: '192.168.1.100',
                loginTime: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
            },
            {
                device: 'Safari on iPhone',
                location: 'New York, US',
                ip: '192.168.1.101',
                loginTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
            }
        ];
        localStorage.setItem('activeSessions', JSON.stringify(activeSessions));
    }
}

function setupSettingsEventListeners() {
    // Font size selector
    const fontButtons = document.querySelectorAll('.font-size-btn');
    fontButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            fontButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFontSize(this.dataset.size);
        });
    });
    
    // Theme selector
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            applyTheme(this.value);
        });
    }
    
    // Language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            applyLanguage(this.value);
        });
    }
}

function saveAllSettings() {
    const settings = {
        // Notifications
        emailNotifications: document.getElementById('emailNotifications').checked,
        pushNotifications: document.getElementById('pushNotifications').checked,
        marketingEmails: document.getElementById('marketingEmails').checked,
        winNotifications: document.getElementById('winNotifications').checked,
        loginNotifications: document.getElementById('loginNotifications').checked,
        
        // Gaming preferences
        soundEffects: document.getElementById('soundEffects').checked,
        autoPlay: document.getElementById('autoPlay').checked,
        quickBet: document.getElementById('quickBet').checked,
        
        // Responsible gaming
        sessionTimeLimit: parseInt(document.getElementById('sessionTimeLimit').value) || 120,
        dailyLossLimit: parseInt(document.getElementById('dailyLossLimit').value) || 200,
        coolingOffPeriod: document.getElementById('coolingOffPeriod').value,
        realityCheck: document.getElementById('realityCheck').checked,
        
        // Session management
        autoLogout: document.getElementById('autoLogout').value,
        rememberMe: document.getElementById('rememberMe').checked,
        
        // Security
        twoFactorEnabled: document.getElementById('twoFactorEnabled').checked,
        
        // Appearance
        theme: document.getElementById('themeSelect').value,
        language: document.getElementById('languageSelect').value,
        fontSize: document.querySelector('.font-size-btn.active')?.dataset.size || 'medium',
        
        // Financial
        dailyDepositLimit: parseInt(document.getElementById('dailyDepositLimit').value) || 1000,
        dailyBettingLimit: parseInt(document.getElementById('dailyBettingLimit').value) || 500,
        currency: document.getElementById('currencySelect').value,
        
        // Privacy
        profileVisibility: document.getElementById('profileVisibility').value,
        dataAnalytics: document.getElementById('dataAnalytics').checked,
        
        // Game categories
        slotsCategory: document.getElementById('slotsCategory').checked,
        tableCategory: document.getElementById('tableCategory').checked,
        liveCategory: document.getElementById('liveCategory').checked,
        
        // Timestamp
        lastUpdated: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    // Apply settings immediately
    applyAllSettings(settings);
    
    showNotification('Settings saved successfully!', 'success');
}

function applyAllSettings(settings) {
    // Apply theme
    if (settings.theme) {
        applyTheme(settings.theme);
    }
    
    // Apply font size
    if (settings.fontSize) {
        applyFontSize(settings.fontSize);
    }
    
    // Apply language
    if (settings.language) {
        applyLanguage(settings.language);
    }
}

function applyTheme(theme) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('theme-dark', 'theme-light', 'theme-auto');
    
    // Add new theme class
    body.classList.add(`theme-${theme}`);
    
    // Apply theme-specific styles
    if (theme === 'light') {
        body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
        body.style.color = '#333333';
    } else if (theme === 'dark') {
        body.style.background = 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)';
        body.style.color = '#ffffff';
    } else if (theme === 'auto') {
        // Auto theme - use system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            body.style.background = 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)';
            body.style.color = '#ffffff';
        } else {
            body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
            body.style.color = '#333333';
        }
    }
}

function applyFontSize(size) {
    const body = document.body;
    
    // Remove existing font size classes
    body.classList.remove('font-small', 'font-medium', 'font-large');
    
    // Add new font size class
    body.classList.add(`font-${size}`);
    
    // Apply font size styles
    if (size === 'small') {
        body.style.fontSize = '14px';
    } else if (size === 'medium') {
        body.style.fontSize = '16px';
    } else if (size === 'large') {
        body.style.fontSize = '18px';
    }
}

function applyLanguage(language) {
    // This would typically involve loading language files
    // For now, we'll just show a notification
    showNotification(`Language changed to ${language.toUpperCase()}`, 'info');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
        // Clear saved settings
        localStorage.removeItem('userSettings');
        
        // Reload the page to reset everything
        window.location.reload();
    }
}

// Settings action functions
function showPasswordChange() {
    const newPassword = prompt('Enter new password:');
    if (newPassword && newPassword.length >= 6) {
        // In a real app, this would make an API call
        showNotification('Password changed successfully!', 'success');
    } else if (newPassword) {
        showNotification('Password must be at least 6 characters long', 'error');
    }
}

function showLoginHistory() {
    // Create a simple login history modal
    const history = [
        { date: '2024-01-15 14:30', location: 'New York, US', device: 'Chrome on Windows' },
        { date: '2024-01-14 09:15', location: 'New York, US', device: 'Mobile Safari' },
        { date: '2024-01-13 20:45', location: 'New York, US', device: 'Chrome on Windows' }
    ];
    
    let historyText = 'Recent Login History:\n\n';
    history.forEach(entry => {
        historyText += `${entry.date} - ${entry.location}\n${entry.device}\n\n`;
    });
    
    alert(historyText);
}

function showCookieSettings() {
    showNotification('Cookie settings would open here', 'info');
}

function showDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
        if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
            // Clear all data
            localStorage.clear();
            showNotification('Account deleted. Redirecting to login...', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }
}

// New settings functions
function showActiveSessions() {
    const sessions = JSON.parse(localStorage.getItem('activeSessions') || '[]');
    const currentTime = new Date();
    
    let sessionInfo = 'Active Sessions:\n\n';
    if (sessions.length === 0) {
        sessionInfo += 'No active sessions found.';
    } else {
        sessions.forEach((session, index) => {
            const loginTime = new Date(session.loginTime);
            const timeDiff = Math.floor((currentTime - loginTime) / (1000 * 60)); // minutes
            sessionInfo += `${index + 1}. ${session.device} - ${session.location}\n`;
            sessionInfo += `   Logged in: ${timeDiff} minutes ago\n`;
            sessionInfo += `   IP: ${session.ip}\n\n`;
        });
    }
    
    alert(sessionInfo);
}

function downloadUserData() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    const transactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
    
    const userData = {
        profile: user,
        settings: settings,
        transactions: transactions,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `casino-max-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('User data downloaded successfully!', 'success');
}

function showPasswordChange() {
    const currentPassword = prompt('Enter your current password:');
    if (!currentPassword) return;
    
    const newPassword = prompt('Enter your new password:');
    if (!newPassword || newPassword.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    const confirmPassword = prompt('Confirm your new password:');
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // In a real app, this would be sent to the server
    showNotification('Password changed successfully!', 'success');
}

function showLoginHistory() {
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory') || '[]');
    
    let historyInfo = 'Login History:\n\n';
    if (loginHistory.length === 0) {
        historyInfo += 'No login history found.';
    } else {
        loginHistory.slice(0, 10).forEach((login, index) => {
            const loginTime = new Date(login.timestamp);
            historyInfo += `${index + 1}. ${loginTime.toLocaleString()}\n`;
            historyInfo += `   Device: ${login.device}\n`;
            historyInfo += `   Location: ${login.location}\n`;
            historyInfo += `   IP: ${login.ip}\n`;
            historyInfo += `   Status: ${login.success ? 'Success' : 'Failed'}\n\n`;
        });
    }
    
    alert(historyInfo);
}

