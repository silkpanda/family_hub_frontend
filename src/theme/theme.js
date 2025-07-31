// ===================================================================================
// File: /src/theme/theme.js
// Purpose: Centralizes all design tokens (colors, fonts, spacing, etc.) for the app.
// This provides a single source of truth for styling, ensuring consistency and
// making it easy to update the visual design of the entire application from one place.
// ===================================================================================
export const theme = {
  colors: {
    primaryBrand: '#008080',      // Teal: for primary branding elements like logos
    secondaryBrand: '#5DBB63',    // Green: for secondary actions or highlights
    accentAction: '#FFCBA4',      // Peach: for primary buttons and interactive elements
    neutralBackground: '#F8F9FA', // Off-white: for page backgrounds
    neutralSurface: '#FFFFFF',    // White: for cards and modals
    textPrimary: '#2F4F4F',       // Dark Slate Gray: for main text
    textSecondary: '#6C757D',     // Gray: for secondary text, captions, and labels
    semanticError: '#DC3545',     // Red: for error messages and destructive actions
  },
  typography: {
    fontFamily: "'Inter', sans-serif", // Main font for the application
    h1: { fontSize: '2.5rem', fontWeight: '700' },
    h2: { fontSize: '2rem', fontWeight: '700' },
    h3: { fontSize: '1.75rem', fontWeight: '600' },
    h4: { fontSize: '1.5rem', fontWeight: '600' },
    body: { fontSize: '1rem', fontWeight: '400' },
    caption: { fontSize: '0.875rem', fontWeight: '400' },
  },
  spacing: {
    unit: 8, // Base unit for consistent spacing calculations
    xs: '4px', 
    sm: '8px', 
    md: '16px', 
    lg: '24px', 
    xl: '32px', 
    xxl: '40px',
  },
  shadows: {
    medium: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Standard shadow for cards
  },
  borderRadius: {
    medium: '16px', // Standard border radius for cards and larger elements
  }
};