import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import MiniCalendar from 'pdf/components/mini-calendar';

class DayPage extends React.Component {
	render() {
		const { date, t } = this.props;
		return (
			<Page>
				<Text>{t( 'page.day.header', { date: date.format() } )}</Text>
				<MiniCalendar date={ date } />
			</Page>
		);
	}
}

DayPage.propTypes = {
	date: PropTypes.instanceOf( dayjs ).isRequired,
	t: PropTypes.func.isRequired,
};

export default withTranslation( 'pdf' )( DayPage );
