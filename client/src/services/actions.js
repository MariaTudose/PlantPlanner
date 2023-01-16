import axios from 'axios';
const baseUrl = process.env.REACT_APP_API_URL + 'api/actions';

export const getActions = plantId => {
    const request = axios.get(`${baseUrl}/${plantId}`);

    return request.then(response => response.data).catch(e => console.log('error: ', e));
};

export const createActions = action => {
    const request = axios.post(baseUrl, action);

    return request.then(response => response.data).catch(e => console.log('error: ', e));
};