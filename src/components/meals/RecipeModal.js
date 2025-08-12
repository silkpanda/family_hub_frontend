// --- File: /frontend/src/components/meals/RecipeModal.js ---
// A modal for creating, viewing, and editing recipes.

import React, { useEffect, useState } from 'react';
import { useMeals } from '../../context/MealContext';
import { useLists } from '../../context/ListContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';
import InputField from '../shared/InputField';

const RecipeModal = ({ recipe, onClose, isCreating = false }) => {
  const { actions: mealActions } = useMeals();
  const { createRecipe, updateRecipe, addIngredientsToList } = mealActions;
  const { state: listState } = useLists();
  const { lists } = listState;
  const [formData, setFormData] = useState({ name: '', description: '', ingredients: '', instructions: '' });
  const [selectedList, setSelectedList] = useState('');
  const [isEditing, setIsEditing] = useState(isCreating);

  useEffect(() => {
    if (recipe && !isCreating) {
      setFormData({ name: recipe.name, description: recipe.description || '', ingredients: recipe.ingredients.join('\n'), instructions: recipe.instructions });
    }
    if (lists && lists.length > 0) {
      setSelectedList(lists[0]._id);
    }
  }, [recipe, isCreating, lists]);

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSave = (e) => { 
      e.preventDefault(); 
      const recipeData = { ...formData, ingredients: formData.ingredients.split('\n').filter(ing => ing.trim() !== '') }; 
      if (isCreating) { 
          if(createRecipe) createRecipe(recipeData); 
      } else { 
          if(updateRecipe) updateRecipe(recipe._id, recipeData); 
      } 
      onClose(); 
  };
  const handleAddIngredients = () => { 
      if (recipe && selectedList && addIngredientsToList) { 
          addIngredientsToList(recipe._id, selectedList); 
          alert(`Ingredients for ${recipe.name} have been added to your list!`); 
      } 
  };
  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };

  return (
    <div style={modalOverlayStyle}>
      <Card style={{ width: '100%', maxWidth: '600px' }}>
        <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.lg }}>{isCreating ? 'Create New Recipe' : recipe.name}</h2>
        <form onSubmit={handleSave} style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: theme.spacing.sm }}>
            <InputField label="Recipe Name" name="name" value={formData.name} onChange={handleChange} required disabled={!isEditing} />
            <InputField label="Description" name="description" value={formData.description} onChange={handleChange} disabled={!isEditing} />
            <InputField label="Ingredients (one per line)" name="ingredients" as="textarea" value={formData.ingredients} onChange={handleChange} required disabled={!isEditing} />
            <InputField label="Instructions" name="instructions" as="textarea" value={formData.instructions} onChange={handleChange} required disabled={!isEditing} />
        </form>
        <div style={{ marginTop: theme.spacing.lg, paddingTop: theme.spacing.md, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {!isCreating && !isEditing && (<Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Recipe</Button>)}
            {!isCreating && (<div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginTop: isEditing ? 0 : theme.spacing.md }}>
                <select value={selectedList} onChange={e => setSelectedList(e.target.value)} style={{ padding: theme.spacing.sm, borderRadius: theme.borderRadius.medium, border: `1px solid #EAECEE`, height: '44px' }}>
                  {lists && lists.map(list => <option key={list._id} value={list._id}>{list.name}</option>)}
                </select>
                <Button type="button" variant="secondary" onClick={handleAddIngredients}>Add to List</Button>
              </div>)}
          </div>
          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            <Button type="button" variant="tertiary" onClick={onClose}>Cancel</Button>
            {isEditing && <Button type="button" onClick={handleSave} variant="primary">Save Changes</Button>}
          </div>
        </div>
      </Card>
    </div>
  );
};
export default RecipeModal;