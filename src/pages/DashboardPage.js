import React, { useContext } from 'react';
import { HouseholdContext } from '../context/HouseholdContext';
import { TaskContext } from '../context/TaskContext';
import Card from '../components/ui/Card';

const DashboardPage = ({ onSelectMember }) => {
    const { householdData } = useContext(HouseholdContext);
    const { tasks, loading: tasksLoading } = useContext(TaskContext);
    const { household, loading: householdLoading } = householdData;

    const members = household?.members || [];
    const pendingTasks = tasks.filter(task => task.status === 'pending_approval').length;
    const totalPoints = Array.isArray(members) ? members.reduce((acc, member) => acc + (member.user?.points || 0), 0) : 0;

    if (householdLoading || tasksLoading) {
        return <div className="text-center p-8">Loading dashboard data...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
                <p className="text-gray-600">Here's a quick look at your family's activity.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6"><h3 className="text-lg font-semibold text-gray-700">Household Members</h3><p className="text-4xl font-bold text-indigo-600">{members.length}</p></Card>
                <Card className="p-6"><h3 className="text-lg font-semibold text-gray-700">Tasks Awaiting Approval</h3><p className="text-4xl font-bold text-yellow-500">{pendingTasks}</p></Card>
                <Card className="p-6"><h3 className="text-lg font-semibold text-gray-700">Total Points Earned</h3><p className="text-4xl font-bold text-green-500">{totalPoints}</p></Card>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Member Leaderboard</h3>
                <Card className="overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {Array.isArray(members) && [...members].sort((a, b) => (b.user?.points || 0) - (a.user?.points || 0)).map(member => (
                            // Add a check to ensure user and displayName exist
                            member.user && member.user.displayName && (
                                <li key={member.user._id} onClick={() => onSelectMember(member.user._id)} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <div 
                                            className="h-12 w-12 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: member.color }}
                                        >
                                            <span className="text-xl font-bold text-white">{(member.user.displayName || '').charAt(0).toUpperCase()}</span>
                                        </div>
                                        <div className="ml-4"><p className="text-lg font-semibold text-gray-900">{member.user.displayName}</p><p className="text-sm text-gray-500">{member.user.role === 'parent' ? 'Parent' : 'Child'}</p></div>
                                    </div>
                                    <div className="text-xl font-bold text-indigo-600">{member.user.points || 0} pts</div>
                                </li>
                            )
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;

