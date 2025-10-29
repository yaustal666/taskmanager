import express from 'express'
const taskRouter = express.Router();

import { getUserRoleForProject, createTask, 
    getUserTasks, updateTask } from '../database.js'
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

taskRouter.put("/api/update-task/:id", authenticate, async (req, res) => {
    const taskId = req.params.id;
    const { title, description, due_date, priority, status, color, project_id } = req.body;

    try {
        await updateTask.run(title, description, due_date, 
            priority, status, color, project_id, taskId);
        
        res.json({ message: 'Task updated' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default taskRouter;