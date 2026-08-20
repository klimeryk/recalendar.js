export const ITINERARY_NO_PREFIX = '';

// Lucide icons (https://lucide.dev/icons, ISC licensed)
export const ITINERARY_PREFIX_ICONS = {
  square: [['rect', { width: 18, height: 18, x: 3, y: 3, rx: 2 }]],
  'square-check-big': [
    ['path', { d: 'M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344' }],
    ['path', { d: 'm9 11 3 3L22 4' }],
  ],
  circle: [['circle', { cx: 12, cy: 12, r: 10 }]],
  'circle-dot': [
    ['circle', { cx: 12, cy: 12, r: 10 }],
    ['circle', { cx: 12, cy: 12, r: 1 }],
  ],
  'arrow-right': [
    ['path', { d: 'M5 12h14' }],
    ['path', { d: 'm12 5 7 7-7 7' }],
  ],
  'chevron-right': [['path', { d: 'm9 18 6-6-6-6' }]],
  star: [
    [
      'path',
      {
        d: 'M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z',
      },
    ],
  ],
  heart: [
    [
      'path',
      {
        d: 'M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5',
      },
    ],
  ],
};

export const ITINERARY_PREFIX_ICON_ATTRIBUTES = {
  fill: 'none',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const ITINERARY_PREFIX_VIEW_BOX = '0 0 24 24';

export const ITINERARY_PREFIXES = [ITINERARY_NO_PREFIX, ...Object.keys(ITINERARY_PREFIX_ICONS)];

export function getPrefixIcon(prefix) {
  return ITINERARY_PREFIX_ICONS[prefix] || null;
}

export function normalizePrefix(prefix) {
  return getPrefixIcon(prefix) ? prefix : ITINERARY_NO_PREFIX;
}

export function getPrefix(item) {
  return normalizePrefix(item?.prefix);
}
