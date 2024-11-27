import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  setCurrentView: (view: string) => void;
}

export default function DashboardLayout({ children, setCurrentView }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar setCurrentView={setCurrentView} />
      <div className="flex-1">
        <Header />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}