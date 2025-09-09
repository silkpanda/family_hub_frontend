import React, { useContext, useMemo } from 'react';
import { HouseholdContext } from '../context/HouseholdContext';
import { TaskContext } from '../context/TaskContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const MemberProfilePage = ({ memberId, onBack, onGoToStore }) => {
    const { householdData, loading: householdLoading } = useContext(HouseholdContext);
    const { tasks, loading: tasksLoading, completeTask } = useContext(TaskContext);

    const memberTasks = useMemo(() => {
        return tasks.filter(task => 
            task.assignedTo.some(assignee => (assignee._id || assignee) === memberId)
        );
    }, [tasks, memberId]);

    if (householdLoading || tasksLoading) {
        return <div className="text-center p-8">Loading member details...</div>;
    }

    const memberData = householdData.household?.members.find(m => m.user._id === memberId);
    const member = memberData?.user;
     
    // Add a more robust check for member and displayName
    if (!member || !member.displayName) {
        return (
            <div className="text-center p-8">
                <p>Could not find this member in the household.</p>
                <Button onClick={onBack} variant="secondary" className="mt-4">Go Back</Button>
            </div>
        );
    }

    const TaskCard = ({ task }) => (
        <Card className="p-4 flex justify-between items-center">
            <div>
                <h4 className="font-bold text-lg text-gray-800">{task.title}</h4>
                <p className="text-sm font-semibold text-indigo-600">{task.points} points</p>
                <p className="text-xs text-gray-500 capitalize mt-1">Type: {task.type}</p>
            </div>
            <div>
                {task.status === 'incomplete' && (
                    <Button onClick={() => completeTask(task._id)} className="bg-blue-500 hover:bg-blue-600">Complete</Button>
                )}
                {task.status === 'pending_approval' && (<span className="text-sm font-semibold text-yellow-600">Pending Approval</span>)}
                {task.status === 'complete' && (<span className="text-sm font-semibold text-green-600">✓ Done!</span>)}
            </div>
        </Card>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="flex items-center mb-8">
                <Button onClick={onBack} variant="secondary" className="mr-4">&larr; Back</Button>
                <div 
                    className="h-12 w-12 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: memberData.color }}
                >
                    <span className="text-xl font-bold text-white">{(member.displayName || '').charAt(0).toUpperCase()}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">{member.displayName}'s Profile</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Card className="p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-700">Total Points</h2>
                    <p className="text-4xl font-bold text-indigo-600">{member.points || 0}</p>
                </Card>
                <Button onClick={onGoToStore} variant="success" className="text-2xl">
                    Go to Store
                </Button>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Assigned Tasks ({memberTasks.length})</h3>
                <div className="space-y-4">
                    {memberTasks.length > 0 ? (
                        memberTasks.map(task => <TaskCard key={task._id} task={task} />)
                    ) : (
                        <Card className="p-4"><p className="text-gray-500">No tasks assigned.</p></Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemberProfilePage;

