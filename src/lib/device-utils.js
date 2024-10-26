export const REMARKABLE = 'ReMarkable 1 & 2';
const REMARKABLE_PAPER_PRO = 'ReMarkable Paper Pro';
export const CUSTOM = 'Custom';

export const AVAILABLE_DEVICES = [ REMARKABLE, REMARKABLE_PAPER_PRO, CUSTOM ];

export function getPageProperties( device ) {
	switch ( device ) {
		case REMARKABLE_PAPER_PRO:
			return {
				dpi: 229,
				pageSize: [ 1620, 2160 ],
			};

		default:
		case REMARKABLE:
			return {
				dpi: 226,
				pageSize: [ 1404, 1872 ],
			};
	}
}
