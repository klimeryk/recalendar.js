import { StyleSheet, Text } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import { ITINERARY_ITEM, ITINERARY_LINES } from 'configuration-form/itinerary';
import { DateContext } from 'pdf/lib/DateContext';

// See: https://regex101.com/r/FZ5T35/1
const DATE_TEMPLATE_REGEX = /{{date(?::([^}]*?))?}}/g;
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD';

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
				return this.renderLines( value );
		}
	};

	renderItem( text, index ) {
		const dateTemplateMatches = text.match( DATE_TEMPLATE_REGEX );
		if ( dateTemplateMatches && dateTemplateMatches.length > 0 ) {
			return (
				<DateContext.Consumer>{date => (
					<Text key={ index } style={ this.styles.line }>
						{text.replaceAll( DATE_TEMPLATE_REGEX, ( match, format ) => {
							return date.format( format || DEFAULT_DATE_FORMAT );
						} )}
					</Text>
				)}</DateContext.Consumer>
			);
		}

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

	render() {
		return <>{this.props.items.map( this.renderItineraryItem )}</>;
	}
}

Itinerary.propTypes = {
	items: PropTypes.array.isRequired,
};

export default Itinerary;
