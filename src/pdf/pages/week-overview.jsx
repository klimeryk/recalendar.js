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

import { weekOverviewLink, dayPageLink } from 'lib/links';
import MiniCalendar, { HIGHLIGHT_WEEK } from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';

class WeekOverviewPage extends React.Component {
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
			borderTop: '1 solid black',
		},
		header: {
			flexGrow: 0,
			flexDirection: 'row',
		},
		meta: {
			flexGrow: 1,
			flexDirection: 'column',
			borderRight: '1 solid black',
		},
		dateMain: {
			flexDirection: 'row',
			marginLeft: 'auto',
		},
		dateInfo: {
			flexDirection: 'row',
			paddingRight: 5,
		},
		nameOfWeek: {
			marginLeft: 'auto',
			textTransform: 'uppercase',
			fontSize: 20,
		},
		weekArrow: {
			color: '#AAA',
			textDecoration: 'none',
			justifyContent: 'center',
			padding: '10 5',
			fontSize: 20,
		},
		title: {
			textTransform: 'uppercase',
			textDecoration: 'none',
			justifyContent: 'center',
			textAlign: 'right',
			color: 'black',
			padding: '10 5',
			width: 200,
		},
		weekNumber: {
			fontSize: 55,
			fontWeight: 'bold',
			textAlign: 'center',
			width: 60,
		},
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
	} );

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
				{this.props.config.weeklyTodos.map( ( text, index ) => (
					<Text key={ index } style={ this.styles.todo }>
						{text}
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
					<View style={ this.styles.header }>
						<View style={ this.styles.meta }>
							<View style={ this.styles.dateMain }>
								<Link style={ this.styles.title }>{t( 'page.week.title' )}</Link>
								<Link
									src={ '#' + weekOverviewLink( date.subtract( 1, 'week' ) ) }
									style={ this.styles.weekArrow }
								>
									«
								</Link>
								<Text style={ this.styles.weekNumber }>{date.isoWeek()}</Text>
								<Link
									src={ '#' + weekOverviewLink( date.add( 1, 'week' ) ) }
									style={ this.styles.weekArrow }
								>
									»
								</Link>
							</View>
							<View style={ this.styles.dateInfo }>
								<Text style={ this.styles.nameOfWeek }>
									{this.getNameOfWeek()}
								</Text>
							</View>
						</View>
						<MiniCalendar
							date={ date }
							highlightMode={ HIGHLIGHT_WEEK }
							config={ config }
						/>
					</View>
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
