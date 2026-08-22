import { Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';

import { getPageSizeInPoints } from '~/lib/device-utils';
import MiniCalendar, { HIGHLIGHT_NONE } from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import { yearNotesLink, yearOverviewLink } from '~/pdf/lib/links';

class YearOverviewPage extends React.Component {
  styles = StyleSheet.create({
    year: {
      fontSize: 48,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'black',
      textDecoration: 'none',
      justifyContent: 'center',
    },
    titleRange: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    yearRange: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
      textDecoration: 'none',
      textTransform: 'capitalize',
    },
    separator: {
      padding: '0 6',
    },
    calendars: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  });

  renderCalendars() {
    const calendars = [];
    const { startDate, endDate, config } = this.props;
    let currentDate = startDate;
    while (currentDate.isBefore(endDate)) {
      calendars.push(
        <MiniCalendar key={currentDate.unix()} date={currentDate} highlightMode={HIGHLIGHT_NONE} config={config}>
          {currentDate.format('MMMM YYYY')}
        </MiniCalendar>,
      );
      currentDate = currentDate.add(1, 'month');
    }

    return calendars;
  }

  isFullYear() {
    const { startDate, endDate } = this.props;
    const lastMonth = endDate.subtract(1, 'month');
    return startDate.month() === 0 && lastMonth.month() === 11 && startDate.year() === lastMonth.year();
  }

  renderTitlePart(title, date, style) {
    if (!this.props.config.isYearNotesEnabled) {
      return <Text style={style}>{title}</Text>;
    }

    return (
      <Link src={'#' + yearNotesLink(date)} style={style}>
        {title}
      </Link>
    );
  }

  renderTitle() {
    const { startDate, endDate } = this.props;
    if (this.isFullYear()) {
      return this.renderTitlePart(startDate.format('YYYY'), startDate, this.styles.year);
    }

    const lastMonth = endDate.subtract(1, 'month');
    return (
      <View style={this.styles.titleRange}>
        {this.renderTitlePart(startDate.format('MMMM YYYY'), startDate, this.styles.yearRange)}
        <Text style={[this.styles.yearRange, this.styles.separator]}>-</Text>
        {this.renderTitlePart(lastMonth.format('MMMM YYYY'), lastMonth, this.styles.yearRange)}
      </View>
    );
  }

  render() {
    const { config } = this.props;
    return (
      <Page id={yearOverviewLink()} size={getPageSizeInPoints(config)}>
        {this.renderTitle()}
        <View style={this.styles.calendars}>{this.renderCalendars()}</View>
      </Page>
    );
  }
}

YearOverviewPage.propTypes = {
  config: PropTypes.instanceOf(PdfConfig).isRequired,
  endDate: PropTypes.instanceOf(dayjs).isRequired,
  startDate: PropTypes.instanceOf(dayjs).isRequired,
};

export default YearOverviewPage;
