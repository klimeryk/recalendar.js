import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	Link,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

import { yearOverviewLink } from 'lib/links';
import MiniCalendar from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';

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
		const { config, startDate } = this.props;
		return (
			<Page id={ yearOverviewLink() } size={ config.pageSize }>
				<Text>Year overview page</Text>
				{this.renderCalendars()}
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
