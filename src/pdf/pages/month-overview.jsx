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

import { monthOverviewLink } from 'lib/links';
import MiniCalendar, { HIGHLIGHT_NONE } from 'pdf/components/mini-calendar';
import PdfConfig from 'pdf/config';

class MonthOverviewPage extends React.Component {
	render() {
		const { config, date } = this.props;
		return (
			<Page id={ monthOverviewLink( date ) } size={ config.pageSize }>
				<Text>Month overview Page for month #{date.month() + 1}</Text>
				<MiniCalendar
					date={ date }
					highlightMode={ HIGHLIGHT_NONE }
					config={ config }
				/>
			</Page>
		);
	}
}

MonthOverviewPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	date: PropTypes.instanceOf( dayjs ).isRequired,
};

export default MonthOverviewPage;
