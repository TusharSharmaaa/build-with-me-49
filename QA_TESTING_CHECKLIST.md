# QA Testing Checklist - AI Tools List

## Performance Testing (3G Network)

### Test Setup
1. Open Chrome DevTools
2. Navigate to Network tab
3. Set throttling to "Slow 3G"
4. Disable cache for accurate testing

### Search Functionality
- [ ] Search loads within 3 seconds on 3G
- [ ] Search suggestions appear quickly
- [ ] Search results display within 3 seconds
- [ ] Images lazy-load properly
- [ ] No timeouts or errors

### Filters
- [ ] Category filter responds within 1 second
- [ ] Pricing filter (free/paid) works instantly
- [ ] Rating filter applies without lag
- [ ] Multiple filters can be combined
- [ ] Filter clear button works

### Favorites
- [ ] Favorites page loads within 2 seconds
- [ ] Favorite icon toggle is responsive
- [ ] Changes sync to database properly
- [ ] Offline cached favorites accessible
- [ ] Remove from favorites works

### Tool Detail Pages
- [ ] Tool details load within 3 seconds
- [ ] All information displays correctly
- [ ] External link button works
- [ ] Share button functions
- [ ] Reviews load properly
- [ ] Star rating displays accurately

---

## Ad Display Verification

### Banner Ads
- [ ] **Location 1:** Bottom of category pages
  - Appears correctly
  - Doesn't overlap content
  - Doesn't cause layout shift
  - Mobile friendly sizing
  
- [ ] **Location 2:** Bottom of search results
  - Appears correctly
  - Doesn't block search bar
  - Properly positioned
  
- [ ] Banner ad formatting
  - Respects safe area on mobile
  - Adapts to different screen sizes
  - Shows "Ad" label clearly

### Interstitial Ads
- [ ] Triggers after viewing 2nd tool detail
- [ ] Does not interrupt active interactions
- [ ] Has clear close button (top-right)
- [ ] Can be dismissed within 3 seconds
- [ ] Respects frequency cap (not shown too often)
- [ ] Doesn't block navigation
- [ ] Properly dismisses and resumes app

### Rewarded Video Ads
- [ ] Triggers after 10 searches
- [ ] "Unlock Bonus Tools" CTA displays
- [ ] User can skip if not interested
- [ ] Video plays without buffering issues
- [ ] Reward is granted after completion
- [ ] Close button appears after video
- [ ] Gracefully handles connection errors

### General Ad Requirements
- [ ] Ads don't cover navigation elements
- [ ] Loading states for ads don't freeze app
- [ ] Ad failures don't crash the app
- [ ] User can continue using app if ad fails
- [ ] Test mode ads appear (for pre-production)

---

## Offline Caching Verification

### Service Worker Registration
- [ ] Service worker registers on first visit
- [ ] Check in DevTools → Application → Service Workers
- [ ] Status shows "activated and running"
- [ ] sw.js file is served correctly

### Offline Functionality Test
1. **Online Phase:**
   - [ ] Visit home page
   - [ ] Browse at least 3 categories
   - [ ] View at least 5 tools
   - [ ] Check that data is cached

2. **Go Offline:**
   - [ ] DevTools → Network → Offline checkbox
   - [ ] Or disable WiFi/mobile data

3. **Offline Phase:**
   - [ ] Reload the app
   - [ ] Home page loads with cached data
   - [ ] Previously visited categories accessible
   - [ ] Previously viewed tools display
   - [ ] Graceful "offline" message for uncached content
   - [ ] Navigation between cached pages works

4. **Online Recovery:**
   - [ ] Re-enable network
   - [ ] App automatically fetches fresh data
   - [ ] Cached data updates
   - [ ] No duplicate content

### Cache Verification
- [ ] DevTools → Application → Cache Storage
- [ ] `ai-tools-list-v1` exists
- [ ] `ai-tools-offline-v1` exists
- [ ] Static assets cached (icons, manifest)
- [ ] API responses cached (professions, tools)

---

## PWA Install Prompts

### Desktop (Chrome/Edge/Safari)
- [ ] Install icon appears in address bar
- [ ] Click triggers install prompt
- [ ] App name shows correctly
- [ ] Icon displays properly
- [ ] Install completes successfully
- [ ] Installed app opens in standalone window
- [ ] App runs without browser chrome

### Android (Chrome)
- [ ] "Add to Home Screen" banner appears
  - After 30 seconds of browsing
  - Only if not previously dismissed
- [ ] Manual install via menu works
- [ ] Icon appears on home screen
- [ ] App name is correct
- [ ] Opening shows splash screen
- [ ] Splash screen uses theme color (#2563EB)
- [ ] App runs in standalone mode
- [ ] Status bar color matches theme

### iOS (Safari)
- [ ] Share → "Add to Home Screen" works
- [ ] Custom icon displays (not screenshot)
- [ ] App opens without Safari UI
- [ ] Status bar is properly styled

### PWA Manifest Validation
- [ ] DevTools → Application → Manifest
- [ ] Name: "AI Tools List"
- [ ] Short name: "AI Tools"
- [ ] Start URL: "/"
- [ ] Display: "standalone"
- [ ] Theme color: "#2563EB"
- [ ] Icons 192x192 and 512x512 present
- [ ] No manifest errors

---

## Android Mid-Tier Device Testing

### Recommended Test Devices
- Samsung Galaxy A52 / A53
- Google Pixel 6a / 7a
- OnePlus Nord series
- Xiaomi Redmi Note series
- Any device: 4GB RAM, Android 10+

### Performance Tests
- [ ] App launches within 3 seconds
- [ ] Smooth scrolling (60fps) on tool lists
- [ ] No frame drops when loading images
- [ ] Animations are smooth (transitions, modals)
- [ ] No lag when typing in search
- [ ] Category cards load quickly
- [ ] Tool detail pages render smoothly

### Memory Tests
- [ ] Use app for 10 minutes continuously
- [ ] Open/close 20+ tools
- [ ] Navigate between all pages
- [ ] Check DevTools → Memory for leaks
- [ ] App doesn't slow down over time
- [ ] No crashes due to memory

### Touch & UI Tests
- [ ] All buttons are 48x48dp minimum
- [ ] Touch targets have adequate spacing
- [ ] Swipe gestures work (if applicable)
- [ ] Pull-to-refresh works (if implemented)
- [ ] Modals dismiss with back button
- [ ] Keyboard doesn't overlap input fields
- [ ] Form inputs are easy to tap

### Rotation Tests
- [ ] App handles orientation changes
- [ ] No data loss on rotation
- [ ] Layout adapts properly
- [ ] Modals reposition correctly

### Connectivity Tests
- [ ] App handles slow 3G connection
- [ ] Graceful fallback on network loss
- [ ] Retry mechanisms work
- [ ] Timeout messages are clear
- [ ] Switching WiFi ↔ Mobile data works

### Battery Impact
- [ ] Use for 30 minutes
- [ ] Check battery drain (should be < 5%)
- [ ] No excessive CPU usage
- [ ] No battery drain when idle

---

## Accessibility Testing

### Screen Reader
- [ ] All images have alt text
- [ ] Buttons have descriptive labels
- [ ] Form inputs have associated labels
- [ ] Navigation is keyboard accessible

### Visual
- [ ] Sufficient color contrast (4.5:1 minimum)
- [ ] Text is readable at 200% zoom
- [ ] Focus indicators are visible

---

## Security Testing

### Authentication
- [ ] Login works correctly
- [ ] Logout clears session
- [ ] Protected routes redirect to auth
- [ ] Password reset flow works

### Data Privacy
- [ ] User data is not exposed
- [ ] HTTPS is enforced
- [ ] Privacy policy is accessible

---

## Final Pre-Launch Checks

- [ ] No console errors on any page
- [ ] No broken links
- [ ] All external links open in new tab
- [ ] Footer links work
- [ ] Social share buttons function
- [ ] Email/contact forms work (if present)
- [ ] Loading states display properly
- [ ] Error messages are user-friendly
- [ ] Success toasts appear correctly
- [ ] App icon displays everywhere
- [ ] Favicon is correct

---

## Test Devices Summary

Minimum devices to test:
1. ✅ Desktop Chrome (Windows/Mac)
2. ✅ Desktop Edge
3. ✅ iPhone (Safari)
4. ✅ Android mid-tier phone (Chrome)
5. ✅ Tablet (iPad or Android)

---

## Issue Tracking Template

When you find a bug, document it:

**Bug ID:** #001  
**Severity:** High / Medium / Low  
**Page:** [Page name]  
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** [What should happen]  
**Actual Result:** [What actually happened]  
**Screenshot:** [Attach if visual issue]  
**Device:** [Device model]  
**OS:** [Android 13, iOS 17, etc.]  
**Browser:** [Chrome 120, Safari 17, etc.]  

---

## Testing Sign-Off

All critical items passed:
- [ ] Performance (3G) ✅
- [ ] Ads display correctly ✅
- [ ] Offline caching works ✅
- [ ] PWA installable ✅
- [ ] Android mid-tier tested ✅

**Tester Name:** ___________________  
**Date:** ___________________  
**Ready for Production:** YES / NO  

---

**Pass Criteria:**
- Zero critical bugs
- < 5 medium bugs
- All core features functional
- App stable for 30 minutes continuous use
- No crashes on any test device
