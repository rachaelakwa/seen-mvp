# Authentication & Database Plan for "Seen" MVP

## 1. Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv for environment configuration

### Frontend
- **React 18** (already using)
- **Storage**: localStorage for JWT tokens + secure httpOnly cookies
- **HTTP Client**: fetch API (already available)
- **State Management**: useSeenStore (existing hooks) + Context API for auth state

---

## 2. Database Schema (MongoDB Collections)

### Users Collection
```javascript
{
  _id: ObjectId (MongoDB auto-generates),
  email: string (unique, required),
  passwordHash: string (bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### SavedTitles Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to Users),
  titleId: string, // references picks.js id (e.g., "soft_1")
  moodId: string, // optional (e.g., "soft")
  savedAt: Date,
  default: { savedAt: Date.now() }
}
```

### Recommendations Collection
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref to Users),
  receiverId: ObjectId (ref to Users),
  titleId: string,
  moodId: string, // optional
  note: string, // optional ("You'd love this!")
  createdAt: Date,
  default: { createdAt: Date.now() }
}
```

### MoodEvents Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to Users),
  moodId: string, // e.g., "soft", "fried", "chaotic"
  pickCount: number, // how many shows in that mood selection
  createdAt: Date,
  default: { createdAt: Date.now() }
}
```

---

## 3. Authentication Flow

### Sign Up
```
1. User enters email + password + username
2. Frontend validates (email format, password strength)
3. POST /api/auth/signup
   - Backend validates again
   - Check if email/username exists
   - Hash password with bcryptjs
   - Create user record
   - Generate JWT token
4. Return { user, token, refreshToken }
5. Frontend stores token in localStorage + httpOnly cookie
6. Redirect to /mood page
```

### Login
```
1. User enters email + password
2. Frontend validates
3. POST /api/auth/login
   - Check if user exists
   - Compare password with bcrypt
   - If match: generate JWT + refreshToken
   - If no match: return 401
4. Return { user, token, refreshToken }
5. Frontend stores and redirects
```

### Session Persistence
```
1. On app load, check if token exists in localStorage
2. If yes: POST /api/auth/verify (with token)
3. Backend validates JWT signature
4. If valid: return user data + new token (refresh)
5. If invalid: clear localStorage, redirect to login
6. If expired: use refreshToken to get new token
```

### Logout
```
1. User clicks logout
2. Frontend clears localStorage
3. POST /api/auth/logout (optional, for server-side cleanup)
4. Redirect to /login
```

---

## 4. API Endpoints

### Authentication
```
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/verify
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

### User Profile
```
GET    /api/users/me (current user)
PUT    /api/users/me
GET    /api/users/:id (public profile)
```

### Shelf Items (CRUD)
```
GET    /api/shelf (get all user's shelf items)
GET    /api/shelf/:id
POST   /api/shelf (add to shelf)
PUT    /api/shelf/:id (update note/mood/privacy)
DELETE /api/shelf/:id
```

### Recommendations
```
GET    /api/recs (recommendations for user)
GET    /api/recs/from/:friendId
POST   /api/recs (create recommendation)
PUT    /api/recs/:id
DELETE /api/recs/:id
```

### Circles (Friends)
```
GET    /api/circles (get user's friends list)
POST   /api/circles/request (send friend request)
PUT    /api/circles/:id/accept (accept friend request)
DELETE /api/circles/:id (remove/reject friend)
GET    /api/circles/requests (pending requests)
```

### Activity
```
GET    /api/activity (user's own activity)
GET    /api/activity/friends (friends' recent activity - 1-2 per friend)
POST   /api/activity (create activity entry)
```

---

## 5. Implementation Phases

### Phase 1: Backend Setup
- [ ] Initialize Express server
- [ ] Connect PostgreSQL database
- [ ] Create Users table + schema
- [ ] Implement JWT authentication middleware
- [ ] Create /auth/signup endpoint
- [ ] Create /auth/login endpoint
- [ ] Create /auth/verify endpoint

### Phase 2: Frontend Auth
- [ ] Create AuthPage with login/signup forms
- [ ] Create useAuth context hook
- [ ] Create ProtectedRoute wrapper
- [ ] Create authService (API calls)
- [ ] Add localStorage token management
- [ ] Test sign up flow
- [ ] Test login flow
- [ ] Test session persistence

### Phase 3: Database Integration
- [ ] Create Shelf table
- [ ] Create API endpoints: POST/GET/PUT/DELETE shelf
- [ ] Update VibeshelfPage to fetch from API
- [ ] Update AddReflectionModal to save to database
- [ ] Test shelf CRUD operations

### Phase 4: Circles & Recommendations
- [ ] Create Friends table
- [ ] Create Recommendations table
- [ ] Implement friend request system
- [ ] Fetch real recommendations from database
- [ ] Update CirclesPage with real data
- [ ] Test friend add/remove flow

### Phase 5: Activity & Real Data
- [ ] Create Activity table
- [ ] Update MoodPage to save watched activity
- [ ] Fetch recommendations from other users
- [ ] Display real friends' picks
- [ ] Show real recent activity

---

## Next Steps

1. **Decide**: Custom backend OR Firebase/Supabase?
2. **Set up**: Database + backend server
3. **Implement Phase 1**: Auth endpoints
4. **Test**: Manual API testing with Postman
5. **Connect Frontend**: useAuth hook + ProtectedRoute
6. **Iterate**: Add shelf, circles, recommendations
