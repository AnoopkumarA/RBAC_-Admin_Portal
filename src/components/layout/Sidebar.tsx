import React, { useState, useEffect } from 'react';
import { Users, Shield, Settings, ChevronLeft, ChevronRight, Lock } from 'lucide-react';

interface SidebarProps {
  setCurrentView: (view: string) => void;
}

export default function Sidebar({ setCurrentView }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('users');

  // Handle keyboard shortcut for sidebar toggle
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === '>') {
        setIsCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setCurrentView(view);
  };

  return (
    <div 
      className={`bg-[#1a1f2e] transition-all duration-300 ease-in-out flex flex-col relative h-screen
        ${isCollapsed ? 'w-20' : 'w-64'}`}
    >
      {/* Toggle Button - Moved to middle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-indigo-600 
          rounded-full p-2 text-white shadow-lg hover:shadow-xl transform transition-all duration-200 
          hover:scale-110 hover:from-indigo-600 hover:to-indigo-700 group z-50"
        title={isCollapsed ? "Expand (>)" : "Collapse (>)"}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {isCollapsed ? 
            <ChevronRight className="h-5 w-5 group-hover:animate-pulse" /> : 
            <ChevronLeft className="h-5 w-5 group-hover:animate-pulse" />
          }
        </div>
      </button>

      {/* Logo Section */}
      <div className="p-4 border-b border-gray-700">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="flex-shrink-0">
            <div className="w-10 h-10 relative">
              {/* Outer hexagon */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg transform rotate-45"></div>
              {/* Inner hexagon */}
              <div className="absolute inset-1 bg-[#1a1f2e] rounded-lg transform rotate-45 flex items-center justify-center">
                {/* Lock icon with gradient */}
                <div className="transform -rotate-45">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text">
                    <Lock className="h-5 w-5 text-transparent stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`transition-opacity duration-200 
            ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              RBAC
            </h1>
            <p className="text-xs text-gray-400">Access Control</p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {[
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'roles', icon: Shield, label: 'Roles' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(({ id, icon: Icon, label }) => (
            <li key={id}>
              <button
                onClick={() => handleViewChange(id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                  ${activeView === id 
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-[#252b3b] hover:text-white hover:translate-x-1'}
                  ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className={`${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
                <span className={`transition-opacity duration-200 
                  ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                  {label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className={`p-4 border-t border-gray-700 ${isCollapsed ? 'text-center' : ''}`}>
        <div className={`text-sm text-gray-400 transition-opacity duration-200 
          ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
          <p>RBAC v1.0.0</p>
        </div>
        {isCollapsed && <div className="text-gray-400 text-xs">1.0</div>}
      </div>
    </div>
  );
}