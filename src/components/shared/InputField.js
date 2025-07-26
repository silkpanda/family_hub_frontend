import React, { useState } from 'react';
import { theme } from '../../theme/theme';

const InputField = ({ label, value, onChange, type = 'text', ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: theme.spacing.md,
    };

    const labelStyle = {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.caption.fontSize,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    };

    const inputStyle = {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.body.fontSize,
        padding: theme.spacing.sm,
        border: `2px solid ${isFocused ? theme.colors.accentAction : '#ccc'}`,
        borderRadius: theme.spacing.sm,
        outline: 'none',
        transition: 'border-color 0.2s ease-in-out',
    };

    return (
        <div style={containerStyle}>
            {label && <label style={labelStyle}>{label}</label>}
            <input
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
