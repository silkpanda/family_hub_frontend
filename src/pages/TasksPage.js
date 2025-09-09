import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { HouseholdContext } from '../context/HouseholdContext';
import { ModalContext } from '../context/ModalContext';
import Button from '../components/ui/Button';
import QuestsManager from '../components/tasks/QuestsManager';
import ChoresManager from '../components/tasks/ChoresManager';
import RoutinesManager from '../components/tasks/RoutinesManager';

const TasksPage = () => {
    const { loading, addTask, updateTask, deleteTask } = useContext(TaskContext);
    const { householdData } = useContext(HouseholdContext); // Get household data
    const { showModal } = useContext(ModalContext);

    const handleSaveTask = (taskData, taskId) => {
        if (taskId) {
            updateTask(taskId, taskData);
        } else {
            addTask(taskData);
        }
    };

    const openAddEditTaskModal = (taskType, task = null) => {
        showModal('addEditTask', {
            taskToEdit: task,
            taskType,
            onSave: handleSaveTask,
            // Pass the household members to the modal
            householdMembers: householdData.household?.members || [] 
        });
    };

    const handleDelete = (taskId) => {
        showModal('confirmation', {
            title: 'Delete Task?',
            message: 'Are you sure you want to permanently delete this task?',
            onConfirm: () => deleteTask(taskId)
        });
    };

    if (loading) {
        return <div className="text-center p-8">Loading tasks...</div>;
    }
    
    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Quests Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Quests</h2>
                    <Button onClick={() => openAddEditTaskModal('quest')}>+ Add Quest</Button>
                </div>
                <QuestsManager
                    onEdit={(task) => openAddEditTaskModal('quest', task)}
                    onDelete={handleDelete}
                />
            </div>

            {/* Chores Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Chores</h2>
                    <Button onClick={() => openAddEditTaskModal('chore')}>+ Add Chore</Button>
                </div>
                <ChoresManager
                    onEdit={(task) => openAddEditTaskModal('chore', task)}
                    onDelete={handleDelete}
                />
            </div>

            {/* Routines Section */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Routines</h2>
                    <Button onClick={() => openAddEditTaskModal('routine')}>+ Add Routine</Button>
                </div>
                <RoutinesManager
                    onEdit={(task) => openAddEditTaskModal('routine', task)}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default TasksPage;

