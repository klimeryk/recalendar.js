export const LINED = 'lined';
export const GRID = 'grid';
export const DOT_GRID = 'dot_grid';
export const BLANK = 'blank';

export const LINE_STYLES = [ LINED, GRID, DOT_GRID, BLANK ];

export const DEFAULT_LINE_HEIGHT_PIXELS = 20;
export const DEFAULT_LINE_OPACITY = 33;
export const AUTOMATIC_SPACING = 0;

const DOT_MARK = 0.1;
const DOT_DIAMETER = 1.5;
const MIN_DOT_DIAMETER = 1;
const MAX_DOT_DIAMETER = 3;
const STROKE_WIDTH = 1;
const DOT_GRID_SLACK = 0.5;

function toPositiveNumber( value, fallback ) {
	const number = Number( value );
	return Number.isFinite( number ) && number > 0 ? number : fallback;
}

function toGray( lineOpacity ) {
	const opacity = Number.isFinite( Number( lineOpacity ) )
		? Math.min( Math.max( Number( lineOpacity ), 0 ), 100 )
		: DEFAULT_LINE_OPACITY;
	const channel = Math.round( 255 * ( 1 - opacity / 100 ) )
		.toString( 16 )
		.padStart( 2, '0' );
	return `#${ channel }${ channel }${ channel }`;
}

export function normalizeLineStyle( lineStyle ) {
	return LINE_STYLES.includes( lineStyle ) ? lineStyle : LINED;
}

export function getDotDiameter( lineHeightPixels ) {
	const scale =
		toPositiveNumber( lineHeightPixels, DEFAULT_LINE_HEIGHT_PIXELS ) /
		DEFAULT_LINE_HEIGHT_PIXELS;
	return Math.min(
		Math.max( DOT_DIAMETER * scale, MIN_DOT_DIAMETER ),
		MAX_DOT_DIAMETER,
	);
}

export function getLineSpacing( lineHeightPixels, lineSpacingPixels ) {
	return toPositiveNumber(
		lineSpacingPixels,
		toPositiveNumber( lineHeightPixels, DEFAULT_LINE_HEIGHT_PIXELS ),
	);
}

export function getLineStroke( {
	lineStyle,
	lineHeightPixels,
	lineSpacingPixels,
	lineOpacity,
} ) {
	const style = normalizeLineStyle( lineStyle );
	const opacity = Number.isFinite( Number( lineOpacity ) )
		? Number( lineOpacity )
		: DEFAULT_LINE_OPACITY;
	if ( style === BLANK || opacity <= 0 ) {
		return null;
	}

	const color = toGray( opacity );
	if ( style === LINED ) {
		return {
			color,
			height: STROKE_WIDTH,
			rule: { width: STROKE_WIDTH, y: STROKE_WIDTH / 2 },
		};
	}

	const spacing = getLineSpacing( lineHeightPixels, lineSpacingPixels );
	if ( style === GRID ) {
		const height = toPositiveNumber(
			lineHeightPixels,
			DEFAULT_LINE_HEIGHT_PIXELS,
		);
		return {
			color,
			height,
			rule: { width: STROKE_WIDTH, y: height - STROKE_WIDTH / 2 },
			marks: {
				width: height,
				y: height / 2,
				offset: spacing - STROKE_WIDTH / 2,
				spacing,
				dash: [ STROKE_WIDTH, Math.max( spacing - STROKE_WIDTH, 0 ) ],
				limit: STROKE_WIDTH,
			},
		};
	}

	const diameter = getDotDiameter( lineHeightPixels );
	const height = diameter + DOT_GRID_SLACK;
	return {
		color,
		height,
		marks: {
			width: diameter,
			y: height / 2,
			offset: spacing,
			spacing,
			dash: [ DOT_MARK, Math.max( spacing - DOT_MARK, 0 ) ],
			linecap: 'round',
			limit: diameter / 2,
		},
	};
}
