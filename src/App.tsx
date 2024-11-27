import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import UserList from './components/users/UserList';
import RoleMatrix from './components/roles/RoleMatrix';
import { UserProvider } from './store/UserContext';
import { RoleProvider } from './store/RoleContext';
import { NotificationProvider } from './store/NotificationContext';
import './styles/notifications.css';
import './styles/theme.css';

function App() {
  const [currentView, setCurrentView] = React.useState('users');

  const renderView = () => {
    switch (currentView) {
      case 'users':
        return <UserList />;
      case 'roles':
        return <RoleMatrix />;
      default:
        return <div>Select a view from the sidebar</div>;
    }
  };

  return (
    <NotificationProvider>
      <UserProvider>
        <RoleProvider>
          <DashboardLayout setCurrentView={setCurrentView}>
            <div className="space-y-6">
              {renderView()}
            </div>
          </DashboardLayout>
        </RoleProvider>
      </UserProvider>
    </NotificationProvider>
  );
}

export default App;