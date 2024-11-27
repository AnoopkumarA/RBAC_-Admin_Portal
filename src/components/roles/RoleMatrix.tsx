import React, { useState } from 'react';
import { ChevronRight, Plus, Search, X } from 'lucide-react';
import { useRoles } from '../../store/RoleContext';
import AddRoleModal from './AddRoleModal';
import PermissionCheckbox from './PermissionCheckbox';
import type { Permission, Role } from '../../types';
import EditRoleModal from './EditRoleModal';
import SearchBar from '../common/SearchBar';

const mockPermissions: Permission[] = [
  
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
];

export default function RoleMatrix() {
  const { roles, updateRole, deleteRole } = useRoles();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handlePermissionChange = (
    roleId: string,
    permissionId: string,
    action: 'create' | 'read' | 'update' | 'delete'
  ) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    const permission = role.permissions.find(p => p.id === permissionId);
    let newPermissions;

    if (permission) {
      // Toggle action in existing permission
      newPermissions = role.permissions.map(p =>
        p.id === permissionId
          ? {
              ...p,
              actions: p.actions.includes(action)
                ? p.actions.filter(a => a !== action)
                : [...p.actions, action],
            }
          : p
      );
    } else {
      // Add new permission with single action
      newPermissions = [
        ...role.permissions,
        {
          id: permissionId,
          name: mockPermissions.find(p => p.id === permissionId)?.name || '',
          description: mockPermissions.find(p => p.id === permissionId)?.description || '',
          resource: mockPermissions.find(p => p.id === permissionId)?.resource || '',
          actions: [action],
        },
      ];
    }

    updateRole(roleId, { permissions: newPermissions });
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 fade-in bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Roles & Permissions</h2>
            <p className="text-gray-500 mt-1">Manage role-based access control</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 
              text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-700 
              transform transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Add Role
          </button>
        </div>

        <div className="mb-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search roles by name..."
          />
        </div>

        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#1a1f2e] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider w-64">
                  Permission / Role
                </th>
                {filteredRoles.map((role) => (
                  <th key={role.id} className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{role.name}</span>
                        {role.name !== 'Admin' && (
                          <button 
                            onClick={() => handleEditRole(role)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <span className="text-xs text-gray-300 mt-1">{role.description}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPermissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {permission.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {permission.description}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {['create', 'read', 'update', 'delete'].map((action) => (
                        <span key={action} className="text-xs text-gray-500 font-medium">
                          {action.charAt(0).toUpperCase() + action.slice(1)}
                        </span>
                      ))}
                    </div>
                  </td>
                  {filteredRoles.map((role) => (
                    <td key={role.id} className="px-6 py-4">
                      <div className="grid grid-cols-4 gap-2">
                        {(['create', 'read', 'update', 'delete'] as const).map((action) => (
                          <div key={action} className="flex justify-center">
                            <PermissionCheckbox
                              checked={role.permissions
                                .find(p => p.id === permission.id)
                                ?.actions.includes(action) || false}
                              onChange={() => handlePermissionChange(role.id, permission.id, action)}
                              disabled={role.name === 'Admin'}
                            />
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AddRoleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditRoleModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRole(null);
        }} 
        role={editingRole}
      />
    </div>
  );
}