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

import PdfConfig from 'pdf/config';
import DayPage from 'pdf/pages/day';
import MonthOverviewPage from 'pdf/pages/month-overview';
import WeekOverviewPage from 'pdf/pages/week-overview';
import WeekRetrospectivePage from 'pdf/pages/week-retrospective';
import YearOverviewPage from 'pdf/pages/year-overview';

class RecalendarPdf extends React.Component {
	styles = StyleSheet.create( {
		document: {
			fontFamily: 'Lato',
		},
		page: {
			flexDirection: 'row',
			backgroundColor: '#E4E4E4',
		},
	} );

	renderWeek( startOfWeek ) {
		const { config } = this.props;

		const weekPages = [];
		let currentDate = startOfWeek.clone();
		const endOfWeek = startOfWeek.add( 1, 'weeks' );
		while ( currentDate.isBefore( endOfWeek ) ) {
			if ( config.isMonthOverviewEnabled && currentDate.date() === 1 ) {
				weekPages.push(
					<MonthOverviewPage
						key={ 'month-overview-' + currentDate.unix() }
						date={ currentDate }
						config={ config }
					/>,
				);
			}
			const key = 'day-' + currentDate.unix();
			weekPages.push( <DayPage key={ key } date={ currentDate } config={ config } /> );
			currentDate = currentDate.add( 1, 'days' );
		}
		return (
			<React.Fragment key={ 'week-' + startOfWeek.unix() }>
				<WeekOverviewPage date={ startOfWeek } config={ config } />
				{weekPages}
				<WeekRetrospectivePage date={ startOfWeek } config={ config } />
			</React.Fragment>
		);
	}

	renderCalendar() {
		const { year, month, monthCount } = this.props.config;
		const pageList = [];
		let currentDate = dayjs.utc( {
			year,
			month,
			day: 1,
		} );
		const endDate = currentDate.add( monthCount, 'months' );
		pageList.push(
			<YearOverviewPage
				key={ 'year-overview-' + year }
				startDate={ currentDate }
				endDate={ endDate }
				config={ this.props.config }
			/>,
		);

		currentDate = currentDate.startOf( 'week' );
		while ( currentDate.isBefore( endDate ) ) {
			pageList.push( this.renderWeek( currentDate ) );

			currentDate = currentDate.add( 1, 'weeks' );
			if ( this.props.isPreview && currentDate.month() === 1 ) {
				break;
			}
		}
		return pageList;
	}

	render() {
		return (
			<Document style={ this.styles.document }>{this.renderCalendar()}</Document>
		);
	}
}

RecalendarPdf.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	isPreview: PropTypes.bool.isRequired,
};

export default RecalendarPdf;
