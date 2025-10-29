import express from 'express'
const taskRouter = express.Router();

import { getUserRoleForProject, createTask, 
    getUserTasks, updateTask, getProjectTasks, filterTasksByPriority,
    filterTasksByStatus, filterTasksByDateRange, searchTasks, getTaskById,
    getSubtasks, updateTaskStatus, deleteTask, roles } from '../database.js'
import {authenticate} from '../middlewares.js'

taskRouter.post("/api/create-task", authenticate, async (req, res) => {
    const { name, description, due_date, priority = 1, status = 'todo',
        color = '#FFFFFF', project_id, parent_task_id } = req.body

    if (!name) {
        return res.status(400).json({ error: 'Task name is required' });
    }

    try {
        const result = await createTask.run(name, description, due_date, priority, status, 
            color, project_id, parent_task_id, req.user.userId);

        res.status(201).json({ message: 'Task created' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

taskRouter.get("/api/get-tasks", authenticate, async (req, res) => {
    try {
        const tasks = await getUserTasks.all(req.user.userId, req.user.userId)

        res.status(201).json({tasks: tasks})
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

taskRouter.get("/api/:projectId/get-tasks", authenticate, async (req, res) => {
    const projectId = req.params.projectId
    try {
        const tasks = await getProjectTasks.all(projectId)

        res.status(201).json({tasks: tasks})
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

taskRouter.put("/api/update-task/:id", authenticate, async (req, res) => {
    const taskId = req.params.id;
    const { title, name, description, due_date, priority, status, color, project_id } = req.body;

    try {
        const finalTitle = title ?? name;
        await updateTask.run(finalTitle, description, due_date, 
            priority, status, color, project_id, taskId);
        
        res.json({ message: 'Task updated' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

taskRouter.put("/api/update-task-status/:id", authenticate, async (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body;
    try {
        await updateTaskStatus.run(status, taskId);
        res.json({ message: 'Task status updated' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

taskRouter.get("/api/task/:id", authenticate, async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await getTaskById.get(taskId);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        const subtasks = await getSubtasks.all(taskId);
        res.json({ task, subtasks });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

taskRouter.get("/api/tasks/filter/priority/:value", authenticate, async (req, res) => {
    const value = Number(req.params.value);
    try {
        const tasks = await filterTasksByPriority.all(value, req.user.userId, req.user.userId);
        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

taskRouter.get("/api/tasks/filter/status/:value", authenticate, async (req, res) => {
    const value = req.params.value;
    try {
        const tasks = await filterTasksByStatus.all(value, req.user.userId, req.user.userId);
        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

taskRouter.get("/api/tasks/filter/due-date/:date", authenticate, async (req, res) => {
    const date = req.params.date;
    try {
        const tasks = await filterTasksByDateRange.all(date, req.user.userId, req.user.userId);
        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

taskRouter.get("/api/tasks/search", authenticate, async (req, res) => {
    const q = req.query.q ?? '';
    try {
        const like = `%${q}%`;
        const tasks = await searchTasks.all(like, like, req.user.userId, req.user.userId);
        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

taskRouter.delete("/api/task/:id", authenticate, async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await getTaskById.get(taskId);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        if (task.created_by === req.user.userId) {
            await deleteTask.run(taskId);
            return res.json({ message: 'Task deleted' });
        }

        if (!task.project_id) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        const role = await getUserRoleForProject.get(task.project_id, req.user.userId)
        if (!role || role.role > roles.admin) {
            return res.status(403).json({ error: 'Permission denied' });
        }

        await deleteTask.run(taskId);
        return res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default taskRouter;
