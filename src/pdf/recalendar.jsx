import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import React from 'react';

import DayPage from 'pdf/pages/day';
import MonthOverviewPage from 'pdf/pages/month-overview';
import WeekOverviewPage from 'pdf/pages/week-overview';

class RecalendarPdf extends React.Component {
	styles = StyleSheet.create( {
		page: {
			flexDirection: 'row',
			backgroundColor: '#E4E4E4',
		},
	} );

	renderPagesOnDate( date ) {}

	renderWeek( startOfWeek ) {
		const dayPages = [];
		let currentDate = startOfWeek.clone();
		const endOfWeek = startOfWeek.add( 1, 'weeks' );
		while ( currentDate.isBefore( endOfWeek ) ) {
			dayPages.push( <DayPage date={ currentDate } /> );
			currentDate = currentDate.add( 1, 'days' );
		}
		return (
			<>
				<WeekOverviewPage date={ startOfWeek } />
				{dayPages}
			</>
		);
	}

	renderCalendar() {
		const pageList = [];
		const year = 2021;
		let currentDate = dayjs.utc( { year, month: 0, day: 1 } ).startOf( 'week' );
		while ( currentDate.year() <= year ) {
			pageList.push( this.renderWeek( currentDate ) );

			currentDate = currentDate.add( 1, 'weeks' );
			break;
		}
		return pageList;
	}

	render() {
		return <Document>{this.renderCalendar()}</Document>;
	}
}

export default RecalendarPdf;
