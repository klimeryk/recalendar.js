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
			return this.renderDotGrid( count, this.props.config );
		}
		const lines = [];
		for ( let i = 0; i < count; i++ ) {
			lines.push( <Text key={ i } style={ this.styles.line }></Text> );
		}

		return lines;
	}

	renderDotGrid( count, config ) {
		const DOT_SIZE = 1.5;
		const TARGET_PITCH = 14;
		const sidebarWidth = config && config.alwaysOnSidebar ? 31 : 0;
		const contentWidth = config ? config.pageSizePt[ 0 ] - sidebarWidth : 400;
		const dotCount = Math.round( ( contentWidth - DOT_SIZE ) / TARGET_PITCH ) + 1;
		const rowHeight = ( contentWidth - DOT_SIZE ) / ( dotCount - 1 );
		const dotStyle = { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: '#AAA' };
		const rowStyle = { flexDirection: 'row', justifyContent: 'space-between', height: rowHeight, alignItems: 'center' };
		const rows = [];
		for ( let i = 0; i < count; i++ ) {
			rows.push(
				<View key={ i } style={ rowStyle }>
					{Array.from( { length: dotCount }, ( _, j ) => <View key={ j } style={ dotStyle } />)}
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
	config: PropTypes.instanceOf( PdfConfig ),
	items: PropTypes.array.isRequired,
};

export default Itinerary;
