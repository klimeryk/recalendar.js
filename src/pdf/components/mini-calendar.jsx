import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

import { getWeekdays } from 'lib/date';
import {
	dayPageLink,
	monthOverviewLink,
	weekOverviewLink,
	weekRetrospectiveLink,
	yearOverviewLink,
} from 'lib/links';

export const HIGHLIGHT_WEEK = 'HIGHLIGHT_WEEK';
export const HIGHLIGHT_DAY = 'HIGHLIGHT_DAY';
export const HIGHLIGHT_NONE = 'HIGHLIGHT_NONE';

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
		currentWeek: {
			backgroundColor: '#CCC',
		},
		day: {
			flexGrow: 1,
			flexShrink: 1,
			flexBasis: 0,
			textDecoration: 'none',
			color: 'black',
			fontWeight: 'normal',
		},
		currentDay: {
			backgroundColor: '#CCC',
		},
		weekendDay: {
			fontWeight: 'bold',
		},
		specialDay: {
			border: '1px solid #555',
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
		const weekdays = getWeekdays();
		const daysOfTheWeek = weekdays.map( ( dayOfTheWeek, index ) => (
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
		const weekdays = getWeekdays();
		const weekendDays = [ weekdays[ weekdays.length - 1 ], weekdays[ weekdays.length - 2 ] ];
		for ( let i = 0; i < 7; i++ ) {
			const currentDay = week.add( i, 'days' );
			const dayStyles = [ day ];
			if (
				this.props.highlightMode === HIGHLIGHT_DAY &&
				currentDay.isSame( this.props.date, 'day' )
			) {
				dayStyles.push( this.styles.currentDay );
			}
			if ( weekendDays.includes( currentDay.format( 'dd' ) ) ) {
				dayStyles.push( this.styles.weekendDay );
			}
			days.push(
				<Link key={ i } src={ '#' + dayPageLink( currentDay ) } style={ dayStyles }>
					{currentDay.date()}
				</Link>,
			);
		}

		const weekStyles = [ this.styles.week ];
		if (
			this.props.highlightMode === HIGHLIGHT_WEEK &&
			week.isoWeek() === this.props.date.isoWeek()
		) {
			weekStyles.push( this.styles.currentWeek );
		}
		return (
			<View key={ week.isoWeek() } style={ weekStyles }>
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

MiniCalendar.defaultProps = {
	highlightMode: HIGHLIGHT_DAY,
};

MiniCalendar.propTypes = {
	date: PropTypes.instanceOf( dayjs ).isRequired,
	highlightMode: PropTypes.oneOf( [ HIGHLIGHT_DAY, HIGHLIGHT_WEEK, HIGHLIGHT_NONE ] ),
};

export default MiniCalendar;
