import React, { useContext } from 'react';
import { HouseholdContext } from '../context/HouseholdContext';
import { TaskContext } from '../context/TaskContext';

const MemberProfilePage = ({ memberId, onBack }) => {
    const { householdData } = useContext(HouseholdContext);
    const { tasks, loading: tasksLoading, completeTask } = useContext(TaskContext);

    // Find the specific member's data from the household context
    const member = householdData.household?.members.find(m => m.user._id === memberId)?.user;
    
    if (!member) {
        return (
            <div className="text-center p-8">
                <p>Member not found.</p>
                <button onClick={onBack} className="mt-4 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Go Back</button>
            </div>
        );
    }

    // Filter tasks to find only those assigned to this member
    const memberTasks = tasks.filter(task => task.assignedTo.some(assignee => assignee._id === memberId));

    const TaskCard = ({ task }) => (
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
                <h4 className="font-bold text-lg text-gray-800">{task.title}</h4>
                <p className="text-sm font-semibold text-indigo-600">{task.points} points</p>
                <p className="text-xs text-gray-500 capitalize mt-1">Type: {task.type}</p>
            </div>
            <div>
                {task.status === 'incomplete' && (
                    <button onClick={() => completeTask(task._id)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Complete</button>
                )}
                {task.status === 'pending_approval' && (<span className="text-sm font-semibold text-yellow-600">Pending Approval</span>)}
                {task.status === 'complete' && (<span className="text-sm font-semibold text-green-600">✓ Done!</span>)}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="flex items-center mb-8">
                <button onClick={onBack} className="mr-4 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">&larr; Back</button>
                <h1 className="text-3xl font-bold text-gray-800">{member.displayName}'s Profile</h1>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-700">Total Points</h2>
                <p className="text-4xl font-bold text-indigo-600">{member.points || 0}</p>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Assigned Tasks</h3>
                {tasksLoading ? (
                    <p>Loading tasks...</p>
                ) : (
                    <div className="space-y-4">
                        {memberTasks.length > 0 ? (
                            memberTasks.map(task => <TaskCard key={task._id} task={task} />)
                        ) : (
                            <p className="text-gray-500 bg-white p-4 rounded-md">No tasks assigned.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberProfilePage;
