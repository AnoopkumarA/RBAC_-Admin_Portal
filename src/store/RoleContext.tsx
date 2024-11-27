import React, { createContext, useContext, useState } from 'react';
import type { Role } from '../types';

const defaultRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access',
    permissions: [
      {
        id: '1',
        name: 'User Management',
        description: 'Manage system users',
        resource: 'users',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        id: '2',
        name: 'Role Management',
        description: 'Manage user roles',
        resource: 'roles',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        id: '3',
        name: 'Content Management',
        description: 'Manage website content',
        resource: 'content',
        actions: ['create', 'read', 'update', 'delete'],
      },
    ],
  },
  {
    id: '2',
    name: 'Editor',
    description: 'Can create and edit content',
    permissions: [
      {
        id: '1',
        name: 'User Management',
        description: 'Manage system users',
        resource: 'users',
        actions: ['read', 'create'],
      },
      {
        id: '2',
        name: 'Role Management',
        description: 'Manage user roles',
        resource: 'roles',
        actions: ['read', 'create'],
      },
      {
        id: '3',
        name: 'Content Management',
        description: 'Manage website content',
        resource: 'content',
        actions: ['read', 'create'],
      },
    ],
  },
  {
    id: '3',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: [
      {
        id: '1',
        name: 'User Management',
        description: 'Manage system users',
        resource: 'users',
        actions: ['read'],
      },
      {
        id: '2',
        name: 'Role Management',
        description: 'Manage user roles',
        resource: 'roles',
        actions: ['read'],
      },
      {
        id: '3',
        name: 'Content Management',
        description: 'Manage website content',
        resource: 'content',
        actions: ['read'],
      },
    ],
  },
];

interface RoleContextType {
  roles: Role[];
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);

  const addRole = (role: Omit<Role, 'id'>) => {
    const newRole: Role = {
      ...role,
      id: Math.random().toString(36).substr(2, 9),
    };
    setRoles(prev => [...prev, newRole]);
  };

  const updateRole = (id: string, role: Partial<Role>) => {
    setRoles(prev =>
      prev.map(r => (r.id === id ? { ...r, ...role } : r))
    );
  };

  const deleteRole = (id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  return (
    <RoleContext.Provider value={{ roles, addRole, updateRole, deleteRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RoleProvider');
  }
  return context;
}