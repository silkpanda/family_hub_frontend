import React, { useContext, useEffect, useState } from 'react';
import { MealContext } from '../../context/MealContext';
import { ListContext } from '../../context/ListContext';

const RecipeModal = ({ recipe, onClose, isCreating = false }) => {
  const { createRecipe, addIngredientsToList } = useContext(MealContext);
  const { lists } = useContext(ListContext);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
  });
  const [selectedList, setSelectedList] = useState('');

  useEffect(() => {
    // If we are viewing an existing recipe, populate the form
    if (recipe && !isCreating) {
      setFormData({
        name: recipe.name,
        description: recipe.description || '',
        ingredients: recipe.ingredients.join('\n'),
        instructions: recipe.instructions,
      });
    }
    // Set the default shopping list for the "Add to List" feature
    if (lists.length > 0) {
      setSelectedList(lists[0]._id);
    }
  }, [recipe, isCreating, lists]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const recipeData = {
      ...formData,
      // Convert the ingredients textarea back into an array of strings
      ingredients: formData.ingredients.split('\n').filter(ing => ing.trim() !== ''),
    };

    if (isCreating) {
      createRecipe(recipeData);
    }
    // In a full app, you would add an else block here to handle updating a recipe
    onClose();
  };

  const handleAddIngredients = () => {
    if (recipe && selectedList) {
        addIngredientsToList(recipe._id, selectedList);
        alert(`Ingredients for ${recipe.name} added to your list!`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">{isCreating ? 'Create New Recipe' : `View: ${formData.name}`}</h2>
        <div className="max-h-[65vh] overflow-y-auto pr-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Recipe Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border p-2 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full border p-2 rounded-md"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ingredients (one per line)</label>
            <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows="6" required className="mt-1 block w-full border p-2 rounded-md"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Instructions</label>
            <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows="8" required className="mt-1 block w-full border p-2 rounded-md"></textarea>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <div>
            {!isCreating && (
              <div className="flex items-center">
                <select value={selectedList} onChange={e => setSelectedList(e.target.value)} className="border border-gray-300 rounded-md p-2">
                    {lists.map(list => <option key={list._id} value={list._id}>{list.name}</option>)}
                </select>
                <button type="button" onClick={handleAddIngredients} className="ml-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    Add to List
                </button>
              </div>
            )}
          </div>
          <div>
            <button type="button" onClick={onClose} className="mr-2 bg-gray-200 py-2 px-4 rounded-md hover:bg-gray-300">Cancel</button>
            {isCreating && <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">Save Recipe</button>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecipeModal;
