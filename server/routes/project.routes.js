import express from 'express'
const projectRouter = express.Router();

import { getAllUserProjects, createProject, 
    deleteProjectMember, updateProjectMemberRole, 
    addProjectMember, roles, getUserRoleForProject, 
    updateProject, deleteProject, getUserByEmail, getAllProjectMembers } from '../database.js'
import {authenticate} from '../middlewares.js'

projectRouter.post("/api/create-project", authenticate, async (req, res) => {
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

        console.log(name, description, is_public, req.user.userId)
        const project = await createProject.run(name.trim(), description, is_public, req.user.userId)
        await addProjectMember.run(project.lastInsertRowid, req.user.userId, roles.owner);

        res.status(201).json({
            message: 'Project created successfully'
        })
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

projectRouter.put("/api/update-project/:id", authenticate, async (req, res) => {
    const projectId = req.params.id
    const { name, description, is_public } = req.body;
    const userId = req.user.userId

    const role = await getUserRoleForProject.get(projectId, userId)

    console.log(role, roles.admin)
    if (role.role > roles.admin) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    if (role.role > roles.owner && is_public === false) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    await updateProject.run(name, description, is_public, projectId);
    res.json({ message: 'Project updated' });
})

projectRouter.delete("/api/delete-project/:id", authenticate, async (req, res) => {
    const projectId = req.params.id
    const userId = req.user.userId

    const role = await getUserRoleForProject.get(projectId, userId)

    if (!role || role.role > roles.owner) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    deleteProject.run(projectId);
    res.json({ message: 'Project deleted' });
})

projectRouter.post("/api/add-project-member/:id", authenticate, async (req, res) => {
    const projectId = req.params.id
    const userId = req.user.userId

    const { name, email, desiredMemberRole } = req.body;

    const role = await getUserRoleForProject.get(projectId, userId)

    if (!role || role.role >= desiredMemberRole) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    const memberUser = await getUserByEmail.get(email)
    if (!memberUser) {
        return res.status(400).json({ error: 'Email not registered' });
    }

    if (memberUser.username != name) {
        return res.status(400).json({ error: 'Wrong member User name' });
    }

    await addProjectMember.run(projectId, memberUser.id, desiredMemberRole);
    res.status(201).json({ message: 'Member added' });
})

projectRouter.put("/api/update-project-member-role/:id", authenticate, async (req, res) => {
    const projectId = req.params.id
    const userId = req.user.userId

    const { email, desiredMemberRole } = req.body;

    const role = await getUserRoleForProject.get(projectId, userId)

    if (!role || role.role >= desiredMemberRole) {
        return res.status(403).json({ error: 'Permission denied' });
    }
    
    const memberUser = await getUserByEmail.get(email)
    await updateProjectMemberRole.run(desiredMemberRole, projectId, memberUser.id)
    res.json({ message: 'Member role updated' });
})

projectRouter.delete("/api/delete-project-member/:id", authenticate, async (req, res) => {
    const projectId = req.params.id
    const userId = req.user.userId

    const { email } = req.body;

    const role = await getUserRoleForProject.get(projectId, userId)

    if (!role) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    const memberUser = await getUserByEmail.get(email)
    await deleteProjectMember.run(projectId, memberUser.id)
    res.json({ message: 'Member removed' });
})

projectRouter.get("/api/get-all-projects", authenticate, async (req, res) => {
    console.log("HERE")
    const projects = await getAllUserProjects.all(req.user.userId)
    console.log("NOW HERE")

    res.status(200).json({projects: projects})
})

projectRouter.get("/api/get-all-project-members/:id", authenticate, async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user.userId;
    const role = await getUserRoleForProject.get(projectId, userId)
    if (!role) {
        return res.status(403).json({ error: 'Permission denied' });
    }
    const members = await getAllProjectMembers.all(projectId);
    res.json({ members });
})

projectRouter.get("/api/get-project/:id", authenticate, async (req, res) => {
    const projectId = req.params.id;
    const userId = req.user.userId;
    const role = await getUserRoleForProject.get(projectId, userId)
    if (!role) {
        return res.status(403).json({ error: 'Permission denied' });
    }
    const projects = await getAllUserProjects.all(userId);
    const project = projects.find(p => String(p.id) === String(projectId));
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ project });
})

export default projectRouter;