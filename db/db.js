import sqlite from "better-sqlite3";

export const db = sqlite("hauth.db");

// user schema //
db.exec(`CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    is_achieve INTEGER DEFAULT 0
)`);

db.exec(`CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
)`);

// role managament //
db.exec(`CREATE TABLE IF NOT EXISTS role (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS user_role (
    id TEXT NOT NULL PRIMARY KEY,
    user_id TEXT NOT NULL,
    role_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
)`);
