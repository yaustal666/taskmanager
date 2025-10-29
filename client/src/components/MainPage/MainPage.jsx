import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import { useNavigate } from 'react-router';
import axios from 'axios';
import './MainPage.css'
import { ProjectList } from '../Project/ProjectList';
import { AddProject } from '../Project/AddProject';

function MainPage() {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user])

    const loadData = async () => {
        try {
            const projectsData = await axios.get("http://localhost:5000/api/get-all-projects")
            const tasksData = await axios.get("http://localhost:5000/api/get-tasks")
            setProjects(projectsData.projects);
            setTasks(tasksData.tasks);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleProjectClick = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    const handleTaskClick = (taskId) => {
        navigate(`/task/${taskId}`);
    };

    return (
        <>
            <Header />

            <div className="main-page">
                <div className="page-header">
                    <h1>My Task Manager</h1>
                    <div className="action-buttons">
                        <AddProject onProjectAdded={loadData} />
                        {/* <AddTask onTaskAdded={loadData} projects={projects} /> */}
                    </div>
                </div>

                <div className="content-grid">
                    <div className="column">
                        <ProjectList
                            projects={projects}
                            onProjectClick={handleProjectClick}
                        />
                    </div>
                    {/* <div className="column">
                        <TaskList
                            tasks={tasks}
                            onTaskClick={handleTaskClick}
                        />
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default MainPage;