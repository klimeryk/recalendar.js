import { Link, Page, StyleSheet, View } from '@react-pdf/renderer';
import dayjs from 'dayjs/esm';
import PropTypes from 'prop-types';
import React from 'react';

import Itinerary from '~/pdf/components/itinerary';
import PdfConfig from '~/pdf/config';
import { yearNotesLink, yearOverviewLink } from '~/pdf/lib/links';
import { content, pageStyle } from '~/pdf/styles';
import { splitItemsByPages } from '~/pdf/utils';

class YearNotesPage extends React.Component {
  styles = StyleSheet.create(
    Object.assign(
      {},
      {
        content,
        page: pageStyle(this.props.config),
        year: {
          flexGrow: 0,
          fontSize: 55,
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'black',
          textDecoration: 'none',
          justifyContent: 'center',
        },
      },
    ),
  );

  render() {
    const { config, date } = this.props;
    const itemsByPage = splitItemsByPages(config.yearNotesItinerary);
    return (
      <>
        <Page id={yearNotesLink(date)} size={config.pageSize} dpi={config.dpi}>
          <View style={this.styles.page}>
            <Link src={'#' + yearOverviewLink()} style={this.styles.year}>
              {date.format('YYYY')}
            </Link>
            <View style={this.styles.content}>
              <Itinerary date={date} items={itemsByPage[0]} config={config} />
            </View>
          </View>
        </Page>
        {itemsByPage.slice(1).map((items, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static pagination, never reordered
          <Page key={index} size={config.pageSize} dpi={config.dpi}>
            <View style={this.styles.page}>
              <Itinerary date={date} items={items} config={config} />
            </View>
          </Page>
        ))}
      </>
    );
  }
}

YearNotesPage.propTypes = {
  config: PropTypes.instanceOf(PdfConfig).isRequired,
  date: PropTypes.instanceOf(dayjs).isRequired,
};

export default YearNotesPage;
