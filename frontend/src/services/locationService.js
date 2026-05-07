import API from './api';

export const searchLocations = (query, type = null) => {
  let url = `/locations/search?q=${encodeURIComponent(query)}`;
  if (type) url += `&type=${type}`;
  return API.get(url);
};