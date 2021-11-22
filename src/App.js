import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import React from 'react';

import RecalendarPdf from 'pdf/recalendar';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	return (
		<div className="App">
			<PDFViewer width="100%" height="600px">
				<RecalendarPdf />
			</PDFViewer>
			<PDFDownloadLink document={ <RecalendarPdf /> } fileName="somename.pdf">
				{( { blob, url, loading, error } ) => ( loading ? 'Loading document...' : 'Download now!' )}
			</PDFDownloadLink>
		</div>
	);
}

export default App;
