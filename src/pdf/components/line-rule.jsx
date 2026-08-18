import { Canvas } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import React from 'react';

class LineRule extends React.PureComponent {
	paint = ( painter, availableWidth = 0 ) => {
		const { color, rule, marks } = this.props.stroke;
		painter.strokeColor( color );
		if ( rule ) {
			this.paintRule( painter, availableWidth, rule );
		}

		if ( marks ) {
			this.paintMarks( painter, availableWidth, marks );
		}
	};

	paintRule( painter, availableWidth, rule ) {
		painter
			.lineWidth( rule.width )
			.moveTo( 0, rule.y )
			.lineTo( availableWidth, rule.y )
			.stroke();
	}

	paintMarks( painter, availableWidth, marks ) {
		const { width, y, offset, spacing, dash, linecap, limit } = marks;
		const lastMark = availableWidth - limit;
		if ( lastMark < offset ) {
			return;
		}

		const end =
			offset + Math.floor( ( lastMark - offset ) / spacing ) * spacing + dash[ 0 ];
		painter
			.lineWidth( width )
			.lineCap( linecap || 'butt' )
			.dash( dash )
			.moveTo( offset, y )
			.lineTo( end, y )
			.stroke();
	}

	render() {
		const { stroke } = this.props;
		if ( ! stroke ) {
			return null;
		}

		return (
			<Canvas
				style={ {
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					height: stroke.height,
				} }
				paint={ this.paint }
			/>
		);
	}
}

LineRule.propTypes = {
	stroke: PropTypes.object,
};

export default LineRule;
