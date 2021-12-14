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

import { dayPageLink, monthOverviewLink } from 'lib/links';
import MiniCalendar from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';

class DayPage extends React.Component {
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
		line: {
			borderBottom: '1 solid #AAA',
			fontSize: 12,
			fontWeight: 'bold',
			height: 20,
			minHeight: 20,
			padding: '2 0 0 5',
		},
		nameOfDay: {
			marginLeft: 'auto',
			textTransform: 'uppercase',
			fontSize: 25,
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
	} );

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

	renderLines() {
		const lines = [];
		for ( let i = 0; i < 50; i++ ) {
			lines.push( <Text key={ i } style={ this.styles.line }></Text> );
		}

		return lines;
	}

	render() {
		const { date, config } = this.props;
		const optionalStartOfMonthId =
			! config.isMonthOverviewEnabled && date.date() === 1
				? { id: monthOverviewLink( date ) }
				: {};
		return (
			<Page id={ dayPageLink( date ) } size={ config.pageSize }>
				<View { ...optionalStartOfMonthId } style={ this.styles.page }>
					<View style={ this.styles.header }>
						<View style={ this.styles.meta }>
							<View style={ this.styles.dateMain }>
								<Link
									src={ '#' + monthOverviewLink( date ) }
									style={ this.styles.monthName }
								>
									{date.format( 'MMMM' )}
								</Link>
								<Link
									src={ '#' + dayPageLink( date.subtract( 1, 'day' ) ) }
									style={ this.styles.dayArrow }
								>
									«
								</Link>
								<Text style={ this.styles.dayNumber }>{date.format( 'DD' )}</Text>
								<Link
									src={ '#' + dayPageLink( date.add( 1, 'day' ) ) }
									style={ this.styles.dayArrow }
								>
									»
								</Link>
							</View>
							<View style={ this.styles.dateInfo }>
								<View style={ this.styles.specialDateInfo }>
									{this.renderSpecialDate()}
								</View>
								<Text style={ this.styles.nameOfDay }>{date.format( 'dddd' )}</Text>
							</View>
						</View>
						<MiniCalendar date={ date } config={ config } />
					</View>
					<View style={ this.styles.content }>{this.renderLines()}</View>
				</View>
			</Page>
		);
	}
}

DayPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
};

export default DayPage;
