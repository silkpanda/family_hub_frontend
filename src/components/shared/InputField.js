// ===================================================================================
// File: /src/components/shared/InputField.js
// Purpose: A reusable and styled input field component. It supports standard text
// inputs as well as other types like 'textarea'. It includes a label and visual
// feedback for the focused state.
// ===================================================================================
import React, { useState } from 'react';
import { theme } from '../../theme/theme';

/**
 * A standardized, reusable input field component with a label.
 * @param {object} props - Component props.
 * @param {string} props.label - The text label displayed above the input.
 * @param {string} props.value - The current value of the input.
 * @param {function} props.onChange - The function to call when the input value changes.
 * @param {string} [props.type='text'] - The type of the input (e.g., 'text', 'password', 'datetime-local').
 * @param {'input' | 'textarea'} [props.as='input'] - The underlying HTML element to render.
 */
const InputField = ({ label, value, onChange, type = 'text', as = 'input', ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    const containerStyle = { 
      display: 'flex', 
      flexDirection: 'column', 
      marginBottom: theme.spacing.md 
    };

    const labelStyle = { 
      fontFamily: theme.typography.fontFamily, 
      fontSize: theme.typography.caption.fontSize, 
      color: theme.colors.textSecondary, 
      marginBottom: theme.spacing.sm 
    };

    const inputStyle = {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.body.fontSize,
        padding: theme.spacing.sm,
        // The border color changes when the input is focused.
        border: `2px solid ${isFocused ? theme.colors.accentAction : '#ccc'}`,
        borderRadius: theme.spacing.sm,
        outline: 'none', // Remove default browser outline.
        transition: 'border-color 0.2s ease-in-out',
    };

    // Allows the component to render as either an <input> or <textarea>.
    const InputComponent = as;

    return (
        <div style={containerStyle}>
            {label && <label style={labelStyle}>{label}</label>}
            <InputComponent 
                style={inputStyle} 
                type={type} 
                value={value} 
                onChange={onChange} 
                onFocus={() => setIsFocused(true)} 
                onBlur={() => setIsFocused(false)} 
                {...props} 
            />
        </div>
    );
};

export default InputField;
