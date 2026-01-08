import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('frenchmaster_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Demo user
                if (email === 'demo@frenchmaster.com' && password === 'demo123') {
                    const demoUser = {
                        id: 1,
                        email: 'demo@frenchmaster.com',
                        username: 'demouser',
                        firstName: 'Demo',
                        lastName: 'User',
                        role: 'learner',
                        isActive: true,
                        emailVerified: true
                    };
                    setUser(demoUser);
                    localStorage.setItem('frenchmaster_user', JSON.stringify(demoUser));
                    resolve(demoUser);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    };

    const register = async (userData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    id: Date.now(),
                    ...userData,
                    role: 'learner',
                    isActive: true,
                    emailVerified: false
                };
                setUser(newUser);
                localStorage.setItem('frenchmaster_user', JSON.stringify(newUser));
                resolve(newUser);
            }, 1000);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('frenchmaster_user');
    };

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('frenchmaster_user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
