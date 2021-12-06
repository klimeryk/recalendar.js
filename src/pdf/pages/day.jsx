import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

import MiniCalendar from 'pdf/components/mini-calendar';

class DayPage extends React.Component {
	render() {
		const { date } = this.props;
		return (
			<Page>
				<Text>Day Page for {date.format()}</Text>
				<MiniCalendar date={ date } />
			</Page>
		);
	}
}

DayPage.propTypes = {
	date: PropTypes.instanceOf( dayjs ).isRequired,
};

export default DayPage;
