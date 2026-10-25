import { Document, StyleSheet } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

import PdfConfig from '~/pdf/config';
import { NOTO_SANS_CJK } from '~/pdf/lib/fonts';
import DayPage from '~/pdf/pages/day';
import LastPage from '~/pdf/pages/last';
import MonthOverviewPage from '~/pdf/pages/month-overview';
import WeekOverviewPage from '~/pdf/pages/week-overview';
import WeekRetrospectivePage from '~/pdf/pages/week-retrospective';
import YearNotesPage from '~/pdf/pages/year-notes';
import YearOverviewPage from '~/pdf/pages/year-overview';
import { getCalendarStartDate, getRenderedMonthCount } from '~/pdf/utils';

class RecalendarPdf extends React.Component {
  styles = StyleSheet.create({
    document: {
      fontFamily: [this.props.config.fontFamily, NOTO_SANS_CJK],
    },
    page: {
      flexDirection: 'row',
      backgroundColor: '#E4E4E4',
    },
  });

  renderWeek(startOfWeek, endDate) {
    const { config } = this.props;

    const weekPages = [];
    let currentDate = startOfWeek.clone();
    const endOfWeek = startOfWeek.add(1, 'weeks');
    while (currentDate.isBefore(endOfWeek)) {
      if (
        config.isYearNotesEnabled &&
        currentDate.month() === 0 &&
        currentDate.date() === 1 &&
        currentDate.year() > config.year &&
        currentDate.isBefore(endDate)
      ) {
        weekPages.push(<YearNotesPage key={'year-notes-' + currentDate.year()} date={currentDate} config={config} />);
      }
      if (config.isMonthOverviewEnabled && currentDate.date() === 1) {
        weekPages.push(
          <MonthOverviewPage key={'month-overview-' + currentDate.unix()} date={currentDate} config={config} />,
        );
      }
      const key = 'day-' + currentDate.unix();
      weekPages.push(<DayPage key={key} date={currentDate} config={config} />);
      currentDate = currentDate.add(1, 'days');
    }
    return (
      <React.Fragment key={'week-' + startOfWeek.unix()}>
        {config.isWeekOverviewEnabled && <WeekOverviewPage date={startOfWeek} config={config} />}
        {weekPages}
        {config.isWeekRetrospectiveEnabled && <WeekRetrospectivePage date={startOfWeek} config={config} />}
      </React.Fragment>
    );
  }

  renderCalendar() {
    const { config } = this.props;
    const { year, monthCount } = config;
    const pageList = [];
    let currentDate = getCalendarStartDate(config);
    const endDate = currentDate.add(monthCount, 'months');
    const renderedEndDate = currentDate.add(getRenderedMonthCount(config), 'months');

    pageList.push(
      <YearOverviewPage key={'year-overview-' + year} startDate={currentDate} endDate={endDate} config={config} />,
    );
    if (config.isYearNotesEnabled) {
      pageList.push(<YearNotesPage key={'year-notes-' + year} date={currentDate} config={config} />);
    }

    currentDate = currentDate.startOf('week');
    while (currentDate.isBefore(renderedEndDate)) {
      pageList.push(this.renderWeek(currentDate, renderedEndDate));
      currentDate = currentDate.add(1, 'weeks');
    }

    pageList.push(<LastPage key="last" config={config} />);

    return pageList;
  }

  render() {
    return <Document style={this.styles.document}>{this.renderCalendar()}</Document>;
  }
}

RecalendarPdf.propTypes = {
  config: PropTypes.instanceOf(PdfConfig).isRequired,
};

export default RecalendarPdf;
