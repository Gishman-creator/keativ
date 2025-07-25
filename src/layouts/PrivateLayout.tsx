import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const PrivateLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <main className={`flex-1 p-6 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} mt-16 transition-all duration-300`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
