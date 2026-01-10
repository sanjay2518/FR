import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AppLayout.css';

const AppLayout = ({ hideFooter = false, variant = 'default' }) => {
    return (
        <div className={`app-layout app-layout--${variant}`}>
            <Navbar />
            <main className="app-main">
                <Outlet />
            </main>
            {!hideFooter && <Footer />}
        </div>
    );
};

export default AppLayout;