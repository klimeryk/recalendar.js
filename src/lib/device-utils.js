export const REMARKABLE = 'ReMarkable 1 & 2';
export const REMARKABLE_PAPER_PRO = 'ReMarkable Paper Pro';
export const REMARKABLE_PAPER_PRO_MOVE = 'ReMarkable Paper Pro Move';
const SUPERNOTE_A5_X = 'Supernote A5 X';
const SUPERNOTE_NOMAD = 'Supernote Nomad';
const SUPERNOTE_MANTA = 'Supernote Manta';
export const CUSTOM = 'Custom';

export const DEFAULT_SIDEBAR_OFFSET = 30;
const REMARKABLE_SIDEBAR_OFFSET = 31;

export const AVAILABLE_DEVICES = [
	REMARKABLE,
	REMARKABLE_PAPER_PRO,
	REMARKABLE_PAPER_PRO_MOVE,
	SUPERNOTE_A5_X,
	SUPERNOTE_NOMAD,
	SUPERNOTE_MANTA,
	CUSTOM,
];

export function getPageProperties( device ) {
	switch ( device ) {
		case REMARKABLE_PAPER_PRO:
			return {
				dpi: 229,
				pageSize: [ 1620, 2160 ],
			};

		case REMARKABLE_PAPER_PRO_MOVE:
			return {
				dpi: 229,
				pageSize: [ 1696, 954 ],
			};

		case SUPERNOTE_NOMAD:
			return {
				dpi: 226,
				pageSize: [ 1404, 1872 ],
			};

		case SUPERNOTE_MANTA:
			return {
				dpi: 300,
				pageSize: [ 1920, 2560 ],
			};

		case SUPERNOTE_A5_X:
		case REMARKABLE:
		default:
			return {
				dpi: 226,
				pageSize: [ 1404, 1872 ],
			};
	}
}

export function getSidebarOffset( device ) {
	switch ( device ) {
		case REMARKABLE:
		case REMARKABLE_PAPER_PRO:
		case REMARKABLE_PAPER_PRO_MOVE:
			return REMARKABLE_SIDEBAR_OFFSET;

		default:
			return DEFAULT_SIDEBAR_OFFSET;
	}
}
