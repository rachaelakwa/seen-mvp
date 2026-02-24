# Backend Implementation Walkthrough

## Overall Architecture (Simple Diagram)

```
Client (React)
    ↓
HTTPS Request
    ↓
Express Server (Node.js)
    ├─ Routes (http://localhost:5000/api/auth/login)
    ├─ Controllers (business logic)
    ├─ Models (Mongoose schemas + queries)
    └─ Middleware (auth, validation, error handling)
    ↓
MongoDB Database
    ├─ Users collection
    ├─ SavedTitles collection
    ├─ Recommendations collection
    └─ MoodEvents collection
    ↓
JSON Response back to Client
```

---

## How a Request Flows Through the Backend

### Example: User Login Request

```
1. User clicks "Login" button on frontend
   ↓
2. Frontend calls: POST /api/auth/login
   { email: "user@example.com", password: "Password123" }
   ↓
3. Express receives request at PORT 3001
   ↓
4. CORS Middleware: ✓ checks if request comes from allowed origin
   ↓
5. JSON Parser: ✓ converts JSON body to JS object
   ↓
6. Router Matcher: ✓ finds route /api/auth/login (POST)
   ↓
7. Controller Method: authController.login()
   - Extracts email & password from req.body
   - Calls Model: User.findOne({ email })
   - Gets user document with passwordHash
   - Compares password with bcrypt.compare()
   - If match: generates JWT token
   - If no match: returns 401 error
   ↓
8. Model.findOne()
   - Queries MongoDB: db.users.findOne({ email })
   - Mongoose returns user document
   ↓
9. Controller generates tokens using JWT
   - Signs payload { userId } with secret key
   - Creates access token (15 min expiry)
   - Creates refresh token (7 day expiry)
   ↓
10. Response sent back to frontend:
    {
      user: { id: "...", email: "...", username: "..." },
      accessToken: "eyJhbGc...",
      refreshToken: "eyJhbGc..."
    }
    ↓
11. Frontend receives JSON response
    - Stores accessToken in localStorage
    - Sets user state
    - Redirects to /mood page
```

---

## Backend File Breakdown

### 1. Entry Point: src/index.js

```javascript
// This is where the server starts
require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware setup (order matters!)
app.use(cors({...}));           // Allow frontend to call backend
app.use(express.json());        // Parse JSON requests

// Routes
app.use('/api/auth', authRoutes); // /api/auth/* routes go here

// Error handling
app.use(errorHandler);

// Start listening
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

**Why this structure?**
- Middleware runs in order (top to bottom)
- CORS must come before routes
- JSON parser must come before controllers read req.body
- Error handler must come last

---

### 2. Routes: src/routes/auth.js

```javascript
const router = express.Router();

// These define the HTTP paths
router.post('/signup', AuthController.signup);
// POST /api/auth/signup → calls AuthController.signup()

router.post('/login', AuthController.login);
// POST /api/auth/login → calls AuthController.login()

router.post('/verify', authMiddleware, AuthController.verify);
// POST /api/auth/verify → checks auth FIRST, then calls verify()
// authMiddleware throws error if no valid token
```

**Request paths map like this:**
```
POST /api/auth/login
  ↓
matches route: router.post('/login', ...)
  ↓
calls authController.login(req, res, next)
  ↓
sends JSON response
```

---

### 3. Controllers: src/controllers/authController.js

```javascript
class AuthController {
  static async login(req, res, next) {
    // req = incoming request { body, headers, params, ... }
    // res = response object { json(), status(), send(), ... }
    // next = call next middleware/error handler
    
    try {
      // Extract data from request
      const { email, password } = req.body;
      
      // Call database via Model
      const user = await User.findOne({ email });
      
      // Business logic
      if (!user) {
        return res.status(401).json({ error: 'Invalid email' });
      }
      
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
      
      // Generate tokens
      const tokens = generateTokens(user._id);
      
      // Send response
      res.json({
        user: { id: user._id, email: user.email },
        accessToken: tokens.accessToken,
      });
      
    } catch (err) {
      next(err); // Pass to error handler
    }
  }
}
```

**Controller responsibilities:**
- ✅ Extract data from request
- ✅ Validate inputs
- ✅ Call Model for database queries
- ✅ Execute business logic
- ✅ Return formatted response

**NOT responsible for:**
- ❌ Database queries (that's Model)
- ❌ Authentication (that's Middleware)
- ❌ Error handling (pass to next())

---

### 4. Models: src/models/User.js (Mongoose Schema)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware: hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

// Static method: find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

module.exports = mongoose.model('User', userSchema);
```

**Usage in Controller:**
```javascript
const user = await User.findByEmail(email);
// Returns user document or null
```

---

### 5. Middleware: src/middleware/auth.js

```javascript
function authMiddleware(req, res, next) {
  // Runs BEFORE controller
  
  // Extract token from header
  const token = req.headers.authorization?.split(' ')[1];
  // "Bearer eyJhbGc..." → extract "eyJhbGc..."
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  // Verify token with secret key
  const decoded = verifyAccessToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // Token is valid! Pass userId to next function
  req.userId = decoded.userId;
  next(); // Continue to controller
}
```

**Usage in routes:**
```javascript
router.post('/verify', authMiddleware, AuthController.verify);
           ↑                  ↑
      path            middleware runs FIRST

// So: /verify checks auth BEFORE calling verify()
```

**Flow:**
```
Request arrives
    ↓
authMiddleware runs
  ├─ Check for token
  ├─ Verify JWT signature
  ├─ If invalid: return 401 error
  └─ If valid: set req.userId and call next()
    ↓
AuthController.verify(req, res, next) runs
  ├─ Can access req.userId (set by middleware)
  └─ Returns user data
```

---

### 6. Utils: JWT & Password

#### JWT Tokens

```javascript
// Signing (creating a token)
const token = jwt.sign(
  { userId: "123" },              // data to encode
  process.env.JWT_SECRET,         // secret key
  { expiresIn: '15m' }           // expires in 15 minutes
);
// Result: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Verifying (checking if token is valid)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
// If valid: returns { userId: "123", iat: ..., exp: ... }
// If invalid/expired: throws error
```

**How it works:**
1. Server has a secret key (never share!)
2. Server signs data with secret → creates token
3. Client stores token in localStorage
4. Client sends token in every request header
5. Server verifies token using same secret
6. If someone tries to forge a token, verification fails

---

#### Password Hashing

```javascript
// Hashing (one-way encryption)
const password = "Password123";
const hash = await bcrypt.hash(password, 10);
// Result: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS5xLsCVWFAlC"
// Different hash every time! (random salt)

// Comparing (checking password)
const isMatch = await bcrypt.compare("Password123", hash);
// Returns: true

const isMatch = await bcrypt.compare("WrongPassword", hash);
// Returns: false
```

**Why not plain text?**
- ❌ Database leaks = all passwords exposed
- ❌ Can't verify password without storing it

**Why bcrypt?**
- ✅ One-way (can't decrypt)
- ✅ Salted (each hash different)
- ✅ Slow (brute force attacks = slow)

---

## Database Flow

### SQL Queries (Raw)

```javascript
// Example from authController.login()

// 1. Find user by email
await pool.query(
  'SELECT id, email, username, password_hash FROM users WHERE email = $1',
  [email]
);
// Sends: SELECT ... FROM users WHERE email = 'user@example.com'

// 2. Create new user
await pool.query(
  `INSERT INTO users (id, email, username, password_hash, display_name)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING id, email, username`,
  [id, email, username, passwordHash, displayName]
);
// Sends: INSERT INTO users ... VALUES (...)
// Returns newly created user data
```

**Parameter Placeholders (`$1, $2`):**
- ✅ Safe from SQL injection
- ✅ Database escapes values automatically
- ❌ `[email]` not interpolated into SQL string

**Why not template literals?**
```javascript
// DANGEROUS!
`SELECT * FROM users WHERE email = '${email}'`
// If email = "'; DROP TABLE users; --"
// Becomes: SELECT ... WHERE email = ''; DROP TABLE users; --'
// SQL injection attack!

// SAFE:
'SELECT * FROM users WHERE email = $1'
// Parameter stays separate, can't inject SQL
```

---

### Database Tables

```sql
-- Users table (stores user accounts)
users
├─ id (UUID primary key)
├─ email (unique)
├─ username (unique)
├─ password_hash (hashed)
├─ display_name
├─ avatar_color
├─ created_at

-- Shelf Items (user's saved shows)
shelf_items
├─ id
├─ user_id (foreign key → users.id)
├─ title_id (string like "soft_1")
├─ note
├─ mood_tags (array)
├─ is_private
└─ saved_at

-- Foreign Key Relationship
shelf_items.user_id → users.id
// If user is deleted, all shelf items deleted too (CASCADE)
```

---

## Request/Response Examples

### POST /api/auth/signup

**Request (frontend sends):**
```javascript
{
  email: "alice@example.com",
  username: "alice",
  password: "Password123",
  displayName: "Alice Smith"
}
```

**Backend Process:**
```javascript
1. authController.signup(req, res, next)
   ├─ Validate email format ✓
   ├─ Validate password (8+ chars, uppercase, number) ✓
   ├─ Validate username (3-20 alphanumeric) ✓
   ├─ Check if email exists
   │  └─ User.findByEmail(email) → query DB → not found ✓
   ├─ Hash password
   │  └─ bcrypt.hash("Password123", 10) → "$2b$10..."
   ├─ Create user
   │  └─ User.create({...}) → INSERT INTO users → ID "uuid-123"
   └─ Generate tokens
      ├─ jwt.sign({ userId: "uuid-123" }, SECRET, { expiresIn: '15m' })
      │  → "eyJhbGc..."
      └─ jwt.sign({ userId: "uuid-123" }, REFRESH_SECRET, { expiresIn: '7d' })
         → "eyJhbGc..." (different token)
```

**Response (backend sends):**
```javascript
{
  user: {
    id: "uuid-123",
    email: "alice@example.com",
    username: "alice",
    display_name: "Alice Smith",
    avatar_color: "#667eea"
  },
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Frontend (after getting response):**
```javascript
localStorage.setItem('token', accessToken);
localStorage.setItem('refreshToken', refreshToken);
setUser(user);
navigate('/mood');
```

---

### POST /api/auth/verify (with Auth Middleware)

**Request (frontend sends):**
```
POST /api/auth/verify
Header: Authorization: Bearer eyJhbGc...
```

**Backend Process:**
```javascript
1. authMiddleware runs FIRST
   ├─ Extract token from header → "eyJhbGc..."
   ├─ Verify token → decode to { userId: "uuid-123" }
   ├─ Check signature is valid ✓
   ├─ Check expiration (15 min) ✓
   └─ Set req.userId = "uuid-123"
   └─ Call next() → AuthController.verify()

2. authController.verify(req, res, next)
   ├─ Access req.userId (set by middleware)
   ├─ Query database
   │  └─ User.findById("uuid-123") → SELECT FROM users WHERE id = $1
   └─ Return user data
```

**Response:**
```javascript
{
  user: {
    id: "uuid-123",
    email: "alice@example.com",
    username: "alice",
    display_name: "Alice Smith",
    avatar_color: "#667eea",
    created_at: "2026-02-21T10:30:00Z"
  }
}
```

**Frontend (on app load):**
```javascript
// useAuth hook
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    authService.verify(token)
      .then(data => setUser(data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsLoading(false));
  }
}, []);

// Result: User is automatically logged in if token still valid!
```

---

## Error Handling Flow

### When Something Goes Wrong

```javascript
// Example: User tries to login with wrong password

1. authController.login()
   ├─ Query user by email → found
   ├─ Compare password → doesn't match
   └─ return res.status(401).json({ error: 'Invalid password' });
      └─ Response stops here, error handler NOT called

2. Frontend receives:
   status: 401
   body: { error: 'Invalid password' }
   └─ Catches in try/catch
   └─ Shows error message to user

---

// Example: Unexpected database error

1. authController.login()
   ├─ User.getByEmailWithPassword(email)
   │  └─ Database connection fails (network error)
   │  └─ throw Error('Connection refused')
   └─ catch (err) { next(err); }
      └─ Passes error to error handler middleware

2. errorHandler middleware
   ├─ Logs error
   ├─ Returns res.status(500).json({ error: 'Internal server error' })
   └─ In development: also includes stack trace

3. Frontend receives:
   status: 500
   body: { error: 'Internal server error' }
   └─ Shows generic error to user (doesn't reveal internals)
```

---

## Summary: How It All Connects

```
Frontend Component (React)
    ↓
authService.login(email, password)
    ↓ fetch POST /api/auth/login
Backend Port 3001
    ↓
Express Routes: router.post('/login', ...)
    ↓
AuthController.login(req, res, next)
    ├─ extract req.body
    ├─ validate inputs
    ├─ call User Model
    ├─ business logic (compare passwords)
    └─ res.json({ user, tokens })
    ↓
(Controller calls Model)
User.getByEmailWithPassword(email)
    ├─ SQL query via pg pool
    ├─ PostgreSQL database
    └─ returns user row
    ↓
(Back to Controller)
Generate JWT tokens
    ↓
Send Response to Frontend
    ↓
Frontend localStorage.setItem('token', ...)
    ↓
Frontend navigate('/mood')
    ↓
User sees mood page!
```

---

## Key Concepts to Remember

| Concept | Purpose | Example |
|---------|---------|---------|
| **Routes** | Define HTTP paths | `POST /api/auth/login` |
| **Controllers** | Business logic | Check password, generate token |
| **Models** | Database queries | `User.getByEmailWithPassword()` |
| **Middleware** | Pre/post processing | Check auth token before controller |
| **Utilities** | Helper functions | Hash password, sign JWT |
| **Middleware Order** | Matters! | CORS → JSON Parser → Routes → Errors |
| **Async/Await** | Handle long operations | `await pool.query()`, `await bcrypt.hash()` |
| **Try/Catch** | Error handling | Catch errors, pass to next() |

---

## Common Workflow

```
1. Write a controller function
2. It calls Model.query()
3. Model returns data
4. Controller processes data
5. Controller sends res.json()
6. If error: next(error)
7. Error handler catches & responds
```

That's the entire backend flow!
