import React, { useState, useContext } from 'react';
import { HouseholdContext } from '../context/HouseholdContext';
import { ModalContext } from '../context/ModalContext';
import InvitationPage from './InvitationPage';
import Card from '../components/ui/Card'; // Import Card
import Button from '../components/ui/Button'; // Import Button

const ManageHouseholdPage = () => {
    const { householdData, addMember, updateMember, deleteMember, linkCalendar } = useContext(HouseholdContext);
    const { showModal } = useContext(ModalContext);
    const { household, loading } = householdData;
    const members = household?.members || [];
    const [currentView, setCurrentView] = useState('members');
    const [confirmingDelete, setConfirmingDelete] = useState(null);

    const handleSaveMember = (memberData, memberId) => {
        if (memberId) {
            return updateMember(memberId, memberData);
        } else {
            return addMember(memberData);
        }
    };

    const openAddModal = () => {
        showModal('addEditMember', { onSave: (data) => handleSaveMember(data, null), memberToEdit: null });
    };

    const openEditModal = (member) => {
        showModal('addEditMember', { 
            onSave: (data) => handleSaveMember(data, member.user._id), 
            memberToEdit: member 
        });
    };

    const handleJoinSuccess = () => {
        if (householdData.refreshHouseholdData) householdData.refreshHouseholdData();
        setCurrentView('members');
    };

    const handleDeleteClick = (memberId) => {
        if (confirmingDelete === memberId) {
            deleteMember(memberId);
            setConfirmingDelete(null);
        } else {
            setConfirmingDelete(memberId);
        }
    };

    const handleLinkCalendar = (memberId) => {
        linkCalendar(memberId);
    };

    if (loading) {
        return <div className="text-center p-8">Loading household information...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div><h2 className="text-3xl font-bold text-gray-800">Manage Household</h2><p className="text-gray-600 mt-1">View, manage, and invite your family members.</p></div>
            </div>
            <div className="flex space-x-2 border-b border-gray-200">
                <button onClick={() => setCurrentView('members')} className={`py-2 px-4 font-semibold text-sm rounded-t-lg ${currentView === 'members' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Members</button>
                <button onClick={() => setCurrentView('invite')} className={`py-2 px-4 font-semibold text-sm rounded-t-lg ${currentView === 'invite' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>Invite Members</button>
            </div>
            {currentView === 'members' && (
                <Card className="overflow-hidden">
                    <div className="p-4 flex justify-end"><Button onClick={openAddModal} variant="primary">Add Member</Button></div>
                    <ul className="divide-y divide-gray-200">
                        {members.map(member => (
                            <li key={member.user._id} className="p-4 flex justify-between items-center">
                                <div className="flex items-center">
                                    <div 
                                        className="h-12 w-12 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: member.color }}
                                    >
                                        <span className="text-xl font-bold text-white">{member.user.displayName.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-lg font-semibold text-gray-900">{member.user.displayName}</p>
                                        <p className="text-sm text-gray-500 capitalize">{member.user.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {member.user.googleCalendarId ? (
                                        <span className="text-sm font-medium text-green-600">✓ Calendar Linked</span>
                                    ) : (
                                        <Button onClick={() => handleLinkCalendar(member.user._id)} variant="link">Link Calendar</Button>
                                    )}
                                    <Button onClick={() => openEditModal(member)} variant="link">Edit</Button>
                                    <Button 
                                        onClick={() => handleDeleteClick(member.user._id)}
                                        variant={confirmingDelete === member.user._id ? 'dangerLink' : 'link'}
                                        className={confirmingDelete === member.user._id ? '' : 'text-gray-500 hover:text-gray-700'}
                                    >
                                        {confirmingDelete === member.user._id ? 'Confirm?' : 'Delete'}
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
            {currentView === 'invite' && (<InvitationPage householdId={household?._id} onJoinSuccess={handleJoinSuccess} />)}
        </div>
    );
};

export default ManageHouseholdPage;
