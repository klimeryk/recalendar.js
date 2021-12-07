import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { dayPageLink } from 'lib/links';
import MiniCalendar from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';

class DayPage extends React.Component {
	render() {
		const { date, t, config } = this.props;
		return (
			<Page id={ dayPageLink( date ) } size={ config.pageSize }>
				<Text>{t( 'page.day.header', { date: date.format() } )}</Text>
				<MiniCalendar date={ date } />
			</Page>
		);
	}
}

DayPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( DayPage );
