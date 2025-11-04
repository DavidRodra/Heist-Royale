// Firebase Configuration
// Replace these values with your actual Firebase config from Firebase Console
// Get it from: Firebase Console → Project Settings → Your apps → Web app

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

// Initialize Firebase
let firebaseApp, auth, db;

try {
  // Check if Firebase is already initialized
  if (firebase.apps.length === 0) {
    firebaseApp = firebase.initializeApp(firebaseConfig);
  } else {
    firebaseApp = firebase.app();
  }
  
  // Initialize Firebase services
  auth = firebase.auth();
  db = firebase.firestore();
  
  // Enable offline persistence (optional - for better performance)
  // db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
  //   if (err.code === 'failed-precondition') {
  //     console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  //   } else if (err.code === 'unimplemented') {
  //     console.warn('The current browser does not support persistence.');
  //   }
  // });
  
  console.log('✅ Firebase initialized successfully');
  
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// Export Firebase services for use in other files
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseApp = firebaseApp;

// Firebase helper functions
window.firebaseHelpers = {
  // Test Firebase connection
  testConnection: async function() {
    try {
      await db.collection('test').doc('connection').set({
        timestamp: new Date().toISOString(),
        status: 'connected'
      });
      console.log('✅ Firebase connection test successful!');
      return true;
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      return false;
    }
  },
  
  // Check if Firebase is configured
  isConfigured: function() {
    return firebaseConfig.apiKey !== "YOUR_API_KEY_HERE" && 
           firebaseConfig.projectId !== "YOUR_PROJECT_ID_HERE";
  },
  
  // Get current user
  getCurrentUser: function() {
    return auth ? auth.currentUser : null;
  }
};

// Monitor auth state changes
if (auth) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('✅ User signed in:', user.email);
    } else {
      console.log('👋 User signed out');
    }
  });
}

