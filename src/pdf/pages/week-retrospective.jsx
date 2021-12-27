import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import Itinerary from 'pdf/components/itinerary';
import MiniCalendar, { HIGHLIGHT_WEEK } from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';
import { weekRetrospectiveLink } from 'pdf/lib/links';
import { getItemsOnExtraPages } from 'pdf/utils';

class WeekRetrospectivePage extends React.Component {
	styles = StyleSheet.create( {
		page: {
			flex: 1,
			width: '100%',
			height: '100%',
			flexGrow: 1,
			flexDirection: 'column',
		},
		content: {
			flexGrow: 1,
			borderTop: '1 solid black',
		},
		header: {
			flexGrow: 0,
			flexDirection: 'row',
		},
		meta: {
			flexGrow: 1,
			flexDirection: 'column',
			borderRight: '1 solid black',
		},
		dateMain: {
			flexDirection: 'row',
			marginLeft: 'auto',
		},
		dateInfo: {
			flexDirection: 'row',
			paddingRight: 5,
		},
		line: {
			borderBottom: '1 solid #AAA',
			fontSize: 12,
			fontWeight: 'bold',
			height: 20,
			minHeight: 20,
			padding: '2 0 0 5',
		},
		nameOfWeek: {
			marginLeft: 'auto',
			textTransform: 'uppercase',
			fontSize: 20,
		},
		weekArrow: {
			color: '#AAA',
			textDecoration: 'none',
			justifyContent: 'center',
			padding: '10 5',
			fontSize: 20,
		},
		title: {
			textTransform: 'uppercase',
			textDecoration: 'none',
			justifyContent: 'center',
			textAlign: 'right',
			color: 'black',
			padding: '10 5',
			width: 200,
		},
		weekNumber: {
			fontSize: 55,
			fontWeight: 'bold',
			textAlign: 'center',
			width: 60,
		},
	} );

	getNameOfWeek() {
		const { date } = this.props;
		const beginningOfWeek = date.startOf( 'week' ).format( 'DD MMMM' );
		const endOfWeek = date.endOf( 'week' ).format( 'DD MMMM' );
		return `${beginningOfWeek} - ${endOfWeek}`;
	}

	renderLines() {
		const lines = [];
		for ( let i = 0; i < 50; i++ ) {
			lines.push( <Text key={ i } style={ this.styles.line }></Text> );
		}

		return lines;
	}

	render() {
		const { t, date, config } = this.props;
		return (
			<>
				<Page id={ weekRetrospectiveLink( date ) } size={ config.pageSize }>
					<View style={ this.styles.page }>
						<View style={ this.styles.header }>
							<View style={ this.styles.meta }>
								<View style={ this.styles.dateMain }>
									<Text style={ this.styles.title }>
										{t( 'page.retrospective.title' )}
									</Text>
									<Link
										src={ '#' + weekRetrospectiveLink( date.subtract( 1, 'week' ) ) }
										style={ this.styles.weekArrow }
									>
										«
									</Link>
									<Text style={ this.styles.weekNumber }>{date.isoWeek()}</Text>
									<Link
										src={ '#' + weekRetrospectiveLink( date.add( 1, 'week' ) ) }
										style={ this.styles.weekArrow }
									>
										»
									</Link>
								</View>
								<View style={ this.styles.dateInfo }>
									<Text style={ this.styles.nameOfWeek }>
										{this.getNameOfWeek()}
									</Text>
								</View>
							</View>
							<MiniCalendar
								date={ date }
								highlightMode={ HIGHLIGHT_WEEK }
								config={ config }
							/>
						</View>
						<View style={ this.styles.content }>
							<Itinerary items={ config.weekRetrospectiveItinerary } />
						</View>
					</View>
				</Page>
				{getItemsOnExtraPages( config.weekRetrospectiveItinerary ).map(
					( items, index ) => (
						<Page key={ index } size={ config.pageSize }>
							<View style={ this.styles.page }>
								<Itinerary items={ items } />
							</View>
						</Page>
					),
				)}
			</>
		);
	}
}

WeekRetrospectivePage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( WeekRetrospectivePage );
