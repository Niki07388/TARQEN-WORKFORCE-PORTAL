import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("workforce.db");
const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT CHECK(role IN ('CTO', 'Employee'))
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    check_in TEXT,
    check_out TEXT,
    status TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    start_time TEXT,
    end_time TEXT,
    duration INTEGER,
    work_uploaded BOOLEAN DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS work_uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    user_id INTEGER,
    project_name TEXT,
    task_id TEXT,
    description TEXT,
    file_url TEXT,
    repo_link TEXT,
    created_at TEXT,
    FOREIGN KEY(session_id) REFERENCES sessions(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed initial data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run(
    "cto@tarqen.com",
    "password123",
    "Admin CTO",
    "CTO"
  );
  db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)").run(
    "employee@tarqen.com",
    "password123",
    "John Employee",
    "Employee"
  );
  
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("min_daily_hours", "8");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("max_session_duration", "4");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("late_threshold", "09:15");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("auto_checkout", "19:00");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user.role !== 'CTO') return res.status(403).json({ error: "Forbidden" });
    next();
  };

  // API Routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    
    if (user) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "8h" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 8 * 60 * 60 * 1000
      });
      res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", authenticate, (req: any, res) => {
    res.json({ user: req.user });
  });

  // Employee Routes
  app.get("/api/employee/status", authenticate, (req: any, res) => {
    const today = new Date().toISOString().split('T')[0];
    const attendance = db.prepare("SELECT * FROM attendance WHERE user_id = ? AND date = ?").get(req.user.id, today) as any;
    const activeSession = db.prepare("SELECT * FROM sessions WHERE user_id = ? AND end_time IS NULL").get(req.user.id) as any;
    
    res.json({
      checkedIn: !!attendance,
      checkInTime: attendance?.check_in || null,
      checkOutTime: attendance?.check_out || null,
      activeSession: activeSession || null,
      workedHoursToday: 0 // Mock calculation
    });
  });

  app.post("/api/employee/check-in", authenticate, (req: any, res) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString();
    
    const existing = db.prepare("SELECT * FROM attendance WHERE user_id = ? AND date = ?").get(req.user.id, today);
    if (existing) return res.status(400).json({ error: "Already checked in" });

    db.prepare("INSERT INTO attendance (user_id, date, check_in, status) VALUES (?, ?, ?, ?)").run(
      req.user.id, today, now, 'Present'
    );
    res.json({ success: true });
  });

  app.post("/api/employee/session/start", authenticate, (req: any, res) => {
    const active = db.prepare("SELECT * FROM sessions WHERE user_id = ? AND end_time IS NULL").get(req.user.id);
    if (active) return res.status(400).json({ error: "Session already active" });

    db.prepare("INSERT INTO sessions (user_id, start_time) VALUES (?, ?)").run(
      req.user.id, new Date().toISOString()
    );
    res.json({ success: true });
  });

  app.post("/api/employee/session/end", authenticate, (req: any, res) => {
    const active = db.prepare("SELECT * FROM sessions WHERE user_id = ? AND end_time IS NULL").get(req.user.id) as any;
    if (!active) return res.status(400).json({ error: "No active session" });

    const endTime = new Date().toISOString();
    const duration = Math.floor((new Date(endTime).getTime() - new Date(active.start_time).getTime()) / 1000 / 60); // minutes

    db.prepare("UPDATE sessions SET end_time = ?, duration = ? WHERE id = ?").run(
      endTime, duration, active.id
    );
    res.json({ success: true, sessionId: active.id });
  });

  app.post("/api/employee/work-upload", authenticate, (req: any, res) => {
    const { sessionId, projectName, taskId, description, repoLink } = req.body;
    
    db.prepare(`
      INSERT INTO work_uploads (session_id, user_id, project_name, task_id, description, repo_link, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(sessionId, req.user.id, projectName, taskId, description, repoLink, new Date().toISOString());

    db.prepare("UPDATE sessions SET work_uploaded = 1 WHERE id = ?").run(sessionId);
    
    res.json({ success: true });
  });

  app.get("/api/employee/attendance", authenticate, (req: any, res) => {
    const history = db.prepare("SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC").all(req.user.id);
    res.json(history);
  });

  app.get("/api/employee/sessions", authenticate, (req: any, res) => {
    const history = db.prepare("SELECT * FROM sessions WHERE user_id = ? ORDER BY start_time DESC").all(req.user.id);
    res.json(history);
  });

  // Admin Routes
  app.get("/api/admin/stats", authenticate, isAdmin, (req, res) => {
    const totalEmployees = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'Employee'").get() as any;
    const presentToday = db.prepare("SELECT COUNT(*) as count FROM attendance WHERE date = ?").get(new Date().toISOString().split('T')[0]) as any;
    
    res.json({
      totalEmployees: totalEmployees.count,
      presentToday: presentToday.count,
      absentToday: totalEmployees.count - presentToday.count,
      totalHoursToday: 42 // Mock
    });
  });

  app.get("/api/admin/employees", authenticate, isAdmin, (req, res) => {
    const employees = db.prepare(`
      SELECT u.id, u.name, u.email, 
      (SELECT status FROM attendance WHERE user_id = u.id AND date = date('now')) as today_status,
      (SELECT check_in FROM attendance WHERE user_id = u.id AND date = date('now')) as check_in_time
      FROM users u WHERE u.role = 'Employee'
    `).all();
    res.json(employees);
  });

  app.get("/api/admin/settings", authenticate, isAdmin, (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const formatted = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(formatted);
  });

  app.post("/api/admin/settings", authenticate, isAdmin, (req, res) => {
    const updates = req.body;
    const stmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    for (const [key, value] of Object.entries(updates)) {
      stmt.run(key, String(value));
    }
    res.json({ success: true });
  });

  app.get("/api/admin/employees/:id", authenticate, isAdmin, (req, res) => {
    const { id } = req.params;
    const employee = db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(id) as any;
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const attendance = db.prepare("SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC").all(id);
    const sessions = db.prepare("SELECT * FROM sessions WHERE user_id = ? ORDER BY start_time DESC").all(id);
    const work = db.prepare("SELECT * FROM work_uploads WHERE user_id = ? ORDER BY created_at DESC").all(id);

    res.json({ employee, attendance, sessions, work });
  });

  app.get("/api/employee/work-history", authenticate, (req: any, res) => {
    const history = db.prepare("SELECT * FROM work_uploads WHERE user_id = ? ORDER BY created_at DESC LIMIT 5").all(req.user.id);
    res.json(history);
  });

  app.post("/api/employee/check-out", authenticate, (req: any, res) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString();
    
    const attendance = db.prepare("SELECT * FROM attendance WHERE user_id = ? AND date = ?").get(req.user.id, today) as any;
    if (!attendance) return res.status(400).json({ error: "Not checked in today" });
    if (attendance.check_out) return res.status(400).json({ error: "Already checked out" });

    db.prepare("UPDATE attendance SET check_out = ? WHERE id = ?").run(now, attendance.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
