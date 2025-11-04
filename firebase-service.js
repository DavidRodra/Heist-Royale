// Firebase Service Layer
// This file provides easy-to-use functions for Firebase operations
// Replaces localStorage with Firebase Firestore

class FirebaseService {
  constructor() {
    this.db = window.firebaseDb;
    this.auth = window.firebaseAuth;
    
    if (!this.db) {
      console.warn('⚠️ Firebase not initialized. Make sure firebase-config.js is loaded first.');
    }
  }
  
  // ==================== USER OPERATIONS ====================
  
  /**
   * Register a new user with Firebase Auth
   */
  async registerUser(email, password, userData) {
    try {
      // Create auth user
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Create user document in Firestore
      const userDoc = {
        id: user.uid,
        email: email.toLowerCase(),
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        country: userData.country || 'US',
        currency: userData.currency || 'USD',
        dateOfBirth: userData.dateOfBirth || '',
        balance: 1000.00, // Welcome bonus
        isActive: true,
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: null,
        gamesPlayed: 0,
        gamesWon: 0
      };
      
      // Save to Firestore
      await this.db.collection('users').doc(user.uid).set(userDoc);
      
      // Track registration event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'sign_up', { method: 'email' });
      }
      
      return {
        success: true,
        user: userDoc,
        uid: user.uid
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: this.getErrorMessage(error)
      };
    }
  }
  
  /**
   * Login user with Firebase Auth
   */
  async loginUser(email, password) {
    try {
      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await this.db.collection('users').doc(user.uid).get();
      
      if (!userDoc.exists) {
        throw new Error('User document not found');
      }
      
      const userData = userDoc.data();
      
      // Update last login
      await this.db.collection('users').doc(user.uid).update({
        lastLogin: new Date().toISOString()
      });
      
      return {
        success: true,
        user: {
          id: user.uid,
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`.trim() || userData.email,
          balance: userData.balance || 0,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          country: userData.country || '',
          currency: userData.currency || 'USD',
          dateOfBirth: userData.dateOfBirth || '',
          joinDate: userData.createdAt || new Date().toISOString(),
          gamesPlayed: userData.gamesPlayed || 0,
          gamesWon: userData.gamesWon || 0
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: this.getErrorMessage(error)
      };
    }
  }
  
  /**
   * Get current user data
   */
  async getCurrentUserData() {
    try {
      const user = this.auth.currentUser;
      if (!user) return null;
      
      const userDoc = await this.db.collection('users').doc(user.uid).get();
      if (!userDoc.exists) return null;
      
      return userDoc.data();
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
  
  /**
   * Update user data
   */
  async updateUserData(updates) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      await this.db.collection('users').doc(user.uid).update({
        ...updates,
        updatedAt: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, message: error.message };
    }
  }
  
  /**
   * Update user balance
   */
  async updateUserBalance(newBalance) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      await this.db.collection('users').doc(user.uid).update({
        balance: newBalance,
        updatedAt: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Update balance error:', error);
      return { success: false, message: error.message };
    }
  }
  
  /**
   * Logout user
   */
  async logoutUser() {
    try {
      await this.auth.signOut();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: error.message };
    }
  }
  
  // ==================== TRANSACTION OPERATIONS ====================
  
  /**
   * Add a transaction
   */
  async addTransaction(transactionData) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const transaction = {
        id: 'tx-' + Date.now(),
        userId: user.uid,
        ...transactionData,
        createdAt: new Date().toISOString(),
        status: transactionData.status || 'completed'
      };
      
      await this.db.collection('transactions').add(transaction);
      
      return { success: true, transaction };
    } catch (error) {
      console.error('Add transaction error:', error);
      return { success: false, message: error.message };
    }
  }
  
  /**
   * Get user transactions
   */
  async getUserTransactions() {
    try {
      const user = this.auth.currentUser;
      if (!user) return [];
      
      const snapshot = await this.db
        .collection('transactions')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();
      
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Get transactions error:', error);
      return [];
    }
  }
  
  // ==================== GAME OPERATIONS ====================
  
  /**
   * Get all games
   */
  async getGames() {
    try {
      const snapshot = await this.db.collection('games').where('isActive', '==', true).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Get games error:', error);
      return [];
    }
  }
  
  /**
   * Get game by ID
   */
  async getGameById(gameId) {
    try {
      const doc = await this.db.collection('games').doc(gameId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Get game error:', error);
      return null;
    }
  }
  
  // ==================== HELPER FUNCTIONS ====================
  
  /**
   * Get user-friendly error messages
   */
  getErrorMessage(error) {
    const errorCode = error.code || error.message;
    
    const errorMessages = {
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled',
      'auth/weak-password': 'Password is too weak',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'permission-denied': 'Permission denied. Please check your account.',
      'unavailable': 'Service temporarily unavailable. Please try again later.'
    };
    
    return errorMessages[errorCode] || error.message || 'An error occurred. Please try again.';
  }
  
  /**
   * Check if Firebase is available
   */
  isAvailable() {
    return this.db && this.auth;
  }
}

// Initialize Firebase Service
window.firebaseService = new FirebaseService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FirebaseService;
}

