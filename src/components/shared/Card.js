import React from 'react';
import { theme } from '../../theme/theme';

// --- CORRECTED ---
// The component is now wrapped in React.forwardRef.
// This allows it to receive a ref from a parent component (like DraggableRecipe)
// and "forward" it to the underlying DOM element (the div). This is essential
// for compatibility with libraries like dnd-kit.
const Card = React.forwardRef(({ children, style, ...props }, ref) => {
  const cardStyle = {
    backgroundColor: theme.colors.neutralSurface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.medium,
    ...style,
  };

  // The ref from the parent is now correctly attached to the div.
  return (
    <div ref={ref} style={cardStyle} {...props}>
      {children}
    </div>
  );
});

export default Card;
