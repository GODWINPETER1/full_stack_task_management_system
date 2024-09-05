import React, { createContext, useState, ReactNode, useContext } from 'react';
import axios from 'axios';
// Define the type for the context
interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  email: string;
  setUsername: (username : string) => void;
  setEmail: (email: string) => void;
  register: (username: string , email: string , password: string) => Promise<void>; 
  login: (username: string, email: string) => void;
  logout: () => void;
}

// Create the context with undefined as default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');



  const register = async (username: string , email: string, password: string) => {

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/register', { username , email , password});
      setUsername(response.data.username)
      setEmail(response.data.email)
    } catch (error) {

      throw new Error('Registration failed');
    }
  }


  const login = (username: string, email: string) => {
    setIsAuthenticated(true);
    setUsername(username);
    setEmail(email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setEmail('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, email, setUsername , setEmail , register ,login, logout }}>
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
