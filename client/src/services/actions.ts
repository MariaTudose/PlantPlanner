import axios from 'axios';
import { parseISO } from 'date-fns';
const baseUrl = process.env.REACT_APP_API_URL + 'api/actions';

const convertActionDates = (action: RawAction): Action => ({
    ...action,
    date: parseISO(action.date),
});

export const getActions = (plantId: string): Promise<Array<Action>> => {
    const request = axios.get(`${baseUrl}/${plantId}`);

    return request.then(response => response.data.map((action: RawAction) => convertActionDates(action)));
};

export const createActions = (actions: Array<Omit<Action, 'id'>>) => {
    const request = axios.post(baseUrl, actions);

    return request.then(response => response.data);
};
