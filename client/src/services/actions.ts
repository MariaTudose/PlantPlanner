import axios from 'axios';
const baseUrl = process.env.REACT_APP_API_URL + 'api/actions';

export const getActions = (plantId: string): Promise<Array<Action>> => {
    const request = axios.get(`${baseUrl}/${plantId}`);

    return request.then(response => response.data);
};

export const createActions = (actions: Array<Omit<Action, 'id'>>) => {
    const request = axios.post(baseUrl, actions);

    return request.then(response => response.data);
};
