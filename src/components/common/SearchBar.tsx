import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative group">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
      
      {/* Search container */}
      <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center px-4 py-3">
          {/* Search icon */}
          <Search className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
          
          {/* Search input */}
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 ml-3 text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none focus:ring-0"
          />
          
          {/* Clear button */}
          {value && (
            <button
              onClick={() => onChange('')}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Bottom border with gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </div>
    </div>
  );
} 