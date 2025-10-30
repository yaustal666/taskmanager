import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';

export const AddSubtask = () => {
    const { taskId } = useParams();
    const [parent, setParent] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState(1);
    const [status, setStatus] = useState('todo');
    const [color, setColor] = useState('#ffffff');
    const navigate = useNavigate();

    useEffect(() => {
        const loadParent = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/task/${taskId}`)
                setParent(res.data.task)
            } catch (e) {}
        }
        loadParent();
    }, [taskId])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/create-task", {
                name: name,
                description: description,
                due_date: dueDate,
                priority: priority,
                status: status,
                color: color,
                project_id: parent?.project_id || null,
                parent_task_id: taskId
            })

            navigate(`/task/${taskId}`)
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Add Subtask</h2>
                {parent && <p>Parent: {parent.title}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-group-label">Title:</label>
                        <input className="form-group-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-group-label">Description:</label>
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
                            <option value={1}>Low</option>
                            <option value={2}>Medium</option>
                            <option value={3}>High</option>
                        </select>
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
                    <button type="submit" className="form-button">Create</button>
                </form>
            </div>
        </div>
    );
};

export default AddSubtask


