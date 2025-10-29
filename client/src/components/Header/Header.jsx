import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css"
const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-buttons">

                    {user ? (
                        <button onClick={logout} className="header-btn logout">
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="header-btn">
                                Login
                            </Link>
                            <Link to="/register" className="header-btn">
                                SignUp
                            </Link>

                        </>
                    )}

                </div>
            </div>
        </header>
    );
};

export default Header;