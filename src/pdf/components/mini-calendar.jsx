import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React from 'react';

class MiniCalendar extends React.Component {
	styles = StyleSheet.create( {
		month: {
			width: '100%',
		},
		week: {
			width: '50%',
			display: 'flex',
			height: '80px',
			flexDirection: 'row',
		},
		day: {
			flexGrow: 1,
			flexShrink: 1,
			flexBasis: 0,
			backgroundColor: 'green',
		},
		link: {
			display: 'block',
			width: '100%',
			padding: '10px',
		},
	} );

	renderHeader() {
		const { day, week } = this.styles;
		const weekdays = dayjs.weekdaysMin();
		const firstDayOfWeek = dayjs.localeData().firstDayOfWeek();
		const correctedWeekdays = [
			...weekdays.slice( firstDayOfWeek ),
			...weekdays.slice( 0, firstDayOfWeek ),
		];
		const daysOfTheWeek = correctedWeekdays.map( ( dayOfTheWeek, index ) => (
			<Text key={ index } style={ day }>
				{dayOfTheWeek}
			</Text>
		) );

		return (
			<View style={ week }>
				<Text style={ day }>W#</Text>
				{daysOfTheWeek}
				<Text style={ day }>Re</Text>
			</View>
		);
	}

	render() {
		const { month, week, day } = this.styles;
		return (
			<View style={ month }>
				{this.renderHeader()}
				<View style={ week }>
					<Text style={ day }></Text>
					<Text style={ day }></Text>
					<Text style={ day }></Text>
					<Link src="#page10" style={ day }>
						1
					</Link>
					<Text style={ day }>2</Text>
					<Text style={ day }>3</Text>
					<Text style={ day }>4</Text>
				</View>
				<View style={ week }>
					<Text style={ day }>5</Text>
					<Text style={ day }>6</Text>
					<Text style={ day }>7</Text>
					<Text style={ day }>8</Text>
					<Text style={ day }>9</Text>
					<Text style={ day }>10</Text>
					<Text style={ day }>11</Text>
				</View>
				<View style={ week }>
					<Text style={ day }>12</Text>
					<Text style={ day }>13</Text>
					<Text style={ day }>14</Text>
					<Text style={ day }>15</Text>
					<Text style={ day }>16</Text>
					<Text style={ day }>17</Text>
					<Text style={ day }>18</Text>
				</View>
				<View style={ week }>
					<Text style={ day }>19</Text>
					<Text style={ day }>20</Text>
					<Text style={ day }>21</Text>
					<Text style={ day }>22</Text>
					<Text style={ day }>23</Text>
					<Text style={ day }>24</Text>
					<Text style={ day }>25</Text>
				</View>
				<View style={ week }>
					<Text style={ day }>26</Text>
					<Text style={ day }>27</Text>
					<Text style={ day }>28</Text>
					<Text style={ day }>29</Text>
					<Text style={ day }>30</Text>
					<Text style={ day }>31</Text>
					<Text style={ day }></Text>
				</View>
			</View>
		);
	}
}

MiniCalendar.propTypes = {
	date: PropTypes.instanceOf( dayjs ).isRequired,
};

export default MiniCalendar;
