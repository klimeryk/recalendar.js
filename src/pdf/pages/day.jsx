import { Page, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

import Header from 'pdf/components/header';
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
import { content, pageStyle } from 'pdf/styles';
import { getItemsOnExtraPages } from 'pdf/utils';

class DayPage extends React.Component {
	styles = StyleSheet.create(
		Object.assign( {}, { content, page: pageStyle( this.props.config ) } ),
	);

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

		const specialDateKey = this.props.date.format( 'DD-MM' );
		const specialItems = this.props.config.specialDates[ specialDateKey ];
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
						<Header
							{ ...optionalStartOfWeekId }
							isLeftHanded={ config.isLeftHanded }
							title={ date.format( 'MMMM' ) }
							titleLink={ '#' + monthOverviewLink( date ) }
							subtitle={ date.format( 'dddd' ) }
							number={ date.format( 'DD' ) }
							previousLink={ '#' + previousDayPageLink( date, config ) }
							nextLink={ '#' + nextDayPageLink( date, config ) }
							calendar={ <MiniCalendar date={ date } config={ config } /> }
							specialItems={ specialItems }
						/>
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
