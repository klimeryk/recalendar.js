import { StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';

import { getPrefix } from '~/lib/itinerary-prefixes';
import { ITINERARY_ITEM, ITINERARY_LINES } from '~/lib/itinerary-utils';
import PrefixIcon from '~/pdf/components/prefix-icon';
import { DEFAULT_LINE_HEIGHT_PIXELS } from '~/pdf/config';

const PREFIX_COLOR = '#333';

// See: https://regex101.com/r/FZ5T35/1
const DATE_TEMPLATE_REGEX = /{{date(?::([^}]*?))?}}/g;
const DEFAULT_DATE_FORMAT = 'L';

function applyDateTemplates( text, date ) {
	return text.replaceAll( DATE_TEMPLATE_REGEX, ( match, format ) =>
		date.format( format || DEFAULT_DATE_FORMAT ),
	);
}

class Itinerary extends React.PureComponent {
	scale = this.props.lineHeightPixels / DEFAULT_LINE_HEIGHT_PIXELS;
	prefixSize = 10 * this.scale;

	styles = StyleSheet.create( {
		line: {
			borderBottom: `1 ${this.props.lineStyle} #AAA`,
			flexDirection: 'row',
			height: this.props.lineHeightPixels,
			minHeight: this.props.lineHeightPixels,
			padding: `${2 * this.scale} 0 0 5`,
		},
		prefix: {
			marginRight: 4,
			marginTop: 3 * this.scale,
		},
		text: {
			flex: 1,
			fontSize: 12 * this.scale,
			fontWeight: 'bold',
		},
	} );

	renderItineraryItem = ( item, index ) => {
		const { type, value } = item;
		const prefix = getPrefix( item );

		switch ( type ) {
			case ITINERARY_ITEM:
				return this.renderLine( value, prefix, index );

			case ITINERARY_LINES:
			default:
				return this.renderLines( value, prefix, index );
		}
	};

	renderLine( text, prefix, key ) {
		return (
			<View key={ key } style={ this.styles.line } wrap={ false }>
				<PrefixIcon
					prefix={ prefix }
					size={ this.prefixSize }
					color={ PREFIX_COLOR }
					style={ this.styles.prefix }
				/>
				<Text style={ this.styles.text }>
					{applyDateTemplates( text, this.props.date )}
				</Text>
			</View>
		);
	}

	renderLines( count, prefix, index ) {
		const lines = [];
		for ( let i = 0; i < count; i++ ) {
			lines.push( this.renderLine( '', prefix, `${index}-${i}` ) );
		}

		return lines;
	}

	render() {
		return <>{this.props.items.map( this.renderItineraryItem )}</>;
	}
}

Itinerary.propTypes = {
	date: PropTypes.instanceOf( dayjs ).isRequired,
	items: PropTypes.array.isRequired,
	lineHeightPixels: PropTypes.number.isRequired,
	lineStyle: PropTypes.string.isRequired,
};

export default Itinerary;
