import { Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';

import { getPageSizeInPoints } from '~/lib/device-utils';
import { getHorizontalSidebarOffset } from '~/lib/sidebar-utils';
import MiniCalendar, { HIGHLIGHT_NONE, MINI_CALENDAR_WIDTH } from '~/pdf/components/mini-calendar';
import PdfConfig from '~/pdf/config';
import { yearNotesLink, yearOverviewLink } from '~/pdf/lib/links';
import { sidebarPadding } from '~/pdf/styles';

const PAGE_VERTICAL_MARGIN = 5;
const ROW_GAP = 1;

class YearOverviewPage extends React.Component {
  constructor(props) {
    super(props);

    const { config } = props;
    const [pageWidth] = getPageSizeInPoints(config);
    const availableWidth = pageWidth - getHorizontalSidebarOffset(config);
    this.columns = Math.max(1, Math.floor(availableWidth / MINI_CALENDAR_WIDTH));
    const calendarMargin = (availableWidth - this.columns * MINI_CALENDAR_WIDTH) / (this.columns * 2);

    const { paddingTop, paddingBottom, ...horizontalPadding } = sidebarPadding(config);
    this.styles = StyleSheet.create({
      page: {
        ...horizontalPadding,
        paddingTop: paddingTop + PAGE_VERTICAL_MARGIN,
        paddingBottom: paddingBottom + PAGE_VERTICAL_MARGIN,
      },
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
      calendarsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: ROW_GAP,
      },
      calendar: {
        marginLeft: calendarMargin,
        marginRight: calendarMargin,
      },
    });
  }

  renderCalendars() {
    const { startDate, endDate, config } = this.props;
    const rows = [];
    let currentDate = startDate;
    while (currentDate.isBefore(endDate)) {
      const calendars = [];
      const rowKey = currentDate.unix();
      while (calendars.length < this.columns && currentDate.isBefore(endDate)) {
        calendars.push(
          <View key={currentDate.unix()} style={this.styles.calendar}>
            <MiniCalendar date={currentDate} highlightMode={HIGHLIGHT_NONE} config={config} />
          </View>,
        );
        currentDate = currentDate.add(1, 'month');
      }

      rows.push(
        <View key={rowKey} style={this.styles.calendarsRow} wrap={false}>
          {calendars}
        </View>,
      );
    }

    return rows;
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
      <Page size={getPageSizeInPoints(config)} style={this.styles.page}>
        <View id={yearOverviewLink()}>{this.renderTitle()}</View>
        {this.renderCalendars()}
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
