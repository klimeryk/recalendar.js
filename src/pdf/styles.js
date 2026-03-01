export function pageStyle( { sidebarPosition } ) {
	return {
		flex: 1,
		width: '100%',
		height: '100%',
		flexGrow: 1,
		flexDirection: 'column',
		paddingLeft: sidebarPosition === 'left' ? 31 : 0,
		paddingRight: sidebarPosition === 'right' ? 31 : 0,
		paddingTop: sidebarPosition === 'top' ? 31 : 0,
		paddingBottom: sidebarPosition === 'bottom' ? 31 : 0,
	};
}

export const content = {
	flex: 1,
	flexGrow: 1,
	borderTop: '1 solid black',
	overflow: 'hidden',
};
