import PropTypes from 'prop-types';
import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const UPDATE_INTERVAL = 700;

class PdfProgress extends React.Component {
	state = {
		elapsedTime: 0,
	};

	componentDidMount() {
		this.intervalId = setInterval( this.updateProgress, UPDATE_INTERVAL );
	}

	componentWillUnmount() {
		clearInterval( this.intervalId );
	}

	updateProgress = () => {
		this.setState( { elapsedTime: this.state.elapsedTime + UPDATE_INTERVAL } );
	};

	render() {
		const progress = 100 * ( this.state.elapsedTime / this.props.expectedTime );
		return <ProgressBar animated now={ progress } />;
	}
}

PdfProgress.propTypes = {
	expectedTime: PropTypes.number.isRequired,
};

export default PdfProgress;
