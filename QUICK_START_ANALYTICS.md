# 📊 Quick Start: Analytics Setup

## Step 1: Google Analytics 4 (30 minutes)

### 1. Create GA4 Account
1. Go to [analytics.google.com](https://analytics.google.com)
2. Click "Start measuring"
3. Create account name: "CasinoMax"
4. Create property: "CasinoMax Website"
5. Get your **Measurement ID** (format: G-XXXXXXXXXX)

### 2. Add to Your Site
Add this code to `index.html` in the `<head>` section (before `</head>`):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 3. Track Conversions
Add these event tracking codes to your JavaScript:

**Track Registration:**
```javascript
// In register.html or registration function
gtag('event', 'sign_up', {
  'method': 'email'
});
```

**Track First Game Play:**
```javascript
// When user starts first game
gtag('event', 'game_start', {
  'game_name': 'Slot Game',
  'game_category': 'slots'
});
```

**Track Page Views:**
```javascript
// Track navigation
gtag('event', 'page_view', {
  'page_title': 'Favorites',
  'page_location': window.location.href
});
```

---

## Step 2: Facebook Pixel (30 minutes)

### 1. Create Facebook Pixel
1. Go to [Facebook Business Manager](https://business.facebook.com)
2. Events Manager → Connect Data Sources → Web → Facebook Pixel
3. Get your **Pixel ID** (format: 123456789012345)

### 2. Add to Your Site
Add this code to `index.html` in the `<head>` section:

```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
```

Replace `YOUR_PIXEL_ID` with your actual Pixel ID.

### 3. Track Conversions
Add these to your JavaScript:

**Track Registration:**
```javascript
fbq('track', 'CompleteRegistration');
```

**Track Game Play:**
```javascript
fbq('track', 'InitiateCheckout', {
  content_name: 'Slot Game',
  content_category: 'Game Play'
});
```

---

## Step 3: TikTok Pixel (30 minutes)

### 1. Create TikTok Pixel
1. Go to [TikTok Ads Manager](https://ads.tiktok.com)
2. Assets → Events → Web Events → Create Pixel
3. Get your **Pixel ID** (format: C1234567890ABCDEF)

### 2. Add to Your Site
Add this code to `index.html` in the `<head>` section:

```html
<!-- TikTok Pixel Code -->
<script>
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
    ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
    for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
    ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
    var o=document.createElement("script");
    o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
    var a=document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(o,a)};
    ttq.load('YOUR_PIXEL_ID');
    ttq.page();
  }(window, document, 'ttq');
</script>
```

Replace `YOUR_PIXEL_ID` with your actual Pixel ID.

### 3. Track Conversions
Add these to your JavaScript:

**Track Registration:**
```javascript
ttq.track('CompleteRegistration');
```

**Track Game Play:**
```javascript
ttq.track('ClickButton', {
  content_type: 'game',
  content_name: 'Slot Game'
});
```

---

## Step 4: Add Conversion Tracking to Your Code

### In `script.js` - Add to Registration Function:

```javascript
// After successful registration
function trackRegistration(user) {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'sign_up', {
      'method': 'email',
      'user_id': user.id
    });
  }
  
  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', 'CompleteRegistration', {
      content_name: 'User Registration',
      value: 1,
      currency: 'USD'
    });
  }
  
  // TikTok Pixel
  if (typeof ttq !== 'undefined') {
    ttq.track('CompleteRegistration', {
      content_type: 'registration',
      value: 1
    });
  }
}
```

### In Game Functions - Track Game Plays:

```javascript
// When user starts a game
function trackGameStart(gameName, gameCategory) {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'game_start', {
      'game_name': gameName,
      'game_category': gameCategory
    });
  }
  
  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', 'InitiateCheckout', {
      content_name: gameName,
      content_category: gameCategory
    });
  }
  
  // TikTok Pixel
  if (typeof ttq !== 'undefined') {
    ttq.track('ClickButton', {
      content_type: 'game',
      content_name: gameName
    });
  }
}
```

---

## Step 5: Test Your Tracking

### 1. Install Browser Extensions
- **Google Analytics Debugger** (Chrome)
- **Facebook Pixel Helper** (Chrome)
- **TikTok Pixel Helper** (Chrome)

### 2. Test Events
1. Register a test account
2. Play a game
3. Check extensions to see if events fire
4. Check analytics dashboards (may take 24-48 hours to show)

---

## Step 6: Set Up Conversion Goals

### Google Analytics 4:
1. Go to Admin → Events
2. Mark "sign_up" as conversion
3. Mark "game_start" as conversion

### Facebook:
1. Events Manager → Custom Conversions
2. Create: "CompleteRegistration" event
3. Create: "GamePlay" event

### TikTok:
1. Events Manager → Web Events
2. Set up: "CompleteRegistration"
3. Set up: "GamePlay"

---

## Quick Implementation Checklist

- [ ] Google Analytics code added to `index.html`
- [ ] Facebook Pixel code added to `index.html`
- [ ] TikTok Pixel code added to `index.html`
- [ ] Registration tracking added to `script.js`
- [ ] Game play tracking added to game functions
- [ ] Tested with browser extensions
- [ ] Set up conversion goals in each platform

---

## Next Steps

After analytics are set up:
1. Let it run for 1 week to collect data
2. Review which traffic sources work best
3. Optimize ad campaigns based on data
4. Set up retargeting campaigns for users who visited but didn't register

---

**Time Investment:** ~2 hours
**Impact:** HUGE - You'll know exactly what's working and what's not!

