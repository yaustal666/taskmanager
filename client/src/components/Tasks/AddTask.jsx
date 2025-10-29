import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

export const AddTask = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('');
    const [status, setStatus] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            await axios.post("http://localhost:5000/api/create-task", {
                name: name,
                description: description,
                due_date: dueDate,
                priority: priority,
                project_id: null,
                parent_task_id: null
            })

            navigate('/')
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Create Task</h2>

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
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value={1}>Low Priority</option>
                            <option value={2}>Medium Priority</option>
                            <option value={3}>High Priority</option>

                        </select >
                    </div>

                    <div className="form-group">
                        <label className="form-group-label">Status:</label>
                        <input className="form-group-input"
                            placeholder="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="form-button">Submit</button>
                </form>
            </div>
        </div>
    );
};