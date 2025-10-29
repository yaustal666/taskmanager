import router from './router'
import { getAllUserProjects, createProject, addProjectMember, roles, getUserRoleForProject } from '../database'
import authenticate from '../middlewares'

router.post("/api/new-project", authenticate, async (req, res) => {
    const { name, description, is_public = false } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Project name is required' });
    }

    if (name.length > 100) {
        return res.status(400).json({ error: 'Project name must be less than 100 characters' });
    }

    try {
        const existingProjects = await getAllUserProjects.all(req.user.userId);
        const isProjectExists = existingProjects.find(project =>
            project.name.toLowerCase() === name.toLowerCase().trim()
        );

        if (isProjectExists) {
            return res.status(400).json({ error: 'You already have a project with this name' });
        }

        project = await createProject.run(name.trum(), description, is_public, req.user.userId)
        await addProjectMember.run(project.id, req.user.userId, roles.owner);

        res.status(201).json({
            message: 'Project created successfully'
        })
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.put("/api/update-project/:id", authenticate, async (req, res) => {
    const projectId = req.params.id
    const { name, description, is_public = false } = req.body;
    const userId = req.user.userId

    const role = await getUserRoleForProject.get(projectId, userId)
})

router.delete("/api/delete-project", authenticate, async (req, res) => {

})