import { Outlet } from 'react-router-dom';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;