import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AppLayout.css';

const AppLayout = ({ hideFooter = false, variant = 'default', hideNavbar = false }) => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    
    return (
        <div className={`app-layout app-layout--${variant}`}>
            {!hideNavbar && !isAuthPage && <Navbar />}
            <main className={`app-main ${isAuthPage ? 'app-main--auth' : ''}`}>
                <Outlet />
            </main>
            {!hideFooter && <Footer />}
        </div>
    );
};

export default AppLayout;