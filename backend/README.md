# Seen Backend

Backend API for Seen MVP - a mood-based streaming recommendation app.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

**Required env vars:**
- `MONGODB_URI` - MongoDB connection string (e.g., `mongodb://localhost:27017/seen`)
- `JWT_SECRET` - Secret key for signing tokens (generate a strong one)
- `PORT` - Server port (default: 5000)
- `CLIENT_ORIGIN` - Frontend URL for CORS (default: http://localhost:5173)

### 3. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# https://docs.mongodb.com/manual/installation/

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Connect to check
mongosh
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/seen`
4. Add to `.env` as `MONGODB_URI`

### 4. Run Dev Server

```bash
npm run dev
```

Server starts on `http://localhost:5000`

---

## API Endpoints

### Authentication

**POST /api/auth/signup**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```
Response:
```json
{
  "user": { "id": "...", "email": "user@example.com" },
  "accessToken": "eyJhbGc..."
}
```

**POST /api/auth/login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**GET /api/auth/me**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

### Saves

**GET /api/saves** - Get user's saves
```bash
curl -X GET http://localhost:5000/api/saves \
  -H "Authorization: Bearer eyJhbGc..."
```

**POST /api/saves** - Save a title
```bash
curl -X POST http://localhost:5000/api/saves \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"titleId":"soft_1","moodId":"soft"}'
```

**DELETE /api/saves/:id** - Delete a save
```bash
curl -X DELETE http://localhost:5000/api/saves/65abc123... \
  -H "Authorization: Bearer eyJhbGc..."
```

### Recommendations

**POST /api/recs** - Send recommendation
```bash
curl -X POST http://localhost:5000/api/recs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"receiverId":"65xyz789...","titleId":"soft_1","note":"You'd love this!"}'
```

**GET /api/recs/inbox** - Get recommendations sent to you
```bash
curl -X GET http://localhost:5000/api/recs/inbox \
  -H "Authorization: Bearer eyJhbGc..."
```

**GET /api/recs/sent** - Get recommendations you sent
```bash
curl -X GET http://localhost:5000/api/recs/sent \
  -H "Authorization: Bearer eyJhbGc..."
```

### Mood Events

**POST /api/moods/events** - Record mood selection
```bash
curl -X POST http://localhost:5000/api/moods/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"moodId":"soft","pickCount":5}'
```

**GET /api/moods/events** - Get mood events
```bash
curl -X GET http://localhost:5000/api/moods/events \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration (DB, env)
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── utils/           # Helper functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── package.json
├── .env.example
└── README.md
```

---

## Notes

- **Frontend recommendations** stay in React with hardcoded PICKS data (deterministic)
- **Backend persistence** for user saves, recommendations, and mood events
- **JWT tokens** expire after 24 hours
- **MongoDB** collections auto-created on first use (Mongoose handles schema)
- **CORS** configured to allow frontend requests from localhost:5173

---

## Troubleshooting

**MongoDB connection failed?**
- Check `MONGODB_URI` in `.env`
- Ensure MongoDB is running: `brew services list` or `mongosh`

**Port already in use?**
- Change `PORT` in `.env`
- Or kill process: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

**Token invalid?**
- Tokens expire after 24 hours
- User needs to login again for new token

**Duplicate key error?**
- MongoDB enforces unique constraint on email
- Use different email or clear database: `mongosh` → `use seen` → `db.users.deleteMany({})`
