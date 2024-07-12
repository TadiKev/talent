// src/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.setItem('isLoggedIn', 'false');
    };

    const value = {
        user,
        login,
        logout,
        isLoggedIn: user !== null,
        role: user?.role || null,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
