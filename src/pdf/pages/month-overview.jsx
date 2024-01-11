import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { getWeekendDays } from '~/lib/date';
import Itinerary from '~/pdf/components/itinerary';
import MiniCalendar, { HIGHLIGHT_NONE } from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import { dayPageLink, monthOverviewLink } from '~/pdf/lib/links';
import { pageStyle } from '~/pdf/styles';
import { splitItemsByPages } from '~/pdf/utils';

class MonthOverviewPage extends React.Component {
	constructor( props ) {
		super( props );

		const habitColumnWidth = 40;
		const habitSquareWidth = props.config.alwaysOnSidebar ? 12 : 13;

		const stylesObject = Object.assign(
			{
				content: {
					flex: 1,
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
					fontSize: 8,
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
					height: habitSquareWidth,
				},
				habitDayDate: {
					fontWeight: 'bold',
					position: 'relative',
					top: -1,
				},
				habitDayOfWeek: {
					fontSize: 6,
					textAlign: 'center',
					position: 'relative',
					top: -1,
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
				weekendDay: {
					backgroundColor: '#EEE',
				},
			},
			{ page: pageStyle( props.config ) },
		);

		if ( this.props.config.isLeftHanded ) {
			stylesObject.header.flexDirection = 'row-reverse';

			stylesObject.meta.borderLeft = '1 solid black';
			stylesObject.meta.borderRight = 'none';

			delete stylesObject.title.marginLeft;
		}

		this.styles = StyleSheet.create( stylesObject );
	}

	renderHabitsTable() {
		const habits = this.props.config.habits;
		if ( habits.length === 0 ) {
			return null;
		}

		return (
			<View style={ this.styles.habitsTable }>
				{this.renderHabitsHeader()}
				{habits.map( this.renderHabit )}
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
					<Text style={ this.styles.habitsTitle }>
						{t( 'page.month.habits.title' )}
					</Text>
				</View>
				{days}
			</View>
		);
	}

	renderDay( day ) {
		return (
			<Link
				key={ day.unix() }
				src={ '#' + dayPageLink( day, this.props.config ) }
				style={ this.styles.habitDay }
			>
				<Text style={ this.styles.habitDayDate }>{day.format( 'D' )}</Text>
				<Text style={ this.styles.habitDayOfWeek }>{day.format( 'dd' )}</Text>
			</Link>
		);
	}

	renderHabit = ( { id, value } ) => {
		return (
			<View key={ id } style={ this.styles.habitRow }>
				<View style={ this.styles.habitContainer }>
					<Text>{value}</Text>
				</View>
				{this.renderHabitSquares()}
			</View>
		);
	};

	renderHabitSquares() {
		const { config } = this.props;
		const weekendDays = getWeekendDays( config.weekendDays, config.firstDayOfWeek );
		let currentDate = this.props.date.startOf( 'month' );
		const endOfMonth = this.props.date.endOf( 'month' );
		const squares = [];
		while ( currentDate.isBefore( endOfMonth ) ) {
			const styles = [ this.styles.habitSquare ];
			if ( weekendDays.includes( currentDate.day() ) ) {
				styles.push( this.styles.weekendDay );
			}
			squares.push(
				<Link
					key={ currentDate.date() }
					style={ styles }
					src={ '#' + dayPageLink( currentDate, config ) }
				/>,
			);
			currentDate = currentDate.add( 1, 'day' );
		}

		return squares;
	}

	render() {
		const { date, config } = this.props;
		const { dpi, pageSize } = config;
		const itemsByPage = splitItemsByPages( config.monthItinerary );
		return (
			<>
				<Page id={ monthOverviewLink( date, config ) } size={ pageSize } dpi={ dpi }>
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
							<Itinerary items={ itemsByPage[ 0 ] } lineStyle={ config.lineStyle } />
						</View>
					</View>
				</Page>
				{itemsByPage.slice( 1 ).map( ( items, index ) => (
					<Page key={ index } size={ pageSize } dpi={ dpi }>
						<View style={ this.styles.page }>
							<Itinerary items={ items } lineStyle={ config.lineStyle } />
						</View>
					</Page>
				) )}
			</>
		);
	}
}

MonthOverviewPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( MonthOverviewPage );
