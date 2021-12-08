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
import { withTranslation } from 'react-i18next';

import { getWeekdays } from 'lib/date';
import {
	dayPageLink,
	monthOverviewLink,
	weekOverviewLink,
	weekRetrospectiveLink,
	yearOverviewLink,
} from 'lib/links';
import PdfConfig from 'pdf/config';

export const HIGHLIGHT_WEEK = 'HIGHLIGHT_WEEK';
export const HIGHLIGHT_DAY = 'HIGHLIGHT_DAY';
export const HIGHLIGHT_NONE = 'HIGHLIGHT_NONE';

class MiniCalendar extends React.Component {
	styles = StyleSheet.create( {
		body: {
			fontSize: 8,
			padding: '0 5 5 5',
			width: 145,
		},
		week: {
			display: 'flex',
			flexDirection: 'row',
		},
		currentWeek: {
			backgroundColor: '#CCC',
		},
		currentWeekDay: {
			border: '1 solid #CCC',
		},
		day: {
			flexGrow: 1,
			flexShrink: 1,
			width: 14,
			textDecoration: 'none',
			color: 'black',
			fontWeight: 'normal',
			textAlign: 'center',
			padding: 2,
			border: '1 solid white',
		},
		header: {
			flexDirection: 'row',
		},
		monthArrow: {
			flexBasis: 20,
			flexGrow: 0,
			textAlign: 'center',
			padding: 5,
			textDecoration: 'none',
			color: '#AAA',
			fontSize: 12,
			fontWeight: 'bold',
		},
		monthName: {
			textTransform: 'uppercase',
			padding: 5,
			textDecoration: 'none',
			color: '#888',
			fontSize: 12,
			fontWeight: 'bold',
		},
		push: {
			marginLeft: 'auto',
		},
		currentDay: {
			backgroundColor: '#CCC',
			border: '1 solid #CCC',
		},
		weekendDay: {
			fontWeight: 'bold',
		},
		specialDay: {
			border: '1px solid #555',
		},
		otherMonthDay: {
			color: '#999',
		},
		weekNumber: {
			color: '#999',
			border: 'none',
			borderRight: '1 solid black',
			fontSize: 7,
			justifyContent: 'center',
		},
		weekRetrospective: {
			color: '#999',
			border: 'none',
			borderLeft: '1 solid black',
			paddingTop: 3,
		},
		weekdayName: {
			fontWeight: 'bold',
			color: 'black',
			border: 'none',
			borderBottom: '1 solid black',
		},
	} );

	renderMonthName() {
		const { monthArrow, monthName, push, header } = this.styles;
		const { date } = this.props;
		return (
			<View style={ header }>
				<Link
					src={ '#' + monthOverviewLink( date.subtract( 1, 'month' ) ) }
					style={ monthArrow }
				>
					{'<'}
				</Link>
				<Link src={ '#' + monthOverviewLink( date ) } style={ [ monthName, push ] }>
					{date.format( 'MMMM' )}
				</Link>
				<Link src={ '#' + yearOverviewLink() } style={ monthName }>
					{date.format( 'YYYY' )}
				</Link>
				<Link
					src={ '#' + monthOverviewLink( date.add( 1, 'month' ) ) }
					style={ [ monthArrow, push ] }
				>
					{'>'}
				</Link>
			</View>
		);
	}

	renderWeekdayNames() {
		const { t } = this.props;
		const { day, week } = this.styles;
		const weekdays = getWeekdays();
		const daysOfTheWeek = weekdays.map( ( dayOfTheWeek, index ) => (
			<Text key={ index } style={ [ day, this.styles.weekdayName ] }>
				{dayOfTheWeek}
			</Text>
		) );

		return (
			<View style={ week }>
				<Text style={ [ day, this.styles.weekNumber, this.styles.weekdayName ] }>
					{t( 'calendar.header.week-number' )}
				</Text>
				{daysOfTheWeek}
				<Text
					style={ [ day, this.styles.weekRetrospective, this.styles.weekdayName ] }
				>
					{t( 'calendar.header.retrospective' )}
				</Text>
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
		const { config, t } = this.props;
		const { day } = this.styles;
		const days = [];
		const weekdays = getWeekdays();
		const weekendDays = [
			weekdays[ weekdays.length - 1 ],
			weekdays[ weekdays.length - 2 ],
		];
		for ( let i = 0; i < 7; i++ ) {
			const currentDay = week.add( i, 'days' );
			const dayStyles = [ day ];

			if (
				this.props.highlightMode === HIGHLIGHT_DAY &&
				currentDay.isSame( this.props.date, 'day' )
			) {
				dayStyles.push( this.styles.currentDay );
			}

			if (
				this.props.highlightMode === HIGHLIGHT_WEEK &&
				currentDay.isoWeek() === this.props.date.isoWeek()
			) {
				dayStyles.push( this.styles.currentWeekDay );
			}

			if ( weekendDays.includes( currentDay.format( 'dd' ) ) ) {
				dayStyles.push( this.styles.weekendDay );
			}

			if ( currentDay.month() !== this.props.date.month() ) {
				dayStyles.push( this.styles.otherMonthDay );
			}

			const specialDateKey = currentDay.format( 'DD-MM' );
			if ( config.specialDates[ specialDateKey ] ) {
				dayStyles.push( this.styles.specialDay );
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
				<Link
					src={ '#' + weekOverviewLink( week ) }
					style={ [ day, this.styles.weekNumber ] }
				>
					{week.isoWeek()}
				</Link>
				{days}
				<Link
					src={ '#' + weekRetrospectiveLink( week ) }
					style={ [ day, this.styles.weekRetrospective ] }
				>
					{t( 'calendar.body.retrospective' )}
				</Link>
			</View>
		);
	}

	render() {
		return (
			<View style={ this.styles.body }>
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
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	highlightMode: PropTypes.oneOf( [
		HIGHLIGHT_DAY,
		HIGHLIGHT_WEEK,
		HIGHLIGHT_NONE,
	] ),
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( MiniCalendar );
