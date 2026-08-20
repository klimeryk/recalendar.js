import React from 'react';
import { withTranslation } from 'react-i18next';

import Configuration from '~/configuration';
import Navigation from '~/navigation';
import PdfConfig from '~/pdf/config';

class Loader extends React.Component {
  componentDidMount() {
    this.setState({ config: new PdfConfig() });
  }

  render() {
    if (!this.state?.config) {
      return null;
    }

    return (
      <>
        <Navigation />
        <Configuration initialState={this.state.config} />
      </>
    );
  }
}

export default withTranslation(['app', 'config'])(Loader);
