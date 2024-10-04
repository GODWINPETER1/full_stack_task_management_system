import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import axios from 'axios';
// Define the type for the context
interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  email: string;
  userId: number | null;
  setUsername: (username : string) => void;
  setEmail: (email: string) => void;
  register: (username: string , email: string , password: string) => Promise<void>; 
  login: (username: string, email: string , userId: number) => void;
  logout: () => void;
}



// Create the context with undefined as default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [userId , setUserId] = useState<number | null>(null)



  const register = async (username: string , email: string, password: string) => {

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/register', { username , email , password});
      console.log(response)
      setUsername(response.data.username)
      setEmail(response.data.email)
      
    } catch (error) {

      throw new Error('Registration failed');
    }
  }


  const login = (username: string, email: string , userId: number  ) => {
    setIsAuthenticated(true);
    setUsername(username);
    setEmail(email);
    setUserId(userId)
    
  

    // save to the localstorage to avoid lost of data when refresh
    localStorage.setItem('isAuthenticated' , 'true');
    localStorage.setItem('username' , username)
    localStorage.setItem('email' , email)
    localStorage.setItem('userId' , userId.toString())
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setEmail('');

    // clear localStorage
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
    localStorage.removeItem('email')
  };

  useEffect(() => {

    const storedIsAuthenticated = localStorage.getItem('isAuthenticated');

    if (storedIsAuthenticated) {
      setIsAuthenticated(true)
      setUsername(localStorage.getItem('username') || '');
      setEmail(localStorage.getItem('email') || '')
      setUserId(Number(localStorage.getItem('userId')) || null)
    }
  } , [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, email, setUsername , setEmail , register ,login, logout , userId }}>
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
