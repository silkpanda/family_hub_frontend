// ===================================================================================
// File: /src/components/shared/Button.js
// Purpose: A reusable, theme-aware Button component. It supports different visual
// variants (primary, secondary, etc.), a disabled state, and custom onClick handlers.
// This ensures all buttons across the app have a consistent look and feel.
// ===================================================================================
import React from 'react';
import { theme } from '../../theme/theme';

/**
 * A standardized, reusable button component.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The content inside the button (e.g., text, icon).
 * @param {'primary' | 'secondary' | 'tertiary' | 'danger'} [props.variant='primary'] - The visual style of the button.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {function} props.onClick - The function to call when the button is clicked.
 * @param {object} [props.style] - Optional additional inline styles to apply.
 */
const Button = ({ children, variant = 'primary', disabled = false, onClick, style, ...props }) => {
  // Base styles are applied to all button variants.
  const baseStyle = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.spacing.sm,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out',
    ...style, // Allow for custom style overrides.
  };

  // Variant-specific styles are merged with the base style.
  const variantStyles = {
    primary: { backgroundColor: theme.colors.accentAction, color: theme.colors.textPrimary },
    secondary: { backgroundColor: theme.colors.primaryBrand, color: theme.colors.neutralSurface },
    tertiary: { backgroundColor: 'transparent', color: theme.colors.textPrimary },
    danger: { backgroundColor: theme.colors.semanticError, color: theme.colors.neutralSurface },
  };

  // Style applied when the button is disabled.
  const disabledStyle = { 
    opacity: 0.5, 
    cursor: 'not-allowed' 
  };

  // Combine all styles based on props.
  const finalStyle = { 
    ...baseStyle, 
    ...variantStyles[variant], 
    ...(disabled ? disabledStyle : {}) 
  };

  return <button style={finalStyle} onClick={onClick} disabled={disabled} {...props}>{children}</button>;
};

export default Button;