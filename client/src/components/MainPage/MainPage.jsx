import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';
import './MainPage.css'
import { ProjectList } from '../Project/ProjectList';
import { TaskList } from '../Tasks/TasksList';

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
            console.log(projectsData.data.projects)
            console.log(tasksData.data.tasks)
            setProjects(projectsData.data.projects);
            setTasks(tasksData.data.tasks);
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

                <div className="content-grid">
                    <div className="column">
                        <Link to='/add-project'>
                            <button>Add Project</button>
                        </Link>
                        <ProjectList
                            projects={projects}
                            onProjectClick={handleProjectClick}
                        />
                    </div>
                    <div className="column">
                        <Link to='/add-task'>
                            <button>Add Task</button>
                        </Link>
                        <TaskList
                            tasks={tasks}
                            onTaskClick={handleTaskClick}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainPage;