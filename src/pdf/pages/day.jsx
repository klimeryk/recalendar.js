import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

import Itinerary from 'pdf/components/itinerary';
import MiniCalendar from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';
import {
	dayPageLink,
	nextDayPageLink,
	previousDayPageLink,
	monthOverviewLink,
	weekOverviewLink,
} from 'pdf/lib/links';
import { getItemsOnExtraPages } from 'pdf/utils';

class DayPage extends React.Component {
	constructor( props ) {
		super( props );

		const stylesObject = {
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
			nameOfDay: {
				marginLeft: 'auto',
				textTransform: 'uppercase',
				fontSize: 22,
			},
			dayArrow: {
				color: '#AAA',
				textDecoration: 'none',
				justifyContent: 'center',
				padding: '10 5',
				fontSize: 20,
			},
			monthName: {
				textTransform: 'uppercase',
				textDecoration: 'none',
				justifyContent: 'center',
				color: 'black',
				padding: '10 5',
				fontSize: 20,
			},
			dayNumber: {
				fontSize: 55,
				fontWeight: 'bold',
			},
			specialDateInfo: {
				flexDirection: 'column',
				width: 130,
			},
			specialDate: {
				fontSize: 10,
				marginLeft: 5,
				fontStyle: 'italic',
			},
		};

		if ( this.props.config.isLeftHanded ) {
			stylesObject.header.flexDirection = 'row-reverse';

			stylesObject.meta.borderLeft = stylesObject.meta.borderRight;
			stylesObject.meta.borderRight = 'none';

			delete stylesObject.dateMain.marginLeft;
			delete stylesObject.nameOfDay.marginLeft;

			stylesObject.dateInfo.flexDirection = 'row-reverse';
			stylesObject.nameOfDay.margin = '0 5';
		}

		this.styles = StyleSheet.create( stylesObject );
	}

	renderSpecialDate() {
		const specialDateKey = this.props.date.format( 'DD-MM' );
		if ( ! this.props.config.specialDates[ specialDateKey ] ) {
			return null;
		}

		return this.props.config.specialDates[ specialDateKey ].map( ( text, index ) => (
			<Text key={ index } style={ this.styles.specialDate }>
				» {text}
			</Text>
		) );
	}

	renderExtraItems = ( items, index ) => (
		<Page key={ index } size={ this.props.config.pageSize }>
			<View style={ this.styles.page }>
				<Itinerary items={ items } />
			</View>
		</Page>
	);

	render() {
		const { date, config } = this.props;
		const { items, isEnabled } = config.dayItineraries[ date.weekday() ];
		if ( ! isEnabled ) {
			return null;
		}

		const optionalStartOfMonthId =
			! config.isMonthOverviewEnabled && date.date() === 1
				? { id: monthOverviewLink( date ) }
				: {};
		const optionalStartOfWeekId =
			! config.isWeekOverviewEnabled && date.weekday() === 0
				? { id: weekOverviewLink( date ) }
				: {};
		return (
			<>
				<Page id={ dayPageLink( date ) } size={ config.pageSize }>
					<View { ...optionalStartOfMonthId } style={ this.styles.page }>
						<View { ...optionalStartOfWeekId } style={ this.styles.header }>
							<View style={ this.styles.meta }>
								<View style={ this.styles.dateMain }>
									<Link
										src={ '#' + monthOverviewLink( date ) }
										style={ this.styles.monthName }
									>
										{date.format( 'MMMM' )}
									</Link>
									<Link
										src={ '#' + previousDayPageLink( date, config ) }
										style={ this.styles.dayArrow }
									>
										«
									</Link>
									<Text style={ this.styles.dayNumber }>{date.format( 'DD' )}</Text>
									<Link
										src={ '#' + nextDayPageLink( date, config ) }
										style={ this.styles.dayArrow }
									>
										»
									</Link>
								</View>
								<View style={ this.styles.dateInfo }>
									<View style={ this.styles.specialDateInfo }>
										{this.renderSpecialDate()}
									</View>
									<Text style={ this.styles.nameOfDay }>
										{date.format( 'dddd' )}
									</Text>
								</View>
							</View>
							<MiniCalendar date={ date } config={ config } />
						</View>
						<View style={ this.styles.content }>
							<Itinerary items={ items } />
						</View>
					</View>
				</Page>
				{getItemsOnExtraPages( items ).map( this.renderExtraItems )}
			</>
		);
	}
}

DayPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
};

export default DayPage;
