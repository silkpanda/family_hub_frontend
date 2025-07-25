export const theme = {
  colors: {
    primaryBrand: '#008080',
    secondaryBrand: '#5DBB63',
    accentAction: '#FFCBA4',
    neutralBackground: '#F8F9FA',
    neutralSurface: '#FFFFFF',
    textPrimary: '#2F4F4F',
    textSecondary: '#6C757D',
    semanticError: '#DC3545',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontSize: '36px',
      fontWeight: '700',
      lineHeight: '44px',
    },
    h2: {
      fontSize: '28px',
      fontWeight: '700',
      lineHeight: '36px',
    },
    h3: {
      fontSize: '22px',
      fontWeight: '500',
      lineHeight: '28px',
    },
    h4: {
      fontSize: '18px',
      fontWeight: '500',
      lineHeight: '24px',
    },
    body: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '24px',
    },
    caption: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '20px',
    },
  },
  spacing: (factor) => `${factor * 8}px`, // 8pt grid system
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
};