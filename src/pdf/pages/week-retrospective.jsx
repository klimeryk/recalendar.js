import { Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

import MiniCalendar from 'pdf/components/mini-calendar';

class WeekRetrospectivePage extends React.Component {
	render() {
		const { date } = this.props;
		return (
			<Page>
				<Text>Week retrospective Page for Week #{date.isoWeek()}</Text>
				<MiniCalendar date={ date } />
			</Page>
		);
	}
}

WeekRetrospectivePage.propTypes = {
	date: PropTypes.instanceOf( dayjs ).isRequired,
};

export default WeekRetrospectivePage;
