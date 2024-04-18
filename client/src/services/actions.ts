import axios from 'axios';
import { parseISO } from 'date-fns';
import { RawAction, Action } from '../types';

const baseUrl = import.meta.env.VITE_APP_API_URL + 'api/actions';

const convertActionDates = (action: RawAction): Action => ({
    ...action,
    date: parseISO(action.date),
});

export const getActions = (plantId: string): Promise<Action[]> => {
    const request = axios.get(`${baseUrl}/${plantId}`);

    return request.then(response => response.data.map((action: RawAction) => convertActionDates(action)));
};

export const createActions = (actions: Omit<Action, 'id'>[]) => {
    const request = axios.post(baseUrl, actions);

    return request.then(response => response.data);
};

export const deleteAction = (id: string): Promise<Action[]> => {
    const request = axios.delete(`${baseUrl}/${id}`);

    return request.then(response => response.data);
};
