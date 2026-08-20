export const SIDEBAR_LEFT = 'left';
export const SIDEBAR_RIGHT = 'right';
export const SIDEBAR_TOP = 'top';
export const SIDEBAR_BOTTOM = 'bottom';

export const AVAILABLE_SIDEBAR_POSITIONS = [SIDEBAR_LEFT, SIDEBAR_RIGHT, SIDEBAR_TOP, SIDEBAR_BOTTOM];

export function isHorizontalSidebar(sidebarPosition) {
  return sidebarPosition === SIDEBAR_LEFT || sidebarPosition === SIDEBAR_RIGHT;
}

export function getHorizontalSidebarOffset({ sidebarPosition, sidebarOffset }) {
  return isHorizontalSidebar(sidebarPosition) ? sidebarOffset : 0;
}
