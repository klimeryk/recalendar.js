import dayjs from 'dayjs/esm';
import advancedFormat from 'dayjs/esm/plugin/advancedFormat';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import isoWeek from 'dayjs/esm/plugin/isoWeek';
import localeData from 'dayjs/esm/plugin/localeData';
import objectSupport from 'dayjs/esm/plugin/objectSupport';
import updateLocale from 'dayjs/esm/plugin/updateLocale';
import utc from 'dayjs/esm/plugin/utc';
import weekday from 'dayjs/esm/plugin/weekday';

dayjs.extend( advancedFormat );
dayjs.extend( customParseFormat );
dayjs.extend( isoWeek );
dayjs.extend( localeData );
dayjs.extend( objectSupport );
dayjs.extend( updateLocale );
dayjs.extend( utc );
dayjs.extend( weekday );
