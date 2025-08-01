// ===================================================================================
// File: /frontend/src/components/shared/Card.js
// Purpose: A reusable, theme-aware Card component for wrapping content sections.
//
// --- Dev Notes (UI Modernization) ---
// - Styles have been updated to use the new, softer shadows and border radius
//   from the modernized theme.
// ===================================================================================
import React from 'react';
import { theme } from '../../theme/theme';

const Card = React.forwardRef(({ children, style, ...props }, ref) => {
  const cardStyle = {
    backgroundColor: theme.colors.neutralSurface,
    borderRadius: theme.borderRadius.large, // Softer corners
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.medium, // More subtle shadow
    ...style,
  };
  return <div ref={ref} style={cardStyle} {...props}>{children}</div>;
});
export default Card;
