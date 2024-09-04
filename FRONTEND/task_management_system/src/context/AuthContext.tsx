import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the type for the context
interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  email: string | null;
  login: (username: string, email: string) => void;
  logout: () => void;
}

// Create the context with undefined as default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  console.log(username)

  const login = (username: string, email: string) => {
    setIsAuthenticated(true);
    setUsername(username);
    setEmail(email);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, email, login, logout }}>
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
