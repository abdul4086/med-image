import { theme } from '../styles/theme.ts';

export const useThemeClass = () => {
  const getBackgroundClass = () => `${theme.colors.background.light} ${theme.colors.background.dark}`;
  const getTextClass = () => `${theme.colors.text.light} ${theme.colors.text.dark}`;
  const getPrimaryClass = () => `${theme.colors.primary.light} ${theme.colors.primary.dark}`;
  const getSecondaryClass = () => `${theme.colors.secondary.light} ${theme.colors.secondary.dark}`;

  return {
    getBackgroundClass,
    getTextClass,
    getPrimaryClass,
    getSecondaryClass,
    ...theme.components
  };
}; 