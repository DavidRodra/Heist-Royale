// All Games Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('All Games page loaded');
    // Initialize the All Games page
    initializeAllGames();
});

function initializeAllGames() {
    console.log('Initializing All Games page...');
    // Set up event listeners
    setupGenreFilter();
    setupGameCards();
    setupSearch();
    setupSliders();
    
    // Set up chat toggle with a small delay to ensure DOM is ready
    setTimeout(() => {
        setupChatToggle();
    }, 100);
    
    // Start live updates
    startLiveUpdates();
    console.log('All Games page initialized successfully');
}

// Genre Filter Functionality
function setupGenreFilter() {
    console.log('Setting up genre filter...');
    const genreTabs = document.querySelectorAll('.genre-tab');
    const gameCards = document.querySelectorAll('.game-card-large');
    
    console.log(`Found ${genreTabs.length} genre tabs and ${gameCards.length} game cards`);
    
    genreTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            genreTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            const selectedGenre = tab.getAttribute('data-genre');
            filterGamesByGenre(selectedGenre, gameCards);
        });
    });
}

function filterGamesByGenre(genre, gameCards) {
    gameCards.forEach(card => {
        const cardGenre = card.getAttribute('data-genre');
        
        if (genre === 'all' || cardGenre === genre) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease-in-out';
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log(`Filtered games by genre: ${genre}`);
}

// View Controls (Grid/List)
function setupViewControls() {
    console.log('Setting up view controls...');
    const viewBtns = document.querySelectorAll('.view-btn');
    const gamesContainer = document.getElementById('games-container');
    
    console.log(`Found ${viewBtns.length} view buttons and container:`, !!gamesContainer);
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            viewBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const viewType = btn.getAttribute('data-view');
            changeView(viewType, gamesContainer);
        });
    });
}

function changeView(viewType, container) {
    if (viewType === 'grid') {
        container.className = 'games-grid-large';
    } else if (viewType === 'list') {
        container.className = 'games-list';
    }
    
    console.log(`Changed view to: ${viewType}`);
}

// Game Cards Functionality
function setupGameCards() {
    console.log('Setting up game cards...');
    const gameCards = document.querySelectorAll('.game-card-large');
    
    console.log(`Found ${gameCards.length} game cards`);
    
    gameCards.forEach((card, index) => {
        console.log(`Setting up card ${index + 1}:`, card.querySelector('h3')?.textContent);
        
        // Play button functionality
        const playBtn = card.querySelector('.game-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const gameName = card.querySelector('h3').textContent;
                console.log(`Playing game: ${gameName}`);
                // Here you would typically launch the game
                showGameLaunchModal(gameName);
            });
        }
        
        // Favorite button functionality
        const favoriteBtn = card.querySelector('.game-favorite');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(favoriteBtn);
            });
        }
        
        // Card click functionality
        card.addEventListener('click', () => {
            const gameName = card.querySelector('h3').textContent;
            console.log(`Selected game: ${gameName}`);
            // Here you would typically show game details or launch
        });
    });
}

function toggleFavorite(btn) {
    const isFavorited = btn.classList.contains('favorited');
    
    if (isFavorited) {
        btn.classList.remove('favorited');
        btn.innerHTML = '<i class="fas fa-star"></i>';
        btn.style.color = '#f39c12';
    } else {
        btn.classList.add('favorited');
        btn.innerHTML = '<i class="fas fa-star"></i>';
        btn.style.color = '#ffffff';
        btn.style.background = 'rgba(243, 156, 18, 0.3)';
    }
    
    console.log(`Toggled favorite: ${!isFavorited}`);
}

function showGameLaunchModal(gameName) {
    // Create a simple modal for game launch
    const modal = document.createElement('div');
    modal.className = 'game-launch-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Launch ${gameName}</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p>This would launch the ${gameName} game in a new window or iframe.</p>
                <div class="modal-actions">
                    <button class="btn btn-primary">Launch Game</button>
                    <button class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-btn');
    const cancelBtn = modal.querySelector('.btn-secondary');
    
    const closeModal = () => {
        document.body.removeChild(modal);
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Search Functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            searchGames(searchTerm);
        });
    }
}

function searchGames(searchTerm) {
    const gameCards = document.querySelectorAll('.game-card-large');
    
    gameCards.forEach(card => {
        const gameName = card.querySelector('h3').textContent.toLowerCase();
        const gameProvider = card.querySelector('.game-provider').textContent.toLowerCase();
        
        if (gameName.includes(searchTerm) || gameProvider.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in-out';
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log(`Searched for: ${searchTerm}`);
}

// Chat Toggle functionality for All Games page - SIMPLIFIED VERSION
function setupChatToggle() {
    console.log('Setting up chat toggle for All Games page...');
    
    // Use a longer delay to ensure everything is loaded
    setTimeout(() => {
        console.log('Attempting to set up chat toggle...');
        
        const chatToggle = document.getElementById('chat-toggle');
        const chatSidebar = document.getElementById('chat-sidebar');
        const mainContent = document.querySelector('.main-content');
        
        console.log('Elements found:', {
            chatToggle: !!chatToggle,
            chatSidebar: !!chatSidebar,
            mainContent: !!mainContent
        });
        
        if (!chatToggle) {
            console.warn('Chat toggle button not found - chat functionality disabled');
            return;
        }
        
        if (!chatSidebar) {
            console.error('Chat sidebar not found!');
            return;
        }
        
        if (!mainContent) {
            console.error('Main content not found!');
            return;
        }
        
        // Global variable to track state
        window.chatVisible = true;
        
        // Simple click handler
        chatToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('CHAT TOGGLE CLICKED! Current state:', window.chatVisible);
            
            window.chatVisible = !window.chatVisible;
            
            if (window.chatVisible) {
                // Show chat
                chatSidebar.style.display = 'flex';
                chatSidebar.classList.remove('hidden');
                mainContent.classList.remove('chat-hidden');
                chatToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
                console.log('CHAT SHOWN');
            } else {
                // Hide chat
                chatSidebar.style.display = 'none';
                chatSidebar.classList.add('hidden');
                mainContent.classList.add('chat-hidden');
                chatToggle.innerHTML = '<i class="fas fa-eye"></i>';
                console.log('CHAT HIDDEN');
            }
        });
        
        console.log('Chat toggle setup complete!');
        
    }, 1000);
}

// Slider functionality for All Games page
function setupSliders() {
    console.log('Setting up sliders for All Games page...');
    
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        // Initialize games slider
        window.gamesSlider = new GameSlider('games-slider');
        
        console.log('Games slider initialized:', !!window.gamesSlider);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.gamesSlider) {
                window.gamesSlider.updateCardsPerView();
            }
        });
    }, 100);
}

// Live Updates (reuse from main script)
function startLiveUpdates() {
    // Update online count
    setInterval(() => {
        const onlineCount = document.querySelector('.online-count');
        if (onlineCount) {
            const currentCount = parseInt(onlineCount.textContent.replace(/,/g, ''));
            const newCount = currentCount + Math.floor(Math.random() * 10) - 5;
            onlineCount.textContent = newCount.toLocaleString() + ' online';
        }
    }, 30000);
    
    // Add new chat messages
    setInterval(() => {
        addRandomChatMessage();
    }, 45000);
}

function addRandomChatMessage() {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const messages = [
        { user: 'LuckyPlayer', text: 'Just won $500 on Dragon\'s Gold!', avatar: 'L' },
        { user: 'SlotMaster', text: 'The new games are amazing!', avatar: 'S' },
        { user: 'RouletteKing', text: 'Lightning Roulette is on fire! 🔥', avatar: 'R' },
        { user: 'CasinoPro', text: 'Blackjack Pro is my favorite!', avatar: 'C' }
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.innerHTML = `
        <div class="message-avatar ${randomMessage.user.toLowerCase().replace(/\s+/g, '-')}">${randomMessage.avatar}</div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-user">${randomMessage.user}</span>
                <span class="message-time">${timeString}</span>
            </div>
            <div class="message-text">${randomMessage.text}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    
    // Remove old messages if too many
    const allMessages = chatMessages.querySelectorAll('.chat-message');
    if (allMessages.length > 10) {
        chatMessages.removeChild(allMessages[0]);
    }
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add CSS for animations
const allGamesStyle = document.createElement('style');
allGamesStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .game-launch-modal .modal-content {
        background: linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(52, 73, 94, 0.9) 100%);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .modal-header h3 {
        color: #ffffff;
        margin: 0;
    }
    
    .close-btn {
        background: none;
        border: none;
        color: #bdc3c7;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-body p {
        color: #bdc3c7;
        margin-bottom: 20px;
    }
    
    .modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
    }
`;
document.head.appendChild(allGamesStyle);
