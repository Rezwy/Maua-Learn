export const Colors = {
  background: '#FFFFFF',
  groupedBackground: '#F2F2F7',
  label: '#000000',
  secondaryLabel: '#8E8E93',
  tertiaryLabel: '#C7C7CC',
  separator: '#E5E5EA',
  fill: '#F2F2F7',
  inverted: '#FFFFFF',
} as const;

export const Typography = {
  date: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.6,
    color: Colors.secondaryLabel,
  },
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as const,
    letterSpacing: 0.37,
    color: Colors.label,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
    letterSpacing: 0.35,
    color: Colors.label,
  },
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '400' as const,
    color: Colors.secondaryLabel,
  },
  badge: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.72,
    color: Colors.secondaryLabel,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
    color: Colors.secondaryLabel,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500' as const,
  },
};

export const Layout = {
  screenPadding: 20,
  cardRadius: 24,
  cardPadding: 20,
  buttonRadius: 14,
  maxContentWidth: 800,
} as const;
