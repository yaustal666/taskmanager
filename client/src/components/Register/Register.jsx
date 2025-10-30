import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../../contexts/AuthContext';
import "./Register.css"

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { register, user } = useAuth();
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
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {

            setLoading(true);
            const responce = await register(formData.username, formData.email, formData.password);
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
                <h2>Register</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-group-label">Username:</label>
                        <input className="form-group-input"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-group-label">Email:</label>
                        <input className="form-group-input"
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
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

                    <div className="form-group">
                        <label className="form-group-label">Confirm Password:</label>
                        <input className="form-group-input"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
                    </div>
                    <button type="submit" className="form-button">Submit</button>
                </form>

                <Link to="/login">Already have an Account? Go to LogIn!</Link>
            </div>
        </div>
    );
}

export default Register;