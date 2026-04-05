// Static layout-only styles — no color values.
// All color/theme styles are applied inline in Button.tsx via useTheme().

import { ViewStyle } from 'react-native';

export const staticStyles: Record<string, ViewStyle> = {
  base: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.48,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 6,
  },
  outlineBorder: {
    borderWidth: 1.5,
  },
};
