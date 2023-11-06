import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { ITINERARY_ITEM, ITINERARY_LINES } from 'configuration-form/itinerary';
import PdfConfig from 'pdf/config';

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
		dot: {
			width: 2,
			height: 2,
			backgroundColor: '#AAA',
			borderRadius: '50%',
		},
		dottedLine: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			gap: 18,
		},
		gridLine: {
			fontSize: 12,
			fontWeight: 'bold',
			height: 18,
			minHeight: 18,
			padding: '2 0 0 5',
		},
	} );

	renderItineraryItem = ( { type, value }, index ) => {
		switch ( type ) {
			case ITINERARY_ITEM:
				return this.props.config.useDotGrid ? this.renderGridItem( value, index )
					: this.renderItem( value, index );

			case ITINERARY_LINES:
			default:
				return this.props.config.useDotGrid ? this.renderGridLines( value )
					: this.renderLines( value );
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

	renderDots( count ) {
		const dots = [];
		for ( let i = 0; i < count; i++ ) {
			dots.push( <View key={ i } style={ this.styles.dot }></View> );
		}

		return dots;
	}

	renderDottedLine() {
		return (
			<View style={ this.styles.dottedLine }>
				{this.renderDots( 21 )}
			</View>
		);
	}

	renderGridItem( text, index ) {
		return (
			<>
				<Text key={ index } style={ this.styles.gridLine }>
					{text}
				</Text>
				{this.renderDottedLine()}
			</>
		);
	}

	renderGridLine() {
		return (
			<>
				<Text style={ this.styles.gridLine }></Text>
				{this.renderDottedLine()}
			</>
		);
	}

	renderGridLines( count ) {
		const lines = [];
		for ( let i = 0; i < count; i++ ) {
			lines.push( this.renderGridLine() );
		}

		return lines;
	}

	render() {
		return <>{this.props.items.map( this.renderItineraryItem )}</>;
	}
}

Itinerary.propTypes = {
	items: PropTypes.array.isRequired,
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
};

export default Itinerary;
