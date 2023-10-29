import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { ITINERARY_ITEM, ITINERARY_LINES } from 'configuration-form/itinerary';

class Itinerary extends React.PureComponent {
	styles = StyleSheet.create( {
		row: {
			flexDirection: 'row',
			marginBottom: 5,
			height: 20,
			minHeight: 20,
			gap: 4,
		},
		checkbox: {
			width: 16,
			height: 16,
			border: '1 solid #AAA',
			marginTop: 4,
			marginLeft: 5,
		},
		line: {
			borderBottom: '1 solid #AAA',
			fontSize: 12,
			fontWeight: 'bold',
			padding: '2 0 0 5',
			flexGrow: 1,
		},
	} );

	renderItineraryItem = ( { type, value }, index ) => {
		switch ( type ) {
			case ITINERARY_ITEM:
				return this.renderItem( value, index );

			case ITINERARY_LINES:
			default:
				return this.renderLines( value );
		}
	};

	renderItem( text, index ) {
		return (
			<View key={ index } style={ this.styles.row }>
				{ this.props.checkbox && <View style={ this.styles.checkbox }></View> }

				<Text style={ this.styles.line }>
					{text}
				</Text>
			</View>
		);
	}

	renderLines( count ) {
		const lines = [];
		for ( let i = 0; i < count; i++ ) {
			lines.push(
				<View key={ i } style={ this.styles.row }>
					{ this.props.checkbox && <View style={ this.styles.checkbox }></View> }
					<Text style={ this.styles.line }></Text>
				</View>,
			);
		}

		return lines;
	}

	render() {
		return <>{this.props.items.map( this.renderItineraryItem )}</>;
	}
}

Itinerary.propTypes = {
	items: PropTypes.array.isRequired,
	checkbox: PropTypes.bool,
};

export default Itinerary;
