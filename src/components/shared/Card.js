// ===================================================================================
// File: /src/components/shared/Card.js
// Purpose: A reusable Card component that provides a consistent container for content.
// It uses styles from the central theme for background, border radius, padding, and shadow.
// `React.forwardRef` is used to allow parent components to get a ref to the underlying div.
// ===================================================================================
import React from 'react';
import { theme } from '../../theme/theme';

/**
 * A styled container component for displaying content on a "card".
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The content to be displayed inside the card.
 * @param {object} [props.style] - Optional additional inline styles.
 * @param {React.Ref} ref - Forwarded ref to the underlying div element.
 */
const Card = React.forwardRef(({ children, style, ...props }, ref) => {
  const cardStyle = {
    backgroundColor: theme.colors.neutralSurface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.lg,
    boxShadow: theme.shadows.medium,
    ...style, // Allow for style overrides.
  };

  return <div ref={ref} style={cardStyle} {...props}>{children}</div>;
});

export default Card;