import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'student';
  department: string;
  status: 'active' | 'inactive';
  dateJoined: string;
}

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'dateJoined'>) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, user: Partial<User>) => void;
}

const initialUsers: User[] = [
  {
    id: 'U001',
    name: 'Mike Johnson',
    email: 'mike.johnson@university.edu',
    role: 'staff',
    department: 'IT Services',
    status: 'active',
    dateJoined: '2023-06-15'
  },
  {
    id: 'U002',
    name: 'Lisa Chen',
    email: 'lisa.chen@university.edu',
    role: 'staff',
    department: 'Food Services',
    status: 'active',
    dateJoined: '2023-07-20'
  },
  {
    id: 'U003',
    name: 'Tom Wilson',
    email: 'tom.wilson@university.edu',
    role: 'staff',
    department: 'Facilities',
    status: 'active',
    dateJoined: '2023-05-10'
  },
  {
    id: 'U004',
    name: 'Sarah Adams',
    email: 'sarah.adams@university.edu',
    role: 'staff',
    department: 'Library Services',
    status: 'active',
    dateJoined: '2023-08-01'
  },
  {
    id: 'U005',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
    department: 'Administration',
    status: 'active',
    dateJoined: '2023-01-01'
  }
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse users from local storage");
      }
    }
    return initialUsers;
  });

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const addUser = (user: Omit<User, 'id' | 'dateJoined'>) => {
    const newUser: User = {
      ...user,
      id: `U${(users.length + 1).toString().padStart(3, '0')}`,
      dateJoined: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const updateUser = (id: string, user: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...user } : u));
  };

  return (
    <UserContext.Provider value={{ users, addUser, deleteUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
