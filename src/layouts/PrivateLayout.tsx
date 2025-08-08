import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/influencer-dashboard/Sidebar';
import Header from '../components/influencer-dashboard/Header';

const PrivateLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} className="hidden md:flex" />
        <main className={`flex-1 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} mt-16 transition-all duration-300 h-full overflow-y-auto pb-16`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
