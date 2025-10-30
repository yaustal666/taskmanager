import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router'

export const UpdateTask = () => {
    const { taskId } = useParams()
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState(1);
    const [status, setStatus] = useState('todo');
    const [color, setColor] = useState('#ffffff');
    const [projectId, setProjectId] = useState('');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                const [taskRes, projectsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/task/${taskId}`),
                    axios.get("http://localhost:5000/api/get-all-projects")
                ])
                const t = taskRes.data.task
                setName(t.title || '')
                setDescription(t.description || '')
                setDueDate(t.due_date ? t.due_date.substring(0,10) : '')
                setPriority(t.priority ?? 1)
                setStatus(t.status || 'todo')
                setColor(t.color || '#ffffff')
                setProjectId(t.project_id || '')
                setProjects(projectsRes.data.projects || [])
            } catch (e) {
                setError(e?.response?.data?.error || 'Failed to load task')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [taskId])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        try {
            await axios.put(`http://localhost:5000/api/update-task/${taskId}`, {
                title: name,
                description: description,
                due_date: dueDate,
                priority: priority,
                status: status,
                color: color,
                project_id: projectId || null
            })
            navigate('/')
        } catch (error) {
            setError(error?.response?.data?.error || 'Update failed')
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Update Task</h2>
                {loading && <p>Loading…</p>}
                {!!error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-group-label">Task Name:</label>
                        <input className="form-group-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-group-label">Task Description:</label>
                        <textarea className="form-group-input"
                            placeholder="Description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-group-label">Due date:</label>
                        <input className="form-group-input"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-group-label">Priority:</label>
                        <select className="form-group-input"
                            value={priority}
                            onChange={(e) => setPriority(Number(e.target.value))}
                        >
                            <option value={1}>Low Priority</option>
                            <option value={2}>Medium Priority</option>
                            <option value={3}>High Priority</option>

                        </select >
                    </div>

                    <div className="form-group">
                        <label className="form-group-label">Status:</label>
                        <select className="form-group-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-group-label">Color:</label>
                        <input className="form-group-input" type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label className="form-group-label">Project:</label>
                        <select className="form-group-input" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                            <option value="">No project</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="form-button">Save</button>
                </form>
                )}
            </div>
        </div>
    );
};

export default UpdateTask


