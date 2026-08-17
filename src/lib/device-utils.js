export const REMARKABLE = 'ReMarkable 1 & 2';
const REMARKABLE_PAPER_PRO = 'ReMarkable Paper Pro';
const REMARKABLE_PAPER_PRO_MOVE = 'ReMarkable Paper Pro Move';
const SUPERNOTE_A5_X = 'Supernote A5 X';
const SUPERNOTE_NOMAD = 'Supernote Nomad';
const SUPERNOTE_MANTA = 'Supernote Manta';
export const CUSTOM = 'Custom';

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
