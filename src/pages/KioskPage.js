import React, { useContext } from 'react';
import { ModalContext } from '../context/ModalContext';
import { AuthContext } from '../context/AuthContext';
import { HouseholdContext } from '../context/HouseholdContext';
import Button from '../components/ui/Button';

const KioskPage = ({ onSelectMember }) => {
    const { showModal } = useContext(ModalContext);
    const { fullLogout } = useContext(AuthContext);
    const { householdData } = useContext(HouseholdContext);
    const { household, loading } = householdData;

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">{household?.name || 'Family Hub'}</h1>
                <div className="space-x-2">
                    <Button onClick={() => showModal('pin', { mode: 'login' })} variant="primary">Parent Access</Button>
                    <Button onClick={fullLogout} variant="secondary">Logout</Button>
                </div>
            </header>
            <main className="p-8">
                <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">Who's Using The Hub?</h2>
                {loading ? (<p className="text-center">Loading members...</p>) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {household?.members.map(member => (
                            // Add a check to ensure user and displayName exist before rendering
                            member.user && member.user.displayName && (
                                <div key={member.user._id} onClick={() => onSelectMember(member.user._id)} className="text-center cursor-pointer group">
                                    <div 
                                        className="h-32 w-32 rounded-full flex items-center justify-center mx-auto border-4 border-transparent group-hover:border-indigo-500 transition-all"
                                        style={{ backgroundColor: member.color }}
                                    >
                                        <span className="text-5xl font-bold text-white">{(member.user.displayName || '').charAt(0).toUpperCase()}</span>
                                    </div>
                                    <p className="mt-4 text-xl font-semibold text-gray-800">{member.user.displayName}</p>
                                    <p className="text-md text-indigo-600 font-bold">{member.user.points || 0} Points</p>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default KioskPage;

