import { SIDEBAR_BOTTOM, SIDEBAR_LEFT, SIDEBAR_RIGHT, SIDEBAR_TOP } from '~/lib/sidebar-utils';

export function pageStyle({ sidebarPosition, sidebarOffset }) {
  return {
    flex: 1,
    width: '100%',
    height: '100%',
    flexGrow: 1,
    flexDirection: 'column',
    paddingLeft: sidebarPosition === SIDEBAR_LEFT ? sidebarOffset : 0,
    paddingRight: sidebarPosition === SIDEBAR_RIGHT ? sidebarOffset : 0,
    paddingTop: sidebarPosition === SIDEBAR_TOP ? sidebarOffset : 0,
    paddingBottom: sidebarPosition === SIDEBAR_BOTTOM ? sidebarOffset : 0,
  };
}

export const content = {
  flex: 1,
  flexGrow: 1,
  borderTop: '1 solid black',
};
