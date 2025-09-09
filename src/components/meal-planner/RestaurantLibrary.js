import React, { useContext, useState } from 'react';
import { MealPlannerContext } from '../../context/MealPlannerContext';
import { ModalContext } from '../../context/ModalContext';
import { useDraggable } from '@dnd-kit/core';
import Card from '../ui/Card';
import Button from '../ui/Button';

// A new, separate component for each draggable restaurant item.
const DraggableRestaurantItem = ({ restaurant, onEdit, onDelete, isEditing }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `restaurant-${restaurant._id}`,
        // Disable drag-and-drop when in editing mode
        disabled: isEditing,
    });

    const style = {
        // Animate the item fading out when dragging.
        // The opacity will be 1 when not dragging.
        opacity: isDragging ? 0.0 : 1,
        // The transition is applied to all properties for a smooth effect.
        transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        // When not editing, the cursor should indicate it's draggable.
        cursor: isEditing ? 'default' : 'grab',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-3 rounded-lg flex justify-between items-center transform 
                        ${isEditing ? 'bg-gray-200' : 'bg-gray-100'} 
                        ${isDragging ? 'shadow-lg' : ''}`}
        >
            <span className="font-semibold text-gray-800">{restaurant.name}</span>
            <div className="flex space-x-2 items-center">
                {/* These buttons only appear when isEditing is true */}
                {isEditing && (
                    <div className="flex space-x-2">
                        {/* The data attribute is moved to the buttons for more precise control */}
                        <Button onClick={() => onEdit(restaurant)} variant="link" data-dnd-disabled-interactive-element="true">Edit</Button>
                        <Button onClick={() => onDelete(restaurant._id)} variant="dangerLink" data-dnd-disabled-interactive-element="true">Del</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const RestaurantLibrary = () => {
    const { restaurants, addRestaurant, updateRestaurant, deleteRestaurant } = useContext(MealPlannerContext);
    const { showModal } = useContext(ModalContext);
    const [isEditing, setIsEditing] = useState(false);

    const handleToggleEdit = () => {
        console.log('Toggling edit mode. New state:', !isEditing);
        setIsEditing(!isEditing);
    };

    const handleSaveRestaurant = (restaurantData, restaurantId) => {
        if (restaurantId) {
            return updateRestaurant(restaurantId, restaurantData);
        } else {
            return addRestaurant(restaurantData);
        }
    };
    
    const handleDeleteRestaurant = (restaurantId) => {
        console.log('Attempting to delete restaurant with ID:', restaurantId);
        showModal('confirmation', {
            title: 'Delete Restaurant?',
            message: 'Are you sure you want to permanently delete this restaurant?',
            onConfirm: () => deleteRestaurant(restaurantId)
        });
    };

    const openAddEditRestaurantModal = (restaurant = null) => {
        showModal('addEditRestaurant', { 
            restaurantToEdit: restaurant,
            onSave: handleSaveRestaurant,
            onDelete: handleDeleteRestaurant
        });
    };
    
    return (
        <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Restaurants</h3>
                <div className="space-x-2 flex">
                    <Button onClick={handleToggleEdit} size="sm" variant="outline">
                        {isEditing ? 'Done' : 'Edit'}
                    </Button>
                    <Button onClick={() => openAddEditRestaurantModal()} size="sm">+ Add</Button>
                </div>
            </div>
            <div className="space-y-2 h-96 overflow-y-auto">
                {restaurants.map((restaurant) => (
                    <DraggableRestaurantItem 
                        key={restaurant._id}
                        restaurant={restaurant}
                        onEdit={openAddEditRestaurantModal}
                        onDelete={handleDeleteRestaurant}
                        isEditing={isEditing}
                    />
                ))}
            </div>
        </Card>
    );
};

export default RestaurantLibrary;
