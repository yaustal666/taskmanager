import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router'

export const UpdateProject = () => {
    const { projectId } = useParams()
    const [formData, setFormData] = useState({ name: '', description: '' })
    const [isPublic, setIsPublic] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError('')
            try {
                const res = await axios.get(`http://localhost:5000/api/get-project/${projectId}`)
                const p = res.data.project
                setFormData({ name: p.name || '', description: p.description || '' })
                setIsPublic(p.is_public ? 1 : 0)
            } catch (e) {
                setError(e?.response?.data?.error || 'Failed to load project')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [projectId])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (event) => {
        setIsPublic(event.target.checked ? 1 : 0);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        try {
            await axios.put(`http://localhost:5000/api/update-project/${projectId}`, {
                name: formData.name,
                description: formData.description,
                is_public: isPublic
            })
            navigate(`/project/${projectId}`)
        } catch (error) {
            setError(error?.response?.data?.error || 'Update failed')
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Update Project</h2>
                {loading && <p>Loading…</p>}
                {!!error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && (
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
                            checked={!!isPublic}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                    <button type="submit" className="form-button">Save</button>
                </form>
                )}
            </div>
        </div>
    );
}

export default UpdateProject


