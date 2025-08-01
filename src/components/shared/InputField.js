// ===================================================================================
// File: /frontend/src/components/shared/InputField.js
// Purpose: A reusable, theme-aware InputField component for text, textareas, etc.
//
// --- Dev Notes (UI Modernization - Final Fix) ---
// - BUG FIX: The component's internal structure was causing alignment issues on pages.
// - SOLUTION:
//   - The default `marginBottom` has been REMOVED from the component's container.
//     Components should not dictate their own external margins.
//   - The `style` prop is now correctly applied to the main container `div`, allowing
//     pages like `ListsPage` to control its layout properties (e.g., `flexGrow`).
// - BUG FIX: When used as a textarea, the component was resizable, breaking layouts.
// - SOLUTION: The component now conditionally applies `resize: 'none'` and a
//   standard height directly to the style of the textarea element itself.
// ===================================================================================
import React, { useState } from 'react';
import { theme } from '../../theme/theme';

const InputField = ({ label, value, onChange, type = 'text', as = 'input', style, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    
    const containerStyle = { 
        display: 'flex', 
        flexDirection: 'column', 
        ...style 
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
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        border: `1px solid ${isFocused ? theme.colors.primaryBrand : '#EAECEE'}`,
        borderRadius: theme.borderRadius.medium,
        outline: 'none',
        transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        backgroundColor: theme.colors.neutralBackground,
        boxShadow: isFocused ? `0 0 0 3px rgba(74, 144, 226, 0.3)` : 'none',
        boxSizing: 'border-box',
        width: '100%',
    };

    // --- UPDATED: Conditionally apply textarea-specific styles ---
    if (as === 'textarea') {
        inputStyle.height = '120px';
        inputStyle.resize = 'none';
        inputStyle.padding = theme.spacing.md; // Use more padding for textareas
    } else {
        inputStyle.height = '44px';
    }

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
