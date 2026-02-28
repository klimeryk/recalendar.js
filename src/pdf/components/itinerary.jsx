import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { ITINERARY_ITEM, ITINERARY_LINES } from '~/lib/itinerary-utils';

class Itinerary extends React.PureComponent {
	styles = StyleSheet.create( {
		line: {
			borderBottom: '1 solid #AAA',
			fontSize: 12,
			fontWeight: 'bold',
			height: 20,
			minHeight: 20,
			padding: '2 0 0 5',
		},
	} );

	renderItineraryItem = ( { type, value, dotGrid }, index ) => {
		switch ( type ) {
			case ITINERARY_ITEM:
				return this.renderItem( value, index );

			case ITINERARY_LINES:
			default:
				return this.renderLines( value, dotGrid );
		}
	};

	renderItem( text, index ) {
		return (
			<Text key={ index } style={ this.styles.line }>
				{text}
			</Text>
		);
	}

	renderLines( count, dotGrid ) {
		if ( dotGrid ) {
			return this.renderDotGrid( count );
		}
		const lines = [];
		for ( let i = 0; i < count; i++ ) {
			lines.push( <Text key={ i } style={ this.styles.line }></Text> );
		}

		return lines;
	}

	renderDotGrid( count ) {
		const DOT_SIZE = 1.5;
		const DOT_COUNT = 30;
		const dotStyle = { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: '#AAA' };
		const rowStyle = { flexDirection: 'row', justifyContent: 'space-between', height: 20, alignItems: 'center' };
		const rows = [];
		for ( let i = 0; i < count; i++ ) {
			rows.push(
				<View key={ i } style={ rowStyle }>
					{Array.from( { length: DOT_COUNT }, ( _, j ) => <View key={ j } style={ dotStyle } />)}
				</View>,
			);
		}
		return rows;
	}

	render() {
		return <>{this.props.items.map( this.renderItineraryItem )}</>;
	}
}

Itinerary.propTypes = {
	items: PropTypes.array.isRequired,
};

export default Itinerary;
