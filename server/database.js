import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./database.db');
const roles = {
    owner: 1,
    admin: 2,
    member: 3
}

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        created_by INTEGER NOT NULL,

        FOREIGN KEY (created_by) REFERENCES users(id)
    )
`);


db.exec(`
    CREATE TABLE IF NOT EXISTS project_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        role INTEGER NOT NULL CHECK(role >= 1 AND role <= 4),
        
        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(project_id, user_id)
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        due_date DATETIME,
        priority INTEGER DEFAULT 1,
        status VARCHAR(50) DEFAULT 'todo',
        color VARCHAR(7) DEFAULT '#FFFFFF',
        project_id INTEGER,
        parent_task_id INTEGER,
        created_by INTEGER NOT NULL,

        FOREIGN KEY (project_id) REFERENCES projects(id),
        FOREIGN KEY (parent_task_id) REFERENCES tasks(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
    )
`);

export const getUserByEmail = db.prepare(`
    SELECT id, username, email, password_hash 
    FROM users WHERE email = ?
`);

export const getUserByUsername = db.prepare(`
    SELECT id, username, email, password_hash 
    FROM users WHERE username = ?
`);

export const addUser = db.prepare(`
    INSERT INTO users (username, email, password_hash) 
    VALUES (?, ?, ?)
`);

export const createProject = db.prepare(`
    INSERT INTO projects (name, description, is_public, created_by) 
    VALUES (?, ?, ?, ?)
`);

export const getAllUserProjects = db.prepare(`
    SELECT *
    FROM projects WHERE created_by = ?
`);

export const addProjectMember = db.prepare(`
    INSERT INTO project_members (project_id, user_id, role_id) 
    VALUES (?, ?, ?)
`);

export const getUserRoleForProject = db.prepare(`
    SELECT role FROM project_members
    WHERE project_id = ? 
    AND user_id = ?
`);

export const deleteProject = db.prepare(`
    DELETE FROM projects 
    WHERE id = ?
`);

export default db;