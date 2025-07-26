// /frontend/src/theme/theme.js

// This file establishes the design system for the entire application,
// ensuring brand consistency across all components.

export const theme = {
  colors: {
    primaryBrand: '#008080',      // Teal
    secondaryBrand: '#5DBB63',    // Green
    accentAction: '#FFCBA4',      // Peach
    neutralBackground: '#F8F9FA',// Light Gray
    neutralSurface: '#FFFFFF',     // White
    textPrimary: '#2F4F4F',       // Dark Slate Gray
    textSecondary: '#6C757D',     // Gray
    semanticError: '#DC3545',     // Red
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontSize: '2.5rem', // 40px
      fontWeight: '700',
    },
    h2: {
      fontSize: '2rem', // 32px
      fontWeight: '700',
    },
    h3: {
      fontSize: '1.75rem', // 28px
      fontWeight: '600',
    },
    h4: {
      fontSize: '1.5rem', // 24px
      fontWeight: '600',
    },
    body: {
      fontSize: '1rem', // 16px
      fontWeight: '400',
    },
    caption: {
      fontSize: '0.875rem', // 14px
      fontWeight: '400',
    },
  },
  spacing: {
    // 8pt grid system
    unit: 8,
    xs: '4px',  // 0.5 units
    sm: '8px',  // 1 unit
    md: '16px', // 2 units
    lg: '24px', // 3 units
    xl: '32px', // 4 units
    xxl: '40px',// 5 units
  },
  shadows: {
    medium: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  borderRadius: {
    medium: '16px',
  }
};
