import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import React from 'react';

class RecalendarPdf extends React.Component {
	styles = StyleSheet.create({
		page: {
			flexDirection: 'row',
			backgroundColor: '#E4E4E4',
		},
		section: {
			margin: 10,
			padding: 10,
			flexGrow: 1,
		},
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
	});

	renderCalendar() {
		return (
			<View style={styles.month}>
				<View style={styles.week}>
					<Text style={styles.day}></Text>
					<Text style={styles.day}></Text>
					<Text style={styles.day}></Text>
					<Link src="#page10" style={styles.day}>
						1
					</Link>
					<Text style={styles.day}>2</Text>
					<Text style={styles.day}>3</Text>
					<Text style={styles.day}>4</Text>
				</View>
				<View style={styles.week}>
					<Text style={styles.day}>5</Text>
					<Text style={styles.day}>6</Text>
					<Text style={styles.day}>7</Text>
					<Text style={styles.day}>8</Text>
					<Text style={styles.day}>9</Text>
					<Text style={styles.day}>10</Text>
					<Text style={styles.day}>11</Text>
				</View>
				<View style={styles.week}>
					<Text style={styles.day}>12</Text>
					<Text style={styles.day}>13</Text>
					<Text style={styles.day}>14</Text>
					<Text style={styles.day}>15</Text>
					<Text style={styles.day}>16</Text>
					<Text style={styles.day}>17</Text>
					<Text style={styles.day}>18</Text>
				</View>
				<View style={styles.week}>
					<Text style={styles.day}>19</Text>
					<Text style={styles.day}>20</Text>
					<Text style={styles.day}>21</Text>
					<Text style={styles.day}>22</Text>
					<Text style={styles.day}>23</Text>
					<Text style={styles.day}>24</Text>
					<Text style={styles.day}>25</Text>
				</View>
				<View style={styles.week}>
					<Text style={styles.day}>26</Text>
					<Text style={styles.day}>27</Text>
					<Text style={styles.day}>28</Text>
					<Text style={styles.day}>29</Text>
					<Text style={styles.day}>30</Text>
					<Text style={styles.day}>31</Text>
					<Text style={styles.day}></Text>
				</View>
			</View>
		);
	}

	renderPage(index) {
		return (
			<Page id={'page' + index} size="A4" style={styles.page}>
				{this.renderCalendar()}
			</Page>
		);
	}

	renderCalendar() {
		const pageList = [];
		for (let i = 0; i < 20; i++) {
			pageList.push(this.renderPage(i));
		}
		return pageList;
	}

	render() {
		return <Document>{this.renderCalendar()}</Document>;
	}
}

export default RecalendarPdf;
