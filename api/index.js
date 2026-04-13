import app from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/db.js';

let dbReady;

async function ensureDB() {
  if (!dbReady) {
    dbReady = connectDB().catch((error) => {
      dbReady = null;
      throw error;
    });
  }
  return dbReady;
}

export default async function handler(req, res) {
  await ensureDB();
  return app(req, res);
}
