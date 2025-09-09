import React, { useContext, useMemo } from 'react';
import { RewardContext } from '../context/RewardContext';
import { AuthContext } from '../context/AuthContext';
import { HouseholdContext } from '../context/HouseholdContext';
import { ModalContext } from '../context/ModalContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const PendingRedemptions = ({ requests, members, rewards, approveRedemption, denyRedemption }) => {
    const pendingRequests = requests.filter(r => r.status === 'pending');
    if (pendingRequests.length === 0) return null;

    const getMemberName = (userId) => members.find(m => m.user._id === userId)?.user.displayName || 'Unknown Member';
    const getRewardName = (rewardId) => rewards.find(r => r._id === rewardId)?.name || 'Unknown Reward';

    return (
        <Card className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Pending Approvals</h3>
            <ul className="space-y-4">
                {pendingRequests.map(request => (
                    <li key={request._id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-bold text-gray-900">{getRewardName(request.reward)}</p>
                            <p className="text-sm text-gray-600">Requested by: {getMemberName(request.user)}</p>
                        </div>
                        <div className="flex space-x-2">
                            <Button onClick={() => denyRedemption(request._id)} variant="danger" size="sm">Deny</Button>
                            <Button onClick={() => approveRedemption(request._id)} variant="success" size="sm">Approve</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

const StorePage = ({ activeMemberId, onBack }) => {
    const { rewards, redemptionRequests, loading, addReward, updateReward, deleteReward, requestRedemption, approveRedemption, denyRedemption } = useContext(RewardContext);
    const { session, isParentSession } = useContext(AuthContext);
    const { householdData } = useContext(HouseholdContext);
    const { showModal } = useContext(ModalContext);

    const isManageMode = isParentSession && !activeMemberId;
    const memberIdForRedemption = activeMemberId || session.user?._id;
    const members = householdData.household?.members || [];
    const activeMember = members.find(m => m.user._id === memberIdForRedemption)?.user;

    const userPendingRequestIds = useMemo(() =>
        new Set(redemptionRequests.filter(r => r.user === memberIdForRedemption && r.status === 'pending').map(r => r.reward)),
        [redemptionRequests, memberIdForRedemption]
    );

    // This function now lives in the page component and will be passed to the modal
    const handleSaveReward = (rewardData, rewardId) => {
        if (rewardId) {
            return updateReward(rewardId, rewardData);
        } else {
            return addReward(rewardData);
        }
    };

    // The modal is opened with the `onSave` prop
    const openAddEditRewardModal = (reward = null) => {
        showModal('addEditReward', {
            rewardToEdit: reward,
            onSave: handleSaveReward
        });
    };

    const handleDelete = (rewardId) => {
        showModal('confirmation', {
            title: 'Delete Reward?',
            message: 'Are you sure you want to permanently delete this reward?',
            onConfirm: () => deleteReward(rewardId)
        });
    };

    const handleRedeem = (reward) => {
        if (!activeMember) {
            console.error("[StorePage] Could not identify the active member for redeeming.");
            alert("Could not identify the user redeeming the reward.");
            return;
        }
        if (activeMember.points < reward.cost) {
            alert("You don't have enough points for this reward!");
            return;
        }
        requestRedemption(reward._id, activeMember._id);
        alert("Request sent to parent for approval!");
    };

    if (loading) {
        return <div className="text-center p-8">Loading rewards...</div>;
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {isManageMode && (
                <PendingRedemptions 
                    requests={redemptionRequests} 
                    members={members}
                    rewards={rewards}
                    approveRedemption={approveRedemption}
                    denyRedemption={denyRedemption}
                />
            )}
            <div className="flex justify-between items-center">
                 <div className="flex items-center">
                     {onBack && (
                         <Button onClick={onBack} variant="secondary" className="mr-4">&larr; Back to Profile</Button>
                     )}
                     <div>
                         <h2 className="text-3xl font-bold text-gray-800">Reward Store</h2>
                         {activeMember && !isManageMode && <p className="text-gray-600">Redeeming for: <span className="font-bold">{activeMember.displayName}</span> ({activeMember.points} pts)</p>}
                     </div>
                 </div>
                 {isManageMode && (
                     <Button onClick={() => openAddEditRewardModal()}>+ Add Reward</Button>
                 )}
             </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map(reward => (
                    <Card key={reward._id} className="p-6 flex flex-col">
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-gray-800">{reward.name}</h3>
                            <p className="text-gray-500 mt-2">{reward.description}</p>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl font-bold text-indigo-600">{reward.cost} pts</p>
                            <div className="flex justify-end space-x-2 mt-2">
                                {isManageMode ? (
                                    <>
                                        <Button onClick={() => openAddEditRewardModal(reward)} variant="link">Edit</Button>
                                        <Button onClick={() => handleDelete(reward._id)} variant="dangerLink">Delete</Button>
                                    </>
                                ) : (
                                    <Button 
                                        onClick={() => handleRedeem(reward)} 
                                        variant="success"
                                        disabled={userPendingRequestIds.has(reward._id)}
                                    >
                                        {userPendingRequestIds.has(reward._id) ? 'Pending...' : 'Redeem'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default StorePage;

