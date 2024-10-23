import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';

// Define the type for the context
interface User {
  email: string;
  picture: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  email: string;
  userId: number | null;
  user: User | null; // User information for Google or Slack login
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (username: string, email: string, userId: number) => void;
  googleLogin: (email: string, picture: string, name: string) => void; // Google login
  slackLogin: (email: string, picture: string, name: string) => void; // Slack login
  logout: () => void;
}

// Create the context with undefined as default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null); // State for Google or Slack user info

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/register', { username, email, password });
      setUsername(response.data.username);
      setEmail(response.data.email);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const login = (username: string, email: string, userId: number) => {
    setIsAuthenticated(true);
    setUsername(username);
    setEmail(email);
    setUserId(userId);

    // Save to localStorage to avoid loss of data when refresh
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    localStorage.setItem('userId', userId.toString());
  };

  const googleLogin = (email: string, picture: string, name: string) => {
    setIsAuthenticated(true);
    setEmail(email);
    setUser({
      email,
      picture,
      name
    });

    // Save to localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('email', email);
  };

  // Add the new slackLogin function
  const slackLogin = (email: string, picture: string, name: string) => {
    setIsAuthenticated(true);
    setEmail(email);
    setUser({
      email,
      picture,
      name
    });

    // Save to localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('email', email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setEmail('');
    setUser(null); // Clear user info on logout

    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');

    if (storedIsAuthenticated) {
      setIsAuthenticated(true);
      setUsername(localStorage.getItem('username') || '');
      setEmail(localStorage.getItem('email') || '');
      setUserId(Number(localStorage.getItem('userId')) || null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, email, setUsername, setEmail, register, login, googleLogin, slackLogin, logout, user, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easier context usage
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
