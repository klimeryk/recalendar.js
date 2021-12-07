import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

import { yearOverviewLink } from 'lib/links';
import MiniCalendar from 'pdf/components/mini-calendar';

class YearOverviewPage extends React.Component {
	renderCalendars() {
		const calendars = [];
		const { startDate, endDate } = this.props;
		let currentDate = startDate;
		while ( currentDate.isBefore( endDate ) ) {
			calendars.push(
				<View key={ currentDate.unix() }>
					<Text>{currentDate.format( 'MMMM YYYY' )}</Text>
				</View>,
			);
			currentDate = currentDate.add( 1, 'month' );
		}

		return calendars;
	}

	render() {
		const { startDate } = this.props;
		return (
			<Page id={ yearOverviewLink() }>
				<Text>Year overview page</Text>
				{this.renderCalendars()}
			</Page>
		);
	}
}

YearOverviewPage.propTypes = {
	endDate: PropTypes.instanceOf( dayjs ).isRequired,
	startDate: PropTypes.instanceOf( dayjs ).isRequired,
};

export default YearOverviewPage;
