// --- File: /frontend/src/components/shared/InputField.js ---
// A reusable, theme-aware input field component with focus styling.

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
        padding: `0 ${theme.spacing.md}`,
        border: `1px solid ${isFocused ? theme.colors.primaryBrand : '#EAECEE'}`,
        borderRadius: theme.borderRadius.medium,
        outline: 'none',
        transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        backgroundColor: theme.colors.neutralBackground,
        boxShadow: isFocused ? `0 0 0 3px rgba(74, 144, 226, 0.3)` : 'none',
        boxSizing: 'border-box',
        height: '44px',
        width: '100%',
    };

    if (as === 'textarea') {
        inputStyle.height = '120px';
        inputStyle.resize = 'none';
        inputStyle.padding = theme.spacing.md;
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