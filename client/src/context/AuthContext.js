import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        role: '',
        name: '',
        email: '',
        // Add other user fields as necessary
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await axios.get('http://localhost:5002/api/auth/user', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(response.data);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (userData) => {
        try {
            const response = await axios.post('http://localhost:5002/api/auth/login', userData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            
            setUser(user);
            setIsAuthenticated(true);

            switch (user.role) {
                case 'admin':
                    navigate('/admin/home');
                    break;
                case 'trainer':
                    navigate('/trainer');
                    break;
                case 'client':
                    navigate('/client');
                    break;
                default:
                    navigate('/');
                    break;
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 