import { Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

import MiniCalendar, { HIGHLIGHT_NONE } from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';
import { yearOverviewLink } from 'pdf/lib/links';

class YearOverviewPage extends React.Component {
	styles = StyleSheet.create( {
		year: {
			fontSize: 55,
			fontWeight: 'bold',
			textAlign: 'center',
		},
		calendars: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'center',
		},
	} );

	renderCalendars() {
		const calendars = [];
		const { startDate, endDate, config } = this.props;
		let currentDate = startDate;
		while ( currentDate.isBefore( endDate ) ) {
			calendars.push(
				<MiniCalendar
					key={ currentDate.unix() }
					date={ currentDate }
					highlightMode={ HIGHLIGHT_NONE }
					config={ config }
				>
					{currentDate.format( 'MMMM YYYY' )}
				</MiniCalendar>,
			);
			currentDate = currentDate.add( 1, 'month' );
		}

		return calendars;
	}

	render() {
		const { config, startDate } = this.props;
		return (
			<Page id={ yearOverviewLink() } size={ config.pageSize }>
				<Text style={ this.styles.year }>{startDate.year()}</Text>
				<View style={ this.styles.calendars }>{this.renderCalendars()}</View>
			</Page>
		);
	}
}

YearOverviewPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	endDate: PropTypes.instanceOf( dayjs ).isRequired,
	startDate: PropTypes.instanceOf( dayjs ).isRequired,
};

export default YearOverviewPage;
