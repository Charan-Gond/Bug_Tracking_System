import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('jwt');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    // content of decoded token depends on backend implementation of `getTocken`
                    // Assuming it contains 'sub' (username) or similar.
                    setUser({ name: decoded.sub, ...decoded });
                } catch (error) {
                    console.error("Invalid token", error);
                    localStorage.removeItem('jwt');
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/user/login', { name: username, password });

            if (response.data === "login failed" || response.data === "please verify the account first") {
                throw new Error(response.data);
            }

            const token = response.data;
            localStorage.setItem('jwt', token);

            const decoded = jwtDecode(token);
            setUser({ name: decoded.sub, ...decoded });

            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        // userData should match User model: { name, email, password }
        const response = await api.post('/user/register', userData);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
