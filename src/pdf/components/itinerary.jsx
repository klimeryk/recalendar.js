import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { getPrefix } from '~/lib/itinerary-prefixes';
import { ITINERARY_ITEM, ITINERARY_LINES } from '~/lib/itinerary-utils';
import PrefixIcon from '~/pdf/components/prefix-icon';

const PREFIX_COLOR = '#333';
const PREFIX_SIZE = 10;

class Itinerary extends React.PureComponent {
	styles = StyleSheet.create( {
		line: {
			borderBottom: `1 ${this.props.lineStyle} #AAA`,
			flexDirection: 'row',
			height: 20,
			minHeight: 20,
			padding: '2 0 0 5',
		},
		prefix: {
			marginRight: 4,
			marginTop: 3,
		},
		text: {
			flex: 1,
			fontSize: 12,
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
					size={ PREFIX_SIZE }
					color={ PREFIX_COLOR }
					style={ this.styles.prefix }
				/>
				<Text style={ this.styles.text }>{text}</Text>
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
	items: PropTypes.array.isRequired,
	lineStyle: PropTypes.string.isRequired,
};

export default Itinerary;
