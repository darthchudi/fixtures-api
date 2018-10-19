import qs from 'qs';
/**
 * Parses a HTTP Query object to a proper JSON
 * object for DB lookups
 */

export default (query: any) => {
  //Stringify the query first in order normalize it
  const options = { allowDots: true };
  const stringified = qs.stringify(query, options);
  const parsed = qs.parse(stringified, options);
  return parsed;
};
