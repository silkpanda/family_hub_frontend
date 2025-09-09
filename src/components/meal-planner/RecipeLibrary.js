import React, { useContext, useState } from 'react';
import { MealPlannerContext } from '../../context/MealPlannerContext';
import { ModalContext } from '../../context/ModalContext';
import { useDraggable } from '@dnd-kit/core';
import Card from '../ui/Card';
import Button from '../ui/Button';

// A new, separate component for each draggable recipe item.
const DraggableRecipeItem = ({ recipe, onEdit, onDelete, isEditing }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `recipe-${recipe._id}`,
        data: { item: recipe, type: 'recipe' },
        // Conditionally disable drag-and-drop when in editing mode
        disabled: isEditing,
    });

    return (
        <div
            ref={setNodeRef}
            // Use a transition for a smooth visual return
            style={{
                transform: isDragging ? 'scale(0.95)' : 'scale(1)',
                opacity: isDragging ? 0 : 1, // Completely hide the original item when dragging
                transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
            }}
            {...listeners}
            {...attributes}
            className="p-3 rounded-lg flex justify-between items-center bg-gray-100"
        >
            <span className="font-semibold text-gray-800">{recipe.name}</span>
            <div className="flex space-x-2">
                {/* Conditionally render buttons based on editing mode */}
                {isEditing && (
                    <>
                        <Button
                            onClick={() => onEdit(recipe)}
                            variant="link"
                            // This attribute tells dnd-kit to ignore clicks on this button
                            data-dnd-disabled-interactive-element
                        >
                            Edit
                        </Button>
                        <Button
                            onClick={() => onDelete(recipe._id)}
                            variant="dangerLink"
                            data-dnd-disabled-interactive-element
                        >
                            Del
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

const RecipeLibrary = () => {
    const { recipes, addRecipe, updateRecipe, deleteRecipe } = useContext(MealPlannerContext);
    const { showModal } = useContext(ModalContext);
    const [isEditing, setIsEditing] = useState(false);

    const handleToggleEdit = () => {
        setIsEditing(prev => !prev);
    };

    const handleSaveRecipe = (recipeData, recipeId) => {
        if (recipeId) {
            return updateRecipe(recipeId, recipeData);
        } else {
            return addRecipe(recipeData);
        }
    };

    const handleDeleteRecipe = (recipeId) => {
        showModal('confirmation', {
            title: 'Delete Recipe?',
            message: 'Are you sure you want to permanently delete this recipe?',
            onConfirm: () => deleteRecipe(recipeId)
        });
    };

    const openAddEditRecipeModal = (recipe = null) => {
        showModal('addEditRecipe', {
            recipeToEdit: recipe,
            onSave: handleSaveRecipe,
            onDelete: handleDeleteRecipe
        });
    };

    return (
        <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Recipe Book</h3>
                <div className="flex space-x-2">
                    <Button onClick={handleToggleEdit} size="sm" variant={isEditing ? 'outline' : 'default'}>
                        {isEditing ? 'Done' : 'Edit'}
                    </Button>
                    <Button onClick={() => openAddEditRecipeModal()} size="sm">
                        + Add
                    </Button>
                </div>
            </div>
            {/* The outer div is no longer a Droppable, just a container */}
            <div className="space-y-2 h-96 overflow-y-auto">
                {recipes.map((recipe) => (
                    <DraggableRecipeItem
                        key={recipe._id}
                        recipe={recipe}
                        onEdit={openAddEditRecipeModal}
                        onDelete={handleDeleteRecipe}
                        isEditing={isEditing}
                    />
                ))}
            </div>
        </Card>
    );
};

export default RecipeLibrary;
