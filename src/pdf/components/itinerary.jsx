import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { ITINERARY_ITEM, ITINERARY_LINES } from '~/lib/itinerary-utils';
import PdfConfig from '~/pdf/config';

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

	renderItineraryItem = ( { type, value }, index ) => {
		switch ( type ) {
			case ITINERARY_ITEM:
				return this.renderItem( value, index );

			case ITINERARY_LINES:
			default:
				if ( this.props.config && this.props.config.dotGrid ) {
					return this.renderDotGrid( index );
				}
				return this.renderLines( value );
		}
	};

	renderItem( text, index ) {
		return (
			<Text key={ index } style={ this.styles.line }>
				{text}
			</Text>
		);
	}

	renderLines( count ) {
		const lines = [];
		for ( let i = 0; i < count; i++ ) {
			lines.push( <Text key={ i } style={ this.styles.line }></Text> );
		}

		return lines;
	}

	renderDotGrid( index ) {
		const { config } = this.props;
		const pitchPt = config.dotGridSize * 72 / 25.4;
		const DOT_SIZE = 2;
		const containerStyle = {
			flex: 1,
			flexDirection: 'row',
			flexWrap: 'wrap',
			alignContent: 'flex-start',
			opacity: config.dotGridOpacity / 100,
		};
		const cellStyle = { width: pitchPt, height: pitchPt, alignItems: 'center', justifyContent: 'center' };
		const dotStyle = { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: '#000' };
		return (
			<View key={ index } style={ containerStyle }>
				{Array.from( { length: 2000 }, ( _, i ) => (
					<View key={ i } style={ cellStyle }>
						<View style={ dotStyle } />
					</View>
				) )}
			</View>
		);
	}

	render() {
		return <>{this.props.items.map( this.renderItineraryItem )}</>;
	}
}

Itinerary.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ),
	items: PropTypes.array.isRequired,
};

export default Itinerary;
