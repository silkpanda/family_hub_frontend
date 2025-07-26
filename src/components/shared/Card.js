import React from 'react';
import { theme } from '../../theme/theme';

const Card = ({ children, style, ...props }) => {
  const cardStyle = {
    backgroundColor: theme.colors.neutralSurface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.medium,
    ...style,
  };

  return (
    <div style={cardStyle} {...props}>
      {children}
    </div>
  );
};

export default Card;