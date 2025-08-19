export const colors = {
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#667eea',
    600: '#5b67d8',
    700: '#4c51bf',
    800: '#4338ca',
    900: '#3730a3',
  },

  secondary: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },

  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },

  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  background: {
    primary: '#f8fafc',
    secondary: '#f1f5f9',
    glass: 'rgba(255, 255, 255, 0.95)',
    glassLight: 'rgba(255, 255, 255, 0.8)',
    glassDark: 'rgba(0, 0, 0, 0.05)',
  },

  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    light: '#f1f5f9',
    muted: 'rgba(0, 0, 0, 0.4)',
    white: 'rgba(255, 255, 255, 0.8)',
  },

  border: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
    white: 'rgba(255, 255, 255, 0.2)',
  },

  shadow: {
    light: 'rgba(0, 0, 0, 0.08)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
    primary: 'rgba(102, 126, 234, 0.3)',
    focus: 'rgba(102, 126, 234, 0.1)',
  },

  status: {
    sending: '#3b82f6',
    sent: '#22c55e',
    read: '#16a34a',
    error: '#ef4444',
  },

  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glass:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
    disabled: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
  },
} as const;

export const cssVariables = {
  '--color-primary': colors.primary[500],
  '--color-primary-light': colors.primary[400],
  '--color-primary-dark': colors.primary[600],
  '--color-secondary': colors.secondary[500],
  '--color-success': colors.success[500],
  '--color-error': colors.error[500],
  '--color-warning': colors.warning[500],
  '--color-gray-50': colors.gray[50],
  '--color-gray-100': colors.gray[100],
  '--color-gray-200': colors.gray[200],
  '--color-gray-300': colors.gray[300],
  '--color-gray-400': colors.gray[400],
  '--color-gray-500': colors.gray[500],
  '--color-gray-600': colors.gray[600],
  '--color-gray-700': colors.gray[700],
  '--color-gray-800': colors.gray[800],
  '--color-gray-900': colors.gray[900],
  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--color-text-light': colors.text.light,
  '--color-background-primary': colors.background.primary,
  '--color-background-secondary': colors.background.secondary,
  '--color-background-glass': colors.background.glass,
  '--color-border-light': colors.border.light,
  '--color-shadow-light': colors.shadow.light,
  '--color-shadow-medium': colors.shadow.medium,
  '--color-shadow-primary': colors.shadow.primary,
  '--gradient-primary': colors.gradients.primary,
  '--gradient-secondary': colors.gradients.secondary,
  '--gradient-purple': colors.gradients.purple,
} as const;

export const getCssVar = (variable: keyof typeof cssVariables): string => {
  return `var(${variable})`;
};

export const withOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};
