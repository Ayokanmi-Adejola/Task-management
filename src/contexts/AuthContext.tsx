
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage for existing user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Simple user storage for demo purposes
  const getUsers = (): Record<string, { name: string; password: string; id: string; avatar: string }> => {
    const usersString = localStorage.getItem('users');
    return usersString ? JSON.parse(usersString) : {};
  };

  const saveUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    
    if (users[email] && users[email].password === password) {
      const loggedInUser: User = {
        id: users[email].id,
        name: users[email].name,
        email,
        avatar: users[email].avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${users[email].id}`
      };
      
      saveUser(loggedInUser);
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    
    if (users[email]) {
      return false; // User already exists
    }
    
    const userId = uuidv4();
    users[email] = {
      id: userId,
      name,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const newUser: User = {
      id: userId,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
    };
    
    saveUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
