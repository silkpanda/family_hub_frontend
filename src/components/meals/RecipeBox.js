import React, { useContext, useEffect, useState } from 'react';
import { MealContext } from '../../context/MealContext';
import { useDraggable } from '@dnd-kit/core';
import RecipeModal from './RecipeModal'; // Assuming this is in the same directory

// --- DraggableRecipe Component ---
// This new component wraps each recipe to make it draggable.
const DraggableRecipe = ({ recipe }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: recipe._id, // The unique ID for this draggable item is the recipe's ID
    });

    // This style applies the transform to move the item while dragging
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10, // Ensure the dragged item appears above others
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="border rounded-lg p-4 bg-white hover:shadow-lg cursor-grab transition-shadow">
            <h3 className="font-bold text-lg text-gray-800">{recipe.name}</h3>
            <p className="text-sm text-gray-500 truncate">{recipe.description || 'No description'}</p>
        </div>
    );
};


// --- Main RecipeBox Component ---
const RecipeBox = () => {
  const { recipes, fetchRecipes } = useContext(MealContext);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Recipe Box</h2>
        <button onClick={() => setIsCreateModalOpen(true)} className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
          + Add New Recipe
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Drag a recipe onto a day in the calendar to plan your meal.</p>
      
      {/* The list of recipes is now a list of DraggableRecipe components */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {recipes.map(recipe => (
          <DraggableRecipe key={recipe._id} recipe={recipe} />
        ))}
      </div>
      
      {/* The modals for viewing and creating recipes remain the same */}
      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
      {isCreateModalOpen && <RecipeModal isCreating={true} onClose={() => setIsCreateModalOpen(false)} />}
    </div>
  );
};

export default RecipeBox;
