import { useState } from 'react';
import axios from 'axios';

export const AddProject = ({ onProjectAdded }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [ isPublic, setIsPublic ] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (event) => {
        setIsPublic(event.target.checked ? 1 : 0);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            await axios.post("http://localhost:5000/api/create-project", {
                name: formData.name,
                description: formData.description,
                is_public: isPublic
            })

            setFormData({ name: '', description: '', is_public: false });
            setIsOpen(false);
            onProjectAdded();
        } catch (error) {
        }
    };

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="add-button">
                + Add Project
            </button>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>CreateProject</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-group-label">Project Name:</label>
                        <input className="form-group-input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-group-label">Project Description:</label>
                        <input className="form-group-input"
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-group-label">Is Public:</label>
                        <input className="form-group-input"
                            type="checkbox"
                            name="is_public"
                            checked={isPublic}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                    <button type="submit" className="form-button">Submit</button>
                </form>
            </div>
        </div>
    );
};