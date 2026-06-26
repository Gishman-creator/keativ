import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/influencer-dashboard/Sidebar';
import Header from '../components/influencer-dashboard/Header';
import ScrollToTop from '../components/ScrollToTop'; // Import ScrollToTop
import { RootState } from '@/redux/store'; // Assuming RootState is defined in store.ts
import AppInitializer from '@/AppInitializer';
import { useState } from 'react';

const PrivateLayout = () => {
  const sidebarCollapsed = true;
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  console.log("user", user);

  // Check if user is not logged in and not currently loading
  if (!user || !user.isLoggedIn) {
    navigate('/login');
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={sidebarCollapsed} className="hidden md:flex" />
        <main className={`flex-1 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} mt-16 transition-all duration-300 h-full overflow-y-auto pb-16`}>
          <ScrollToTop /> {/* Add ScrollToTop here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
