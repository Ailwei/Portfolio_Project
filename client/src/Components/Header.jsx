import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('AuthToken');
            if (token) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('AuthToken');
        setIsAuthenticated(false);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1>Welcome to this React Application</h1>
                        <p>
                            {isAuthenticated ? (
                                <>            
                                    <Link to="/profile" className="btn btn-success">Profile</Link> |
                                    <Link to="/createPost" className="btn btn-success">Create post</Link> |
                                    <Link to="/messages" className="btn btn-success">Messages</Link> |
                                    <button onClick={handleLogout} className="btn btn-success">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-success">Login</Link> | 
                                    <Link to="/register" className="btn btn-success">Register</Link>
                                </>
                            )}
                            <Link to="/userprofile" className="btn btn-success">View Profile</Link>
                        </p>
                        <Link to="/ViewUserProfile" className="btn btn-success">View User</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
