import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useRoles } from '../../store/RoleContext';
import type { Role, Permission } from '../../types';
import PermissionCheckbox from './PermissionCheckbox';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export default function AddRoleModal({ isOpen, onClose }: AddRoleModalProps) {
  const { addRole, roles } = useRoles();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentRole: '',
    permissions: [] as Permission[],
  });

  if (!isOpen) return null;

  const getEffectivePermissions = () => {
    if (!formData.parentRole) {
      return formData.permissions;
    }

    const parentPermissions = roles.find(r => r.id === formData.parentRole)?.permissions || [];
    
    const combinedPermissions = [...parentPermissions];
    
    formData.permissions.forEach(permission => {
      const existingPermIndex = combinedPermissions.findIndex(p => p.id === permission.id);
      if (existingPermIndex === -1) {
        combinedPermissions.push(permission);
      } else {
        combinedPermissions[existingPermIndex] = {
          ...combinedPermissions[existingPermIndex],
          actions: Array.from(new Set([
            ...combinedPermissions[existingPermIndex].actions,
            ...permission.actions
          ]))
        };
      }
    });

    return combinedPermissions;
  };

  const handlePermissionChange = (
    permissionId: string,
    action: 'create' | 'read' | 'update' | 'delete'
  ) => {
    const effectivePermissions = getEffectivePermissions();
    const existingPermission = effectivePermissions.find(p => p.id === permissionId);
    const parentPermission = formData.parentRole 
      ? roles.find(r => r.id === formData.parentRole)?.permissions.find(p => p.id === permissionId)
      : null;

    let newPermissions;
    const currentPermission = formData.permissions.find(p => p.id === permissionId);

    if (currentPermission) {
      newPermissions = formData.permissions.map(p =>
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
      const baseActions = parentPermission?.actions || [];
      const newActions = baseActions.includes(action)
        ? baseActions.filter(a => a !== action)
        : [...baseActions, action];

      newPermissions = [
        ...formData.permissions,
        {
          id: permissionId,
          name: mockPermissions.find(p => p.id === permissionId)?.name || '',
          description: mockPermissions.find(p => p.id === permissionId)?.description || '',
          resource: mockPermissions.find(p => p.id === permissionId)?.resource || '',
          actions: newActions,
        },
      ];
    }

    setFormData(prev => ({ ...prev, permissions: newPermissions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectivePermissions = getEffectivePermissions();
    
    addRole({
      ...formData,
      permissions: effectivePermissions,
    });
    
    onClose();
    setFormData({
      name: '',
      description: '',
      parentRole: '',
      permissions: [],
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal w-full max-w-4xl p-6 slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Add New Role</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Inherit From Role</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.parentRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentRole: e.target.value }))}
                >
                  <option value="">None</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  New role will inherit all permissions from the selected role
                </p>
              </div>
            </div>

            <div className="border-l pl-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
              <div className="space-y-6">
                {mockPermissions.map((permission) => (
                  <div key={permission.id} className="space-y-2">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {permission.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {permission.description}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {(['create', 'read', 'update', 'delete'] as const).map((action) => (
                        <div key={action} className="flex items-center gap-2">
                          <PermissionCheckbox
                            checked={getEffectivePermissions()
                              .find(p => p.id === permission.id)
                              ?.actions.includes(action) || false}
                            onChange={() => handlePermissionChange(permission.id, action)}
                            disabled={false}
                          />
                          <span className="text-sm text-gray-600 capitalize">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Add Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}