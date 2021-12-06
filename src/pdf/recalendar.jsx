import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

import PdfConfig from 'pdf/config';
import DayPage from 'pdf/pages/day';
import MonthOverviewPage from 'pdf/pages/month-overview';
import WeekOverviewPage from 'pdf/pages/week-overview';
import WeekRetrospectivePage from 'pdf/pages/week-retrospective';

class RecalendarPdf extends React.Component {
	styles = StyleSheet.create( {
		page: {
			flexDirection: 'row',
			backgroundColor: '#E4E4E4',
		},
	} );

	renderWeek( startOfWeek ) {
		const weekPages = [];
		let currentDate = startOfWeek.clone();
		const endOfWeek = startOfWeek.add( 1, 'weeks' );
		while ( currentDate.isBefore( endOfWeek ) ) {
			if ( currentDate.date() === 1 ) {
				weekPages.push( <MonthOverviewPage date={ currentDate } /> );
			}
			weekPages.push( <DayPage useSuspense={ false } date={ currentDate } /> );
			currentDate = currentDate.add( 1, 'days' );
		}
		return (
			<>
				<WeekOverviewPage date={ startOfWeek } />
				{weekPages}
				<WeekRetrospectivePage date={ startOfWeek } />
			</>
		);
	}

	renderCalendar() {
		const { year } = this.props.config;
		const pageList = [];
		let currentDate = dayjs
			.utc( {
				year,
				month: 0,
				day: 1,
			} )
			.startOf( 'week' );
		while ( currentDate.year() <= year ) {
			pageList.push( this.renderWeek( currentDate ) );

			currentDate = currentDate.add( 1, 'weeks' );
			if ( this.props.isPreview && currentDate.month() === 2 ) {
				break;
			}
		}
		return pageList;
	}

	render() {
		return <Document>{this.renderCalendar()}</Document>;
	}
}

RecalendarPdf.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	isPreview: PropTypes.bool.isRequired,
};

export default RecalendarPdf;
