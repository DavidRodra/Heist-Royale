# 🔥 Firebase Setup Guide (FREE TIER)

## Why Firebase?
- **100% Free** for your needs (up to 50K reads/day, 20K writes/day)
- **Easy setup** - No server needed
- **Real-time** database updates
- **Built-in authentication**
- **Scales automatically** - Pay only when you exceed free tier

## Free Tier Limits (More than enough to start):
- **Storage:** 1 GB
- **Database reads:** 50,000/day
- **Database writes:** 20,000/day
- **Authentication:** 50,000 MAU (Monthly Active Users)
- **Network egress:** 10 GB/month

**You won't hit these limits for a LONG time!**

---

## Step 1: Create Firebase Project (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: **"Arcane Games"**
4. Disable Google Analytics (not needed for now) - Click **"Continue"**
5. Click **"Create project"**
6. Wait for setup (30 seconds)
7. Click **"Continue"**

---

## Step 2: Enable Firestore Database (2 minutes)

1. In Firebase Console, click **"Firestore Database"** in left menu
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose a **location** closest to your users (e.g., `us-east1` for US)
5. Click **"Enable"**
6. Wait 1-2 minutes for setup

---

## Step 3: Enable Authentication (2 minutes)

1. Click **"Authentication"** in left menu
2. Click **"Get started"**
3. Click **"Email/Password"** tab
4. Enable **"Email/Password"** (first toggle)
5. **Disable** "Email link (passwordless sign-in)" (second toggle)
6. Click **"Save"**

---

## Step 4: Get Your Firebase Config (1 minute)

1. Click **"Project settings"** (gear icon) in left menu
2. Scroll down to **"Your apps"** section
3. Click **"</>"** (web icon)
4. Register app name: **"CasinoMax Web"**
5. **Check** "Also set up Firebase Hosting" (optional, but helpful)
6. Click **"Register app"**
7. **Copy the config code** - It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "casinomax-xxxxx.firebaseapp.com",
  projectId: "casinomax-xxxxx",
  storageBucket: "casinomax-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

**Save this config - you'll need it!**

---

## Step 5: Set Up Security Rules (IMPORTANT!)

1. Go to **"Firestore Database"** → **"Rules"** tab
2. Replace the rules with this (secure but allows your app to work):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Games collection - anyone can read, only admins write
    match /games/{gameId} {
      allow read: if true;
      allow write: if false; // Only admins (we'll add admin check later)
    }
    
    // Transactions - users can only read/write their own
    match /transactions/{transactionId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // User achievements - users can only read their own
    match /user_achievements/{achievementId} {
      allow read: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"**

---

## Step 6: Install Firebase SDK

You have two options:

### Option A: CDN (Easiest - No build step)
Add to `index.html` before closing `</head>`:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
```

### Option B: npm (If using build tools)
```bash
npm install firebase
```

**We'll use Option A (CDN) for simplicity.**

---

## Step 7: Initialize Firebase in Your Code

Create a new file: `firebase-config.js`

```javascript
// Your Firebase config (from Step 4)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other files
window.firebaseAuth = auth;
window.firebaseDb = db;
```

---

## Step 8: Test Connection

Add this to test if Firebase is working:

```javascript
// Test Firebase connection
db.collection('test').doc('connection').set({
  timestamp: new Date().toISOString(),
  status: 'connected'
}).then(() => {
  console.log('✅ Firebase connected successfully!');
}).catch((error) => {
  console.error('❌ Firebase connection error:', error);
});
```

---

## Next Steps

After Firebase is set up:
1. ✅ Update login to use Firebase Auth
2. ✅ Update registration to use Firebase Auth + Firestore
3. ✅ Migrate user data from localStorage to Firestore
4. ✅ Update game data to use Firestore
5. ✅ Update transaction tracking to use Firestore

---

## Cost Estimate

**Free Tier:** $0/month (up to 50K reads/day)
**When you exceed:** ~$0.06 per 100K reads after free tier

**You won't pay anything for months!**

---

## Troubleshooting

### "Firestore not initialized"
- Make sure you added Firebase SDK scripts before your code
- Check that firebaseConfig is correct

### "Permission denied"
- Check Firestore security rules
- Make sure user is authenticated

### "Quota exceeded"
- You've hit free tier limits (unlikely)
- Check Firebase Console → Usage tab

---

## Security Best Practices

1. **Never expose your Firebase config** - It's okay for client-side, but:
   - Don't commit API keys to public repos (use environment variables)
   - Set up proper security rules (we did this in Step 5)

2. **Always validate data** on the server side (when you add backend later)

3. **Use Firebase Auth** for authentication (we'll set this up)

---

**Ready to implement? Let me know when you have your Firebase config!**
