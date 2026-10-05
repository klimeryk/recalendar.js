import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { getWeekdays, getWeekendDays, getWeekNumber } from '~/lib/date';
import { findByDate, isEvent, isHoliday, DATE_FORMAT as SPECIAL_DATES_DATE_FORMAT } from '~/lib/special-dates-utils';
import { calendarPageExists } from '~/pdf/utils';
import PdfConfig from '~/pdf/config';
import {
  dayPageLink,
  monthOverviewLink,
  weekOverviewLink,
  weekRetrospectiveLink,
  yearOverviewLink,
} from '~/pdf/lib/links';

export const MINI_CALENDAR_WIDTH = 145;

export const HIGHLIGHT_WEEK = 'HIGHLIGHT_WEEK';
export const HIGHLIGHT_DAY = 'HIGHLIGHT_DAY';
export const HIGHLIGHT_NONE = 'HIGHLIGHT_NONE';

class MiniCalendar extends React.Component {
  styles = StyleSheet.create({
    body: {
      fontSize: 10,
      width: MINI_CALENDAR_WIDTH,
    },
    week: {
      display: 'flex',
      flexDirection: 'row',
    },
    currentWeek: {
      backgroundColor: '#CCC',
    },
    currentWeekDay: {
      border: '1 solid #CCC',
    },
    day: {
      flexGrow: 1,
      flexShrink: 1,
      width: 14,
      textDecoration: 'none',
      color: 'black',
      fontWeight: 'normal',
      textAlign: 'center',
      padding: '1',
      border: '1 solid white',
    },
    header: {
      flexDirection: 'row',
    },
    monthArrow: {
      flexBasis: 20,
      flexGrow: 0,
      textAlign: 'center',
      padding: '2 5',
      textDecoration: 'none',
      color: '#AAA',
      fontSize: 12,
      fontWeight: 'bold',
    },
    monthName: {
      textTransform: 'uppercase',
      padding: '2 5',
      textDecoration: 'none',
      color: '#888',
      fontSize: 12,
      fontWeight: 'bold',
    },
    pushLeft: {
      marginLeft: 'auto',
    },
    pushRight: {
      marginRight: 'auto',
    },
    currentDay: {
      backgroundColor: '#CCC',
      border: '1 solid #CCC',
    },
    weekendDay: {
      fontWeight: 1000,
    },
    eventDay: {
      border: '1px solid #555',
    },
    otherMonthDay: {
      color: '#999',
    },
    noPageDay: {
      color: '#AAA',
      fontStyle: 'italic',
      padding: '2 2 0 2',
    },
    weekNumber: {
      color: '#999',
      border: 'none',
      borderRight: '1 solid black',
      fontSize: 10,
      justifyContent: 'center',
      width: 20,
    },
    weekRetrospective: {
      color: '#999',
      border: 'none',
      borderLeft: '1 solid black',
      paddingTop: 2,
    },
    weekdayName: {
      fontWeight: 'bold',
      color: 'black',
      border: 'none',
      borderBottom: '1 solid black',
      fontSize: 9,
    },
  });

  renderMonthName() {
    const { monthArrow, monthName, pushLeft, pushRight, header } = this.styles;
    const { config, date, showArrows } = this.props;

    return (
      <View style={header}>
        {calendarPageExists(date.subtract(1, 'month'), config) && showArrows ? (
          <Link src={'#' + monthOverviewLink(date.subtract(1, 'month'), config)} style={[monthArrow, pushLeft]}>
            {'<'}
          </Link>
        ) : (
          <Text style={[monthArrow, pushLeft]}></Text>
        )}
        <Link src={'#' + monthOverviewLink(date, config)} style={monthName}>
          {date.format('MMM')}
        </Link>
        <Link src={'#' + yearOverviewLink()} style={monthName}>
          {date.format('YYYY')}
        </Link>
        {calendarPageExists(date.add(1, 'month'), config) && showArrows ? (
          <Link src={'#' + monthOverviewLink(date.add(1, 'month'), config)} style={[monthArrow, pushRight]}>
            {'>'}
          </Link>
        ) : (
          <Text style={[monthArrow, pushRight]}></Text>
        )}
      </View>
    );
  }

  renderWeekdayNames() {
    const { t } = this.props;
    const { day, week } = this.styles;
    const weekdays = getWeekdays(this.props.config.firstDayOfWeek);
    const daysOfTheWeek = weekdays.map((dayOfTheWeek) => (
      <Text key={dayOfTheWeek.index} style={[day, this.styles.weekdayName]}>
        {dayOfTheWeek.min}
      </Text>
    ));

    return (
      <View style={week}>
        <Text style={[day, this.styles.weekNumber, this.styles.weekdayName, { paddingTop: 1 }]}>
          {t('calendar.header.week-number')}
        </Text>
        {daysOfTheWeek}
        {this.props.config.isWeekRetrospectiveEnabled && (
          <Text style={[day, this.styles.weekRetrospective, this.styles.weekdayName, { paddingTop: 1 }]}>
            {t('calendar.header.retrospective')}
          </Text>
        )}
      </View>
    );
  }

  renderMonth() {
    let currentWeek = this.props.date.startOf('month').startOf('week');
    const endDate = this.props.date.endOf('month');
    const weekRows = [];
    while (currentWeek.isBefore(endDate)) {
      weekRows.push(this.renderWeek(currentWeek));
      currentWeek = currentWeek.add(1, 'week');
    }

    return <>{weekRows}</>;
  }

  renderWeek(week) {
    const { config, t } = this.props;
    const { day } = this.styles;
    const days = [];
    const weekendDays = getWeekendDays(config.weekendDays, config.firstDayOfWeek);
    const weekNumber = getWeekNumber(week);

    for (let i = 0; i < 7; i++) {
      const currentDay = week.add(i, 'days');
      const dayStyles = [day];

      if (this.props.highlightMode === HIGHLIGHT_DAY && currentDay.isSame(this.props.date, 'day')) {
        dayStyles.push(this.styles.currentDay);
      }

      if (this.props.highlightMode === HIGHLIGHT_WEEK && weekNumber === getWeekNumber(this.props.date)) {
        dayStyles.push(this.styles.currentWeekDay);
      }

      if (weekendDays.includes(currentDay.day())) {
        dayStyles.push(this.styles.weekendDay);
      }

      if (currentDay.month() !== this.props.date.month()) {
        dayStyles.push(this.styles.otherMonthDay);
      }

      if (!calendarPageExists(currentDay, config)) {
        dayStyles.push(this.styles.noPageDay);
      }

      const specialDateKey = currentDay.format(SPECIAL_DATES_DATE_FORMAT);
      const specialDatesToday = config.specialDates.filter(findByDate(specialDateKey));
      if (specialDatesToday.length > 0) {
        if (specialDatesToday.some(isEvent)) {
          dayStyles.push(this.styles.eventDay);
        }

        if (specialDatesToday.some(isHoliday)) {
          dayStyles.push(this.styles.weekendDay);
        }
      }

      if (calendarPageExists(currentDay, config)) {
        days.push(
          <Link key={i} src={'#' + dayPageLink(currentDay, config)} style={dayStyles}>
            {currentDay.date()}
          </Link>,
        );
      } else {
        days.push(
          <Text key={i} style={dayStyles}>
            {currentDay.date()}
          </Text>,
        );
      }
    }

    const weekStyles = [this.styles.week];
    if (this.props.highlightMode === HIGHLIGHT_WEEK && weekNumber === getWeekNumber(this.props.date)) {
      weekStyles.push(this.styles.currentWeek);
    }
    return (
      <View key={weekNumber} style={weekStyles}>
        {calendarPageExists(week, config) ? (
          <Link src={'#' + weekOverviewLink(week, config)} style={[day, this.styles.weekNumber]}>
            {weekNumber}
          </Link>
        ) : (
          <Text style={[day, this.styles.weekNumber, this.styles.noPageDay]}>
            {weekNumber}
          </Text>
        )}
        {days}
        {config.isWeekRetrospectiveEnabled && calendarPageExists(week, config) ? (
          <Link src={'#' + weekRetrospectiveLink(week)} style={[day, this.styles.weekRetrospective]}>
            {t('calendar.body.retrospective')}
          </Link>
        ) : (
          <Text style={[day, this.styles.weekRetrospective]}></Text>
        )}
      </View>
    );
  }

  render() {
    return (
      <View style={this.styles.body}>
        {this.renderMonthName()}
        {this.renderWeekdayNames()}
        {this.renderMonth()}
      </View>
    );
  }
}

MiniCalendar.defaultProps = {
  highlightMode: HIGHLIGHT_DAY,
  showArrows: true,
};

MiniCalendar.propTypes = {
  config: PropTypes.instanceOf(PdfConfig).isRequired,
  date: PropTypes.instanceOf(dayjs).isRequired,
  highlightMode: PropTypes.oneOf([HIGHLIGHT_DAY, HIGHLIGHT_WEEK, HIGHLIGHT_NONE]),
  t: PropTypes.func.isRequired,
};

export default withTranslation('pdf')(MiniCalendar);
