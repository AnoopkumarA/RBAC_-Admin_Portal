import React from 'react';
import { Check } from 'lucide-react';

interface PermissionCheckboxProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export default function PermissionCheckbox({ checked, onChange, disabled }: PermissionCheckboxProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`w-5 h-5 rounded transition-all duration-200 ${
        checked 
          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 border-transparent' 
          : 'bg-white border-gray-300 hover:border-indigo-500'
      } ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-md'
      } border flex items-center justify-center`}
    >
      {checked && <Check className="h-3 w-3 text-white" />}
    </button>
  );
}