import { differenceInDays } from 'date-fns';
import { getActions } from '../../services/actions';
import placeholder from './placeholder.webp';

export const getPhotoSrc = plant =>
    plant?.pictures.length ? `${process.env.REACT_APP_API_URL}${plant.pictures[0]}.webp` : placeholder;

export const setPlaceholder = e => {
    e.onError = null;
    e.target.src = placeholder;
};

export const weightedAvg = intervals =>
    [0.7, 0.2, 0.1].reduce((acc, weight, i) => {
        return acc + intervals[i] * weight;
    }, 0) || 0;

export const getPrevIntervals = async plantId => {
    const intervals = [];
    const actions = await getActions(plantId);
    let dates = actions.map(action => action.date);
    if (dates.length) {
        dates.sort().reduce((a, b) => {
            intervals.push(differenceInDays(new Date(b), new Date(a)));
            return b;
        });
    }
    return intervals.reverse();
};
