import { Page, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import PdfConfig from 'pdf/config';
import { yearOverviewLink, yearNotesLink } from 'pdf/lib/links';

class YearNotesPage extends React.Component {
	styles = StyleSheet.create( {
		year: {
			fontSize: 55,
			fontWeight: 'bold',
			textAlign: 'center',
			color: 'black',
			textDecoration: 'none',
			justifyContent: 'center',
		},
	} );

	render() {
		const { config, startDate } = this.props;
		return (
			<>
				<Page id={ yearNotesLink() } size={ config.pageSize }>
					<Link src={ '#' + yearOverviewLink() } style={ this.styles.year }>{startDate.year()}
					</Link>
				</Page>
			</>
		);
	}
}

YearNotesPage.propTypes = {
	config: PropTypes.instanceOf( PdfConfig ).isRequired,
	startDate: PropTypes.instanceOf( dayjs ).isRequired,
};

export default withTranslation( 'pdf' )( YearNotesPage );
