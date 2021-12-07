import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

import { monthOverviewLink } from 'lib/links';
import MiniCalendar from 'pdf/components/mini-calendar';

class MonthOverviewPage extends React.Component {
	render() {
		const { date } = this.props;
		return (
			<Page id={ monthOverviewLink( date ) }>
				<Text>Month overview Page for month #{date.month() + 1}</Text>
				<MiniCalendar date={ date } />
			</Page>
		);
	}
}

MonthOverviewPage.propTypes = {
	date: PropTypes.instanceOf( dayjs ).isRequired,
};

export default MonthOverviewPage;
