import API from './api';

export const getActiveAlerts = () => API.get('/alerts/active');
export const getAlertHistory = (page = 1) => API.get(`/alerts/history?page=${page}`);