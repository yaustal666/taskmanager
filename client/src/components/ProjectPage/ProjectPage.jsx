import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Header/Header';
import { useNavigate, Link, useParams } from 'react-router';
import axios from 'axios';
import { TaskList } from '../Tasks/TasksList';
import ProjectMembers from './ProjectMembers';
import './ProjectPage.css';

function ProjectPage() {
    const {projectId} = useParams()
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user])

    const loadData = async () => {
        try {
            const tasksData = await axios.get(`http://localhost:5000/api/${projectId}/get-tasks`)
            console.log(tasksData.data.tasks)
            setTasks(tasksData.data.tasks);
            const projectRes = await axios.get(`http://localhost:5000/api/get-project/${projectId}`)
            setProject(projectRes.data.project || null)
            
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleTaskClick = (taskId) => {
        navigate(`/task/${taskId}`);
    };

    return (
        <>
            <Header />

            <div className="main-page">

                    <div className="column">
                        <div className="project-actions">
                            <Link to={`/project/${projectId}/edit`}><button className="btn">Edit Project</button></Link>
                            <button 
                              className="btn btn--danger"
                              onClick={async () => {
                                if (!confirm('Delete this project?')) return;
                                try { await axios.delete(`http://localhost:5000/api/delete-project/${projectId}`); navigate('/'); } catch (e) {}
                              }}
                            >Delete</button>
                        </div>
                        <Link to={`/project/${projectId}/add-task`}>
                            <button>Add Task</button>
                        </Link>
                        <TaskList
                            tasks={tasks}
                            onTaskClick={handleTaskClick}
                        />
                    </div>
                    <div className="column">
                        <ProjectMembers projectId={projectId} isPublic={!!project?.is_public} />
                    </div>
            </div>
        </>
    )
}

export default ProjectPage;