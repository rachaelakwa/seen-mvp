# Seen MVP — Functionality Assessment

## Summary

This document assesses the current state of functionality across the Seen app as of the latest review. Issues identified have been fixed where applicable.

---

## 1. Authentication ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Sign up | ✅ Working | Creates user, redirects to mood page |
| Log in | ✅ Working | JWT stored, redirects to mood |
| Session persistence | ✅ Working | Token in localStorage, AuthContext restores user |
| Log out | ✅ Working | Clears token, redirects to landing |
| Protected routes | ✅ Working | Unauthenticated users redirected to landing |

---

## 2. Landing Page ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Hero section | ✅ Working | Text, CTAs, images |
| How It Works | ✅ Working | Scroll-triggered animations |
| Features / Testimonials | ✅ Working | Section content |
| Nav links | ✅ Working | Sign In, Get Started, How It Works |
| Footer | ✅ Working | Copyright |
| Responsive | ✅ Working | Breakpoints for mobile/tablet |

---

## 3. Mood Page ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Mood selection | ✅ Working | Chips update picks |
| Pick count (3/5) | ✅ Working | Slider adjusts recommendation count |
| Save to shelf | ✅ Working | Calls `savesService.createSave`, updates UI |
| Mood event logging | ✅ Working | Backend records mood selections |
| Tutorial | ✅ Working | Shows once for new users |

---

## 4. Circles Page ✅ (Fixed)

| Feature | Status | Notes |
|---------|--------|-------|
| **V1 (Grid)** | | |
| Friend rec cards | ✅ Working | Renders from FRIEND_RECS or API inbox |
| **Love / Save buttons** | ✅ **Fixed** | Previously only `console.log`; now calls `savesService.createSave` |
| Saved state UI | ✅ Fixed | Shows "✓ Saved" and disables when already saved |
| **V2 (Chat)** | | |
| Inbox recs | ✅ Working | Loads from API or falls back to mock data |
| Save / Ignore buttons | ✅ **Fixed** | Preloads `savedIds` from backend; save calls API correctly |
| Filter by friend | ✅ Working | Dropdown filters recs |
| Search | ✅ Working | Filters by title text |
| Recent activity | ✅ Working | Shows friends' watched items |
| Save from activity | ✅ Fixed | Same save flow, shows saved state |
| Recommend modal | ⚠️ Partial | Sends via API when friends have real user IDs; mock FRIENDS use fake IDs so send fails |

---

## 5. Vibeshelf Page ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Load saves | ✅ Working | Fetches from `savesService.getSaves` |
| Remove from shelf | ✅ Working | Calls `savesService.deleteSave` |
| Add reflection | ⚠️ Client-only | Adds item to local state; not persisted to backend |
| Empty state | ✅ Working | Message when no saves |

---

## 6. Profile Page ✅

| Feature | Status | Notes |
|---------|--------|-------|
| User info display | ✅ Working | Shows name/email from AuthContext |
| Layout | ✅ Working | Sidebar + content |

---

## 7. Onboarding & Tutorial ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Tutorial pointer | ✅ Working | Shows on first visit per page |
| Tutorial persistence | ✅ Working | Uses `TutorialContext`; runs only on first signup |
| Onboarding flow | ✅ Working | Protected route |

---

## 8. Backend API ✅

| Endpoint | Status | Notes |
|----------|--------|-------|
| `POST /api/auth/signup` | ✅ | Creates user, returns JWT |
| `POST /api/auth/login` | ✅ | Returns JWT |
| `GET /api/saves` | ✅ | Returns user's saved titles |
| `POST /api/saves` | ✅ | Creates save (titleId required, moodId optional) |
| `DELETE /api/saves/:id` | ✅ | Removes save |
| `GET /api/recs/inbox` | ✅ | Returns recs for current user |
| `POST /api/recs` | ✅ | Sends recommendation (receiverId, titleId required) |
| `POST /api/moods` | ✅ | Logs mood event |

---

## Issues Fixed in This Pass

1. **Circles V1 Love button** — Replaced `console.log` with real `savesService.createSave` call.
2. **Circles V1/V2 saved state** — Added `savedIds` preload from backend so UI reflects existing saves.
3. **Circles V2 Save button** — Ensured `handleAccept` passes full `rec` (with `moodId`) to `handleSaveToShelf`.
4. **Recent Activity Save** — Wired save handler and added `savedIds` prop for saved-state display.
5. **FriendRecCard** — Added `savedIds` prop and disabled/saved styling for Love button.

---

## Known Limitations / Not Yet Implemented

- **Circles “Send recommendation”** — Uses mock friend IDs (`friend_1`, etc.); backend expects real user ObjectIds. Needs friend system or test users.
- **Vibeshelf “Add reflection”** — Adds items locally only; no backend persistence for custom reflections.
- **Circles “Ignore” button** — Logs to console only; no API to decline/dismiss recs.
- **Circles “Link” button** — Placeholder; no external link to streaming service.
- **Recommendations** — Curated from static `PICKS` data; no ML or external catalog integration.
