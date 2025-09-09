import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { ModalContext } from './context/ModalContext';
import LoginPage from './pages/LoginPage';
import KioskPage from './pages/KioskPage';
import MainLayout from './components/layouts/MainLayout';
import MemberProfilePage from './pages/MemberProfilePage';
import StorePage from './pages/StorePage'; // Import StorePage here

function App() {
    const { session } = useContext(AuthContext);
    const { showModal } = useContext(ModalContext);
    const [pinSetupInitiated, setPinSetupInitiated] = useState(false);
    const [viewingMemberId, setViewingMemberId] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard');

    useEffect(() => {
        if (session.user && session.user.role === 'parent' && !session.user.pinIsSet && !pinSetupInitiated) {
            showModal('pin', { mode: 'setup' });
            setPinSetupInitiated(true);
        }
    }, [session.user, showModal, pinSetupInitiated]);

    const navigateTo = (view, memberId = null) => {
        setCurrentView(view);
        setViewingMemberId(memberId);
    };

    // --- View Rendering Logic ---

    if (session.mode === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (session.mode === 'logged-out') {
        return <LoginPage />;
    }

    // Kiosk Mode Views
    if (session.mode === 'kiosk') {
        if (currentView === 'profile' && viewingMemberId) {
            return <MemberProfilePage 
                        memberId={viewingMemberId} 
                        onBack={() => navigateTo('kiosk')} 
                        onGoToStore={() => navigateTo('store', viewingMemberId)} 
                    />;
        }
        if (currentView === 'store' && viewingMemberId) {
            return <StorePage 
                        activeMemberId={viewingMemberId} 
                        onBack={() => navigateTo('profile', viewingMemberId)} 
                    />;
        }
        // Default Kiosk view
        return <KioskPage onSelectMember={(id) => navigateTo('profile', id)} />;
    }

    // Parent Mode Views
    if (session.mode === 'parent') {
        if (currentView === 'profile' && viewingMemberId) {
            return <MemberProfilePage 
                        memberId={viewingMemberId} 
                        onBack={() => navigateTo('dashboard')} 
                        onGoToStore={() => navigateTo('store', viewingMemberId)} 
                    />;
        }
        // Default Parent view is the MainLayout
        return <MainLayout 
                    currentView={currentView} 
                    setCurrentView={setCurrentView} 
                    onSelectMember={(id) => navigateTo('profile', id)}
                    activeMemberId={viewingMemberId}
                />;
    }
    
    return <LoginPage />;
}

export default App;
