import router from './router'
import { getUserRoleForProject, createTask, getUserTasks, updateTask } from '../database'
import authenticate from '../middlewares'

router.post("/api/create-task", authenticate, async (req, res) => {
    const { title, description, due_date, priority = 1, status = 'todo',
        color = '#FFFFFF', project_id, parent_task_id } = req.body

    if (!title) {
        return res.status(400).json({ error: 'Task title is required' });
    }

    try {
        const result = await createTask.run(title, description, due_date, priority, status, 
            color, project_id, parent_task_id, req.user.userId);

        res.status(201).json({ message: 'Task created' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get("/api/get-tasks", authenticate, async (req, res) => {
    try {
        const tasks = await getUserTasks.all(req.user.userId, req.user.userId)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put("/api/update-task/:id", authenticate, async (req, res) => {
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