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

import { dayPageLink, monthOverviewLink } from 'lib/links';
import Itinerary from 'pdf/components/itinerary';
import MiniCalendar, { HIGHLIGHT_NONE } from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';

const habitColumnWidth = 40;
const habitSquareWidth = 13;

class MonthOverviewPage extends React.Component {
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
		},
		header: {
			flexGrow: 0,
			flexDirection: 'row',
			borderBottom: '1 solid black',
		},
		meta: {
			flexGrow: 1,
			flexDirection: 'column',
			borderRight: '1 solid black',
			justifyContent: 'center',
		},
		title: {
			textTransform: 'uppercase',
			color: 'black',
			padding: '10 5',
			fontSize: 35,
			fontWeight: 'bold',
			marginLeft: 'auto',
		},
		habitsTable: {
			flexGrow: 0,
			flexDirection: 'column',
			fontSize: 8,
		},
		habitsHeader: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		habitsTitle: {
			fontWeight: 'normal',
		},
		habitDay: {
			fontSize: 6,
			flexDirection: 'column',
			borderRight: '1 solid #AAA',
			borderBottom: '1 solid #AAA',
			justifyContent: 'center',
			alignItems: 'center',
			textAlign: 'center',
			textDecoration: 'none',
			color: 'black',
			width: habitSquareWidth,
			minWidth: habitSquareWidth,
		},
		habitDayDate: {
			fontWeight: 'bold',
		},
		habitDayOfWeek: {
			height: 5,
			fontSize: 4,
			textAlign: 'center',
		},
		habitRow: {
			flexDirection: 'row',
		},
		habitContainer: {
			justifyContent: 'center',
			alignItems: 'center',
			height: habitSquareWidth,
			borderRight: '1 solid #AAA',
			borderBottom: '1 solid #AAA',
			width: habitColumnWidth,
			fontWeight: 'bold',
		},
		habitSquare: {
			height: habitSquareWidth,
			width: habitSquareWidth,
			minWidth: habitSquareWidth,
			borderRight: '1 solid #AAA',
			borderBottom: '1 solid #AAA',
			textDecoration: 'none',
		},
	} );

	renderHabitsTable() {
		const habits = this.props.config.habits;
		if ( ! habits ) {
			return null;
		}

		return (
			<View style={ this.styles.habitsTable }>
				{this.renderHabitsHeader()}
				{habits.map( ( habit ) => this.renderHabit( habit ) )}
			</View>
		);
	}

	renderHabitsHeader() {
		const { date, t } = this.props;
		let currentDate = date.startOf( 'month' );
		const endOfMonth = date.endOf( 'month' );
		const days = [];
		while ( currentDate.isBefore( endOfMonth ) ) {
			days.push( this.renderDay( currentDate ) );
			currentDate = currentDate.add( 1, 'day' );
		}

		return (
			<View style={ this.styles.habitsHeader }>
				<View style={ this.styles.habitContainer }>
					<Text style={ this.styles.habitsTitle }>{t( 'page.month.habbits' )}</Text>
				</View>
				{days}
			</View>
		);
	}

	renderDay( day ) {
		return (
			<Link
				key={ day.unix() }
				src={ '#' + dayPageLink( day ) }
				style={ this.styles.habitDay }
			>
				<Text style={ this.styles.habitDayDate }>{day.format( 'D' )}</Text>
				<Text style={ this.styles.habitDayOfWeek }>{day.format( 'ddd' )}</Text>
			</Link>
		);
	}

	renderHabit( habit ) {
		return (
			<View key={ habit } style={ this.styles.habitRow }>
				<View style={ this.styles.habitContainer }>
					<Text>{habit}</Text>
				</View>
				{this.renderHabitSquares()}
			</View>
		);
	}

	renderHabitSquares() {
		let currentDate = this.props.date.startOf( 'month' );
		const endOfMonth = this.props.date.endOf( 'month' );
		const squares = [];
		while ( currentDate.isBefore( endOfMonth ) ) {
			squares.push(
				<Link
					key={ currentDate.date() }
					style={ this.styles.habitSquare }
					src={ '#' + dayPageLink( currentDate ) }
				/>,
			);
			currentDate = currentDate.add( 1, 'day' );
		}

		return squares;
	}

	render() {
		const { t, date, config } = this.props;
		return (
			<Page id={ monthOverviewLink( date ) } size={ config.pageSize }>
				<View style={ this.styles.page }>
					<View style={ this.styles.header }>
						<View style={ this.styles.meta }>
							<Text style={ this.styles.title }>{date.format( 'MMMM' )}</Text>
						</View>
						<MiniCalendar
							date={ date }
							highlightMode={ HIGHLIGHT_NONE }
							config={ config }
						/>
					</View>
					{this.renderHabitsTable()}
					<View style={ this.styles.content }>
						<Itinerary items={ config.monthItinerary } />
					</View>
				</View>
			</Page>
		);
	}
}

MonthOverviewPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( MonthOverviewPage );
