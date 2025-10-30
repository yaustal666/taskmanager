import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./database.db');
export const roles = {
    owner: 1,
    admin: 2,
    member: 3
}

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        is_public BOOLEAN DEFAULT FALSE,
        created_by INTEGER NOT NULL,

        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    )
`);


db.exec(`
    CREATE TABLE IF NOT EXISTS project_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        role INTEGER NOT NULL CHECK(role >= 1 AND role <= 4),
        
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
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

        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id)
    )
`);

// USER
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
// 

// PROJECTS
export const createProject = db.prepare(`
    INSERT INTO projects (name, description, is_public, created_by) 
    VALUES (?, ?, ?, ?)
`);

export const updateProject = db.prepare(`
    UPDATE projects 
    SET name = ?, 
    description = ?, 
    is_public = ? 
    WHERE id = ?
`);

export const deleteProject = db.prepare(`
    DELETE FROM projects 
    WHERE id = ?
`);

export const getAllUserProjects = db.prepare(`
    SELECT p.id as id, p.name as name, p.description as description, p.is_public as is_public, p.created_by as created_by 
    FROM projects p
    JOIN project_members pm
    ON pm.project_id = p.id
    WHERE pm.user_id = ?
`);
// 

//  MEMBERS
export const addProjectMember = db.prepare(`
    INSERT INTO project_members (project_id, user_id, role) 
    VALUES (?, ?, ?)
`);

export const updateProjectMemberRole = db.prepare(`
    UPDATE project_members 
    SET role = ?
    WHERE project_id = ?
    AND user_id = ?
`);

export const deleteProjectMember = db.prepare(`
    DELETE FROM project_members 
    WHERE project_id = ?
    AND user_id = ?
`)

export const getUserRoleForProject = db.prepare(`
    SELECT role FROM project_members
    WHERE project_id = ? 
    AND user_id = ?
`);

export const getAllProjectMembers = db.prepare(`
    SELECT u.username as name, u.email as email, pm.role as role 
    FROM project_members pm
    JOIN users u ON pm.user_id = u.id
    WHERE project_id = ? 
`);
//

// TASKS
export const createTask = db.prepare(`
    INSERT INTO tasks (title, description, due_date, priority, status, color, project_id, parent_task_id, created_by) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

export const getTaskById = db.prepare(`
    SELECT t.*, u.username as creator_name, p.name as project_name
    FROM tasks t
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.id = ?    
`)

export const getProjectTasks = db.prepare(`
    SELECT t.*, u.username as creator_name
    FROM tasks t
    JOIN users u ON t.created_by = u.id
    WHERE t.project_id = ?
    ORDER BY t.priority DESC, t.due_date ASC   
`)

export const getUserTasks = db.prepare(`
    SELECT t.*, p.name as project_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE (t.created_by = ? OR pm.user_id = ?)
    AND t.parent_task_id IS NULL
    ORDER BY t.priority DESC, t.due_date ASC    
`)

export const getSubtasks = db.prepare(`
    SELECT t.*, u.username as creator_name
    FROM tasks t
    JOIN users u ON t.created_by = u.id
    WHERE t.parent_task_id = ?
    ORDER BY t.priority DESC, t.due_date ASC
`)

export const updateTask = db.prepare(`
    UPDATE tasks 
    SET title = ?, description = ?, due_date = ?, priority = ?, 
        status = ?, color = ?, project_id = ?
    WHERE id = ?
`)

export const updateTaskStatus = db.prepare(`
    UPDATE tasks 
    SET status = ? 
    WHERE id = ?
`)

export const deleteTask = db.prepare(`
    DELETE FROM tasks WHERE id = ?
`)

export const filterTasksByPriority = db.prepare(`
    SELECT t.*, p.name as project_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE t.priority = ? AND (t.created_by = ? OR pm.user_id = ?)
    ORDER BY t.due_date ASC
`)

export const filterTasksByStatus = db.prepare(`
    SELECT t.*, p.name as project_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE t.status = ? AND (t.created_by = ? OR pm.user_id = ?)
    ORDER BY t.priority DESC, t.due_date ASC
`)

export const filterTasksByDateRange = db.prepare(`
    SELECT t.*, p.name as project_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE t.due_date = ? AND (t.created_by = ? OR pm.user_id = ?)
    ORDER BY t.priority DESC, t.due_date ASC
`)

export const searchTasks = db.prepare(`
    SELECT t.*, p.name as project_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    LEFT JOIN project_members pm ON p.id = pm.project_id
    WHERE (t.title LIKE ? OR t.description LIKE ?) 
    AND (t.created_by = ? OR pm.user_id = ?)
    ORDER BY t.priority DESC, t.due_date ASC
`)
// 

export default db;