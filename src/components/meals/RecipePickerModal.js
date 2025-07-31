// ===================================================================================
// File: /src/components/meals/RecipePickerModal.js
// Purpose: A simple modal that allows a user to pick a recipe from a list. This is
// used as an alternative to drag-and-drop for adding recipes to the meal plan,
// especially for better mobile/touch-screen usability.
// ===================================================================================
import React, { useContext } from 'react';
import { MealContext } from '../../context/MealContext';
import { theme } from '../../theme/theme';
import Card from '../shared/Card';
import Button from '../shared/Button';

/**
 * A modal to select a recipe from a list.
 * @param {object} props - Component props.
 * @param {function} props.onSelect - Function to call with the selected recipe's ID.
 * @param {function} props.onClose - Function to call to close the modal.
 */
const RecipePickerModal = ({ onSelect, onClose }) => {
    const { state } = useContext(MealContext);
    const { recipes } = state;

    const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
    
    const recipeItemStyle = { 
        padding: theme.spacing.md, 
        borderBottom: '1px solid #eee', 
        cursor: 'pointer', 
        transition: 'background-color 0.2s ease' 
    };

    if (!recipes) { return <div>Loading recipes...</div>; }

    return (
        <div style={modalOverlayStyle}>
            <Card style={{ width: '100%', maxWidth: '500px' }}>
                <h2 style={{ ...theme.typography.h3, marginBottom: theme.spacing.md }}>Select a Recipe</h2>
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    {recipes.map(recipe => (
                        <div 
                            key={recipe._id} 
                            style={recipeItemStyle} 
                            onClick={() => onSelect(recipe._id)}
                            // Add a hover effect for better user experience.
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.neutralBackground}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <p style={{ ...theme.typography.body, fontWeight: '600' }}>{recipe.name}</p>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: theme.spacing.md }}>
                    <Button variant="tertiary" onClick={onClose}>Cancel</Button>
                </div>
            </Card>
        </div>
    );
};

export default RecipePickerModal;