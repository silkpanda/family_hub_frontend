import React, { useContext, useEffect, useState } from 'react';
// Import contexts to access global state and functions for meals and shopping lists.
import { MealContext } from '../../context/MealContext';
import { ListContext } from '../../context/ListContext';
// Import shared components and theme for styling.
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';
import InputField from '../shared/InputField';

/**
 * A modal component for creating a new recipe or viewing/editing an existing one.
 * @param {object} recipe - The recipe object to display/edit. Null when creating.
 * @param {function} onClose - The function to call to close the modal.
 * @param {boolean} isCreating - A flag that's true if the modal is for creating a new recipe.
 */
const RecipeModal = ({ recipe, onClose, isCreating = false }) => {
  // Destructure functions and state from contexts.
  const { createRecipe, addIngredientsToList } = useContext(MealContext);
  const { lists } = useContext(ListContext);
  
  // State to manage the form's input fields.
  const [formData, setFormData] = useState({ name: '', description: '', ingredients: '', instructions: '' });
  // State to track the currently selected shopping list from the dropdown.
  const [selectedList, setSelectedList] = useState('');

  // This effect hook handles side effects when the component mounts or its dependencies change.
  useEffect(() => {
    // If a recipe is passed in and we are NOT in "create" mode, populate the form with its data.
    if (recipe && !isCreating) {
      setFormData({
        name: recipe.name,
        description: recipe.description || '', // Use empty string as a fallback for description.
        ingredients: recipe.ingredients.join('\n'), // Join the ingredients array into a single string for the textarea.
        instructions: recipe.instructions,
      });
    }

    // When the `lists` array is loaded from context, set the default selected list to the first one.
    // The optional chain (`?.`) prevents an error if `lists` is undefined on the initial render.
    if (lists?.length > 0) {
      setSelectedList(lists[0]._id);
    }
  }, [recipe, isCreating, lists]); // Dependencies: The effect re-runs if any of these values change.

  // A generic handler to update the formData state when any input field changes.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handles the save action for creating a new recipe.
  const handleSave = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior.
    const recipeData = {
      ...formData,
      // Convert the ingredients string back into an array, filtering out any empty lines.
      ingredients: formData.ingredients.split('\n').filter(ing => ing.trim() !== ''),
    };
    if (isCreating) {
      createRecipe(recipeData); // Call the context function to create the recipe.
    }
    onClose(); // Close the modal after saving.
  };

  // Adds the ingredients of the current recipe to the selected shopping list.
  const handleAddIngredients = () => {
    if (recipe && selectedList) {
        addIngredientsToList(recipe._id, selectedList);
        alert(`Ingredients for ${recipe.name} added to your list!`); // User feedback.
    }
  };

  const modalOverlayStyle = { /* ... styles ... */ };

  return (
    <div style={modalOverlayStyle}>
      <Card style={{ width: '100%', maxWidth: '600px' }}>
        {/* The modal title changes depending on whether we are creating or editing. */}
        <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.lg }}>{isCreating ? 'Create New Recipe' : formData.name}</h2>
        
        {/* The form for recipe details. */}
        <form onSubmit={handleSave} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <InputField label="Recipe Name" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Description" name="description" value={formData.description} onChange={handleChange} />
            <InputField label="Ingredients (one per line)" name="ingredients" as="textarea" value={formData.ingredients} onChange={handleChange} required style={{ height: '120px' }}/>
            <InputField label="Instructions" name="instructions" as="textarea" value={formData.instructions} onChange={handleChange} required style={{ height: '160px' }}/>
        </form>

        {/* This bottom section contains action buttons. */}
        <div style={{ marginTop: theme.spacing.lg, paddingTop: theme.spacing.md, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {/* This block is only rendered when viewing an existing recipe. */}
            {!isCreating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                {/* Dropdown to select a shopping list. */}
                <select value={selectedList} onChange={e => setSelectedList(e.target.value)} style={{ padding: theme.spacing.sm, borderRadius: theme.spacing.sm }}>
                    {/* Safely map over the lists array to create dropdown options. */}
                    {lists?.map(list => <option key={list._id} value={list._id}>{list.name}</option>)}
                </select>
                <Button type="button" variant="secondary" onClick={handleAddIngredients}>Add to List</Button>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            <Button type="button" variant="tertiary" onClick={onClose}>Cancel</Button>
            {/* The "Save" button only appears when creating a new recipe. */}
            {isCreating && <Button type="button" onClick={handleSave} variant="primary">Save Recipe</Button>}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RecipeModal;