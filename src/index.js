import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import objectSupport from 'dayjs/plugin/objectSupport';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

dayjs.extend( isoWeek );
dayjs.extend( objectSupport );
dayjs.extend( updateLocale );
dayjs.extend( utc );

dayjs.updateLocale( 'en', {
	weekStart: 1, // Week starts on Monday
} );

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById( 'root' ),
);
