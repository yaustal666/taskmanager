import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

export const AddProject = () => {
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [ isPublic, setIsPublic ] = useState(0);
    const navigate = useNavigate();

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

            navigate('/')
        } catch (error) {
        }
    };

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
                        <textarea className="form-group-input"
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