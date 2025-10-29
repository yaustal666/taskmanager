import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../../contexts/AuthContext';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.email) newErrors.username = 'Username is required';
        if (!formData.password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {

            setLoading(true);
            const responce = await login(formData.username, formData.password);
            if (responce.success) {
                navigate('/');
            } else {

            }

        } else {
            console.log('Form has errors');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-group-label">Email:</label>
                        <input className="form-group-input"
                            type="text"
                            name="email"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-group-label">Password:</label>
                        <input className="form-group-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    </div>

                    <button type="submit" className="form-button">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default Login;