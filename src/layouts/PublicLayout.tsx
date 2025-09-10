import { Outlet } from 'react-router-dom';
import PublicNavBar from '../components/PublicNavBar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop'; // Import ScrollToTop

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavBar />
      <main>
        <ScrollToTop /> {/* Add ScrollToTop here */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
