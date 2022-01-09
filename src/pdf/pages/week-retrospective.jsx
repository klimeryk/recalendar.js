import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { getWeekNumber } from 'lib/date';
import Itinerary from 'pdf/components/itinerary';
import MiniCalendar, { HIGHLIGHT_WEEK } from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';
import { weekRetrospectiveLink } from 'pdf/lib/links';
import {
	arrow,
	content,
	dateInfo,
	dateMain,
	header,
	meta,
	page,
} from 'pdf/styles';
import { getItemsOnExtraPages } from 'pdf/utils';

class WeekRetrospectivePage extends React.Component {
	constructor( props ) {
		super( props );

		const stylesObject = Object.assign(
			{
				nameOfWeek: {
					marginLeft: 'auto',
					textTransform: 'uppercase',
					fontSize: 20,
				},
				title: {
					textTransform: 'uppercase',
					textDecoration: 'none',
					justifyContent: 'center',
					textAlign: 'right',
					color: 'black',
					padding: '10 5',
					width: 170,
				},
				weekNumber: {
					fontSize: 55,
					fontWeight: 'bold',
					textAlign: 'center',
					width: 60,
				},
			},
			{ arrow, content, dateInfo, dateMain, header, meta, page },
		);

		if ( this.props.config.isLeftHanded ) {
			stylesObject.header.flexDirection = 'row-reverse';

			stylesObject.meta.borderLeft = stylesObject.meta.borderRight;
			stylesObject.meta.borderRight = 'none';

			delete stylesObject.dateMain.marginLeft;
			delete stylesObject.nameOfWeek.marginLeft;

			stylesObject.title.textAlign = 'left';
			stylesObject.nameOfWeek.margin = '0 5';
		}

		this.styles = StyleSheet.create( stylesObject );
	}

	getNameOfWeek() {
		const { date } = this.props;
		const beginningOfWeek = date.startOf( 'week' ).format( 'DD MMMM' );
		const endOfWeek = date.endOf( 'week' ).format( 'DD MMMM' );
		return `${beginningOfWeek} - ${endOfWeek}`;
	}

	render() {
		const { t, date, config } = this.props;
		return (
			<>
				<Page id={ weekRetrospectiveLink( date ) } size={ config.pageSize }>
					<View style={ this.styles.page }>
						<View style={ this.styles.header }>
							<View style={ this.styles.meta }>
								<View style={ this.styles.dateMain }>
									<Text style={ this.styles.title }>
										{t( 'page.retrospective.title' )}
									</Text>
									<Link
										src={ '#' + weekRetrospectiveLink( date.subtract( 1, 'week' ) ) }
										style={ this.styles.arrow }
									>
										«
									</Link>
									<Text style={ this.styles.weekNumber }>
										{getWeekNumber( date )}
									</Text>
									<Link
										src={ '#' + weekRetrospectiveLink( date.add( 1, 'week' ) ) }
										style={ this.styles.arrow }
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
						<View style={ this.styles.content }>
							<Itinerary items={ config.weekRetrospectiveItinerary } />
						</View>
					</View>
				</Page>
				{getItemsOnExtraPages( config.weekRetrospectiveItinerary ).map(
					( items, index ) => (
						<Page key={ index } size={ config.pageSize }>
							<View style={ this.styles.page }>
								<Itinerary items={ items } />
							</View>
						</Page>
					),
				)}
			</>
		);
	}
}

WeekRetrospectivePage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( WeekRetrospectivePage );
