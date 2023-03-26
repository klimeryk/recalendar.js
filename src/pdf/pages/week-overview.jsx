import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { getWeekNumber } from 'lib/date';
import Header from 'pdf/components/header';
import MiniCalendar, { HIGHLIGHT_WEEK } from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';
import { weekOverviewLink, dayPageLink } from 'pdf/lib/links';
import { content, pageStyle } from 'pdf/styles';

class WeekOverviewPage extends React.Component {
	styles = StyleSheet.create(
		Object.assign(
			{
				days: {
					flexDirection: 'row',
					flexWrap: 'wrap',
					flexGrow: 1,
					paddingTop: 1,
					paddingLeft: 1,
				},
				day: {
					width: '33.5%',
					height: '33.5%',
					border: '1 solid black',
					flexDirection: 'column',
					marginTop: -1,
					marginLeft: -1,
					padding: 5,
					textDecoration: 'none',
					color: 'black',
				},
				dayDate: {
					flexDirection: 'row',
					flexGrow: 1,
					marginBottom: 2,
				},
				dayOfWeek: {
					fontSize: 12,
					fontWeight: 'bold',
				},
				shortDate: {
					fontSize: 12,
					textTransform: 'uppercase',
					marginLeft: 'auto',
				},
				todos: {
					width: '66.6%',
					height: '33.5%',
					flexDirection: 'column',
					padding: 5,
				},
				todo: {
					fontSize: 10,
				},
				specialItem: {
					fontSize: 10,
				},
			},
			{ content, page: pageStyle( this.props.config ) },
		),
	);

	getNameOfWeek() {
		const { date } = this.props;
		const beginningOfWeek = date.startOf( 'week' ).format( 'DD MMMM' );
		const endOfWeek = date.endOf( 'week' ).format( 'DD MMMM' );
		return `${beginningOfWeek} - ${endOfWeek}`;
	}

	renderDays() {
		const { date } = this.props;
		let currentDate = date.startOf( 'week' );
		const endOfWeek = date.endOf( 'week' );
		const days = [];
		while ( currentDate.isBefore( endOfWeek ) ) {
			days.push( this.renderDay( currentDate ) );
			currentDate = currentDate.add( 1, 'day' );
		}

		days.push( this.renderTodos() );

		return days;
	}

	renderDay( day ) {
		const specialDateKey = day.format( 'DD-MM' );
		const specialItems = this.props.config.specialDates[ specialDateKey ] || [];
		return (
			<Link
				key={ day.unix() }
				style={ this.styles.day }
				src={ '#' + dayPageLink( day ) }
			>
				<View style={ { flexDirection: 'column' } }>
					<View style={ this.styles.dayDate }>
						<Text style={ this.styles.dayOfWeek }>{day.format( 'dddd' )}</Text>
						<Text style={ this.styles.shortDate }>{day.format( 'DD MMM' )}</Text>
					</View>
					{specialItems.map( ( item, index ) => (
						<Text key={ index } style={ this.styles.specialItem }>
							» {item}
						</Text>
					) )}
				</View>
			</Link>
		);
	}

	renderTodos() {
		return (
			<View key={ 'todos' } style={ this.styles.todos }>
				{this.props.config.todos.map( ( { id, value } ) => (
					<Text key={ id } style={ this.styles.todo }>
						{value}
					</Text>
				) )}
			</View>
		);
	}

	render() {
		const { t, date, config } = this.props;
		return (
			<Page id={ weekOverviewLink( date ) } size={ config.pageSize }>
				<View style={ this.styles.page }>
					<Header
						isLeftHanded={ config.isLeftHanded }
						title={ t( 'page.week.title' ) }
						subtitle={ this.getNameOfWeek() }
						number={ getWeekNumber( date ).toString() }
						previousLink={ '#' + weekOverviewLink( date.subtract( 1, 'week' ) ) }
						nextLink={ '#' + weekOverviewLink( date.add( 1, 'week' ) ) }
						calendar={
							<MiniCalendar
								date={ date }
								highlightMode={ HIGHLIGHT_WEEK }
								config={ config }
							/>
						}
					/>
					<View style={ this.styles.days }>{this.renderDays()}</View>
				</View>
			</Page>
		);
	}
}

WeekOverviewPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( WeekOverviewPage );
