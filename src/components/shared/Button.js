// ===================================================================================
// File: /frontend/src/components/shared/Button.js
// Purpose: A reusable, theme-aware Button component.
//
// --- Dev Notes (UI Modernization - Final Fix) ---
// - REVERTED: The explicit height has been removed, as the alignment issue is
//   handled by the parent container's flexbox properties.
// ===================================================================================
import React from 'react';
import { theme } from '../../theme/theme';

const Button = ({ children, variant = 'primary', disabled = false, onClick, style, ...props }) => {
  const baseStyle = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.medium,
    cursor: 'pointer',
    transition: 'filter 0.2s ease-in-out, opacity 0.2s ease-in-out',
    boxSizing: 'border-box',
    border: '1px solid transparent',
    ...style,
  };

  const variantStyles = {
    primary: { backgroundColor: theme.colors.accentAction, color: theme.colors.textPrimary, borderColor: theme.colors.accentAction },
    secondary: { backgroundColor: theme.colors.primaryBrand, color: theme.colors.neutralSurface, borderColor: theme.colors.primaryBrand },
    tertiary: { backgroundColor: 'transparent', color: theme.colors.textSecondary, borderColor: '#EAECEE' },
    danger: { backgroundColor: theme.colors.semanticError, color: theme.colors.neutralSurface, borderColor: theme.colors.semanticError },
  };
  
  const finalStyle = { ...baseStyle, ...variantStyles[variant] };

  const handleMouseEnter = e => { if (!disabled) e.currentTarget.style.filter = 'brightness(95%)'; };
  const handleMouseLeave = e => { if (!disabled) e.currentTarget.style.filter = 'brightness(100%)'; };

  if (disabled) {
      finalStyle.opacity = 0.6;
      finalStyle.cursor = 'not-allowed';
  }

  return (
    <button 
      style={finalStyle} 
      onClick={onClick} 
      disabled={disabled} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
