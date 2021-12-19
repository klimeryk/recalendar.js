import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';
import localeData from 'dayjs/plugin/localeData';
import objectSupport from 'dayjs/plugin/objectSupport';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend( advancedFormat );
dayjs.extend( customParseFormat );
dayjs.extend( isoWeek );
dayjs.extend( localeData );
dayjs.extend( objectSupport );
dayjs.extend( updateLocale );
dayjs.extend( utc );
dayjs.extend( weekday );
