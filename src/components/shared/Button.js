// /frontend/src/components/shared/Button.js
import React from 'react';
import { theme } from '../../theme/theme';

const Button = ({ children, variant = 'primary', disabled = false, onClick, style, ...props }) => {
  const baseStyle = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.spacing.sm,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out',
    ...style,
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.accentAction,
      color: theme.colors.textPrimary,
    },
    secondary: {
      backgroundColor: theme.colors.primaryBrand,
      color: theme.colors.neutralSurface,
    },
    tertiary: {
      backgroundColor: 'transparent',
      color: theme.colors.textPrimary,
    },
    // --- NEW ---
    danger: {
      backgroundColor: theme.colors.semanticError,
      color: theme.colors.neutralSurface,
    }
  };

  const disabledStyle = {
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  const finalStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    ...(disabled ? disabledStyle : {}),
  };

  return (
    <button style={finalStyle} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
