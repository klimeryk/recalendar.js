import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

import {
	dayPageLink,
	monthOverviewLink,
	weekOverviewLink,
	weekRetrospectiveLink,
	yearOverviewLink,
} from 'lib/links';

class MiniCalendar extends React.Component {
	styles = StyleSheet.create( {
		month: {
			width: '100%',
		},
		week: {
			width: '50%',
			display: 'flex',
			height: '80px',
			flexDirection: 'row',
		},
		day: {
			flexGrow: 1,
			flexShrink: 1,
			flexBasis: 0,
			backgroundColor: 'green',
		},
		link: {
			display: 'block',
			width: '100%',
			padding: '10px',
		},
	} );

	renderMonthName() {
		const { day, week } = this.styles;
		const { date } = this.props;
		return (
			<View style={ week }>
				<Link src={ '#' + monthOverviewLink( date.subtract( 1, 'month' ) ) } style={ day }>
					{'<'}
				</Link>
				<Link src={ '#' + monthOverviewLink( date ) } style={ day }>
					{date.format( 'MMMM' )}
				</Link>
				<Link src={ '#' + yearOverviewLink() } style={ day }>
					{date.format( 'YYYY' )}
				</Link>
				<Link src={ '#' + monthOverviewLink( date.add( 1, 'month' ) ) } style={ day }>
					{'>'}
				</Link>
			</View>
		);
	}

	renderWeekdayNames() {
		const { day, week } = this.styles;
		const weekdays = dayjs.weekdaysMin();
		const firstDayOfWeek = dayjs.localeData().firstDayOfWeek();
		const correctedWeekdays = [
			...weekdays.slice( firstDayOfWeek ),
			...weekdays.slice( 0, firstDayOfWeek ),
		];
		const daysOfTheWeek = correctedWeekdays.map( ( dayOfTheWeek, index ) => (
			<Text key={ index } style={ day }>
				{dayOfTheWeek}
			</Text>
		) );

		return (
			<View style={ week }>
				<Text style={ day }>W#</Text>
				{daysOfTheWeek}
				<Text style={ day }>Re</Text>
			</View>
		);
	}

	renderMonth() {
		let currentWeek = this.props.date.startOf( 'month' ).startOf( 'week' );
		const endDate = this.props.date.endOf( 'month' );
		const weekRows = [];
		while ( currentWeek.isBefore( endDate ) ) {
			weekRows.push( this.renderWeek( currentWeek ) );
			currentWeek = currentWeek.add( 1, 'week' );
		}

		return <>{weekRows}</>;
	}

	renderWeek( week ) {
		const { day } = this.styles;
		const days = [];
		for ( let i = 0; i < 7; i++ ) {
			const currentDay = week.add( i, 'days' );
			days.push(
				<Link key={ i } src={ '#' + dayPageLink( currentDay ) } style={ day }>
					{currentDay.date()}
				</Link>,
			);
		}

		return (
			<View key={ week.isoWeek() } style={ this.styles.week }>
				<Link src={ '#' + weekOverviewLink( week ) } style={ day }>
					{week.isoWeek()}
				</Link>
				{days}
				<Link src={ '#' + weekRetrospectiveLink( week ) } style={ day }>
					R
				</Link>
			</View>
		);
	}

	render() {
		const { month, week, day } = this.styles;
		return (
			<View style={ month }>
				{this.renderMonthName()}
				{this.renderWeekdayNames()}
				{this.renderMonth()}
			</View>
		);
	}
}

MiniCalendar.propTypes = {
	date: PropTypes.instanceOf( dayjs ).isRequired,
};

export default MiniCalendar;
