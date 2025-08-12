// --- File: /frontend/src/components/shared/Card.js ---
// A reusable, theme-aware card component for consistent container styling.

import React from 'react';
import { theme } from '../../theme/theme';

const Card = React.forwardRef(({ children, style, ...props }, ref) => {
  const cardStyle = {
    backgroundColor: theme.colors.neutralSurface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.medium,
    ...style,
  };
  return <div ref={ref} style={cardStyle} {...props}>{children}</div>;
});
export default Card;