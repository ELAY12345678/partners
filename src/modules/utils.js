import dayjs from 'dayjs';
import 'dayjs/locale/es';
import qs from 'qs';

dayjs.locale('es'); // usar la configuración regional española globalmente

export const formatDate = date => dayjs(date).format('MMMM DD, YYYY ');

// algolia

export const createURL = state => `?${qs.stringify(state)}`;

export const searchStateToUrl = (location, searchState) =>
  searchState ? `${location.pathname}${createURL(searchState)}` : '';

export const urlToSearchState = ({search}) => qs.parse(search.slice(1));
