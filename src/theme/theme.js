// ===================================================================================
// File: /frontend/src/theme/theme.js
// Purpose: Centralizes all design tokens for the app.
//
// --- Dev Notes (UI Modernization) ---
// - This file has been updated to reflect the "Approachable Modernism" design system.
// - Colors: The palette is now cleaner, with a neutral base and clear accent colors
//   for actions and branding.
// - Typography: Font sizes and weights have been refined for better hierarchy and legibility.
// - Spacing: The spacing scale is more consistent and generous to promote white space.
// - Shadows & Borders: Styles are softer and more subtle for a modern feel.
// ===================================================================================
export const theme = {
  colors: {
    primaryBrand: '#4A90E2',      // A friendly, modern blue
    secondaryBrand: '#50E3C2',    // A vibrant accent for secondary actions or highlights
    accentAction: '#F5A623',      // A warm, attention-grabbing color for primary buttons
    
    neutralBackground: '#F4F7F9', // Light gray for the main app background
    neutralSurface: '#FFFFFF',    // Clean white for cards and modals
    
    textPrimary: '#242A31',       // Dark slate for high-contrast text
    textSecondary: '#6A737D',     // Lighter gray for secondary text and captions
    
    semanticError: '#D0021B',     // A clear, strong red for errors
    semanticSuccess: '#7ED321',   // A bright green for success states
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h1: { fontSize: '2.25rem', fontWeight: '700', letterSpacing: '-0.02em' },
    h2: { fontSize: '1.75rem', fontWeight: '600', letterSpacing: '-0.015em' },
    h3: { fontSize: '1.25rem', fontWeight: '600' },
    h4: { fontSize: '1.125rem', fontWeight: '500' },
    body: { fontSize: '1rem', fontWeight: '400' },
    caption: { fontSize: '0.875rem', fontWeight: '400' },
  },
  spacing: {
    xs: '4px', 
    sm: '8px', 
    md: '16px', 
    lg: '24px', 
    xl: '32px', 
    xxl: '48px',
  },
  shadows: {
    subtle: '0px 2px 4px rgba(36, 42, 49, 0.05)',
    medium: '0px 4px 12px rgba(36, 42, 49, 0.1)',
  },
  borderRadius: {
    medium: '12px',
    large: '16px',
  }
};
