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
    const [filter, setFilter] = useState({ type: 'all', value: '' });
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
            console.log(tasksData);
            setProjects(projectsData.data.projects);
            setTasks(tasksData.data.tasks);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const applyFilter = async (nextFilter) => {
        setFilter(nextFilter);
        try {
            if (nextFilter.type === 'all') {
                const res = await axios.get("http://localhost:5000/api/get-tasks");
                setTasks(res.data.tasks);
            } else if (nextFilter.type === 'priority') {
                const res = await axios.get(`http://localhost:5000/api/tasks/filter/priority/${nextFilter.value}`);
                setTasks(res.data.tasks);
            } else if (nextFilter.type === 'status') {
                const res = await axios.get(`http://localhost:5000/api/tasks/filter/status/${nextFilter.value}`);
                setTasks(res.data.tasks);
            } else if (nextFilter.type === 'due') {
                const res = await axios.get(`http://localhost:5000/api/tasks/filter/due-date/${nextFilter.value}`);
                setTasks(res.data.tasks);
            } else if (nextFilter.type === 'search') {
                const res = await axios.get(`http://localhost:5000/api/tasks/search`, { params: { q: nextFilter.value } });
                setTasks(res.data.tasks);
            }
        } catch (e) {}
    }

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
                {user && (
                    <div className="column" style={{ marginBottom: 16 }}>
                        <h2>Welcome, {user.username}</h2>
                    </div>
                )}
                {!user ? (
                    <div className="column" style={{ maxWidth: 900, margin: '0 auto' }}>
                        <h2>Welcome to Task Manager</h2>
                        <p>Organize your projects, tasks, and subtasks. Collaborate with your team in private or public projects.</p>
                        <div className="filters">
                            <p>Please LogIn or SignUp to start </p>
                        </div>
                    </div>
                ) : (

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
                        <div className="filters">
                            <select value={filter.type} onChange={(e) => applyFilter({ type: e.target.value, value: '' })}>
                                <option value="all">All</option>
                                <option value="priority">By Priority</option>
                                <option value="status">By Status</option>
                                <option value="due">By Due Date</option>
                                <option value="search">Search</option>
                            </select>
                            {filter.type === 'priority' && (
                                <select value={filter.value} onChange={(e) => applyFilter({ type: 'priority', value: e.target.value })}>
                                    <option value={1}>Low</option>
                                    <option value={2}>Medium</option>
                                    <option value={3}>High</option>
                                </select>
                            )}
                            {filter.type === 'status' && (
                                <select value={filter.value} onChange={(e) => applyFilter({ type: 'status', value: e.target.value })}>
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            )}
                            {filter.type === 'due' && (
                                <input type="date" value={filter.value} onChange={(e) => applyFilter({ type: 'due', value: e.target.value })} />
                            )}
                            {filter.type === 'search' && (
                                <input placeholder="Search…" value={filter.value} onChange={(e) => applyFilter({ type: 'search', value: e.target.value })} />
                            )}
                        </div>
                        <TaskList
                            tasks={tasks}
                            onTaskClick={handleTaskClick}
                        />
                    </div>
                </div>
                )}
            </div>
        </>
    )
}

export default MainPage;