import { differenceInCalendarDays } from 'date-fns';
import { ActionType } from '../../enums';

export const weightedAvg = (intervals: Array<number>) =>
    [0.7, 0.2, 0.1].reduce((acc, weight, i) => {
        return acc + intervals[i] * weight;
    }, 0) || 0;

export const sortActions = (actions: Action[]) =>
    actions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const parseActions = (actions: Action[]) => {
    const waterActions = sortActions(actions).filter(action => action.action === ActionType.WATER);

    const intervals: Array<number> = [];
    waterActions.reduce((a, b) => {
        intervals.push(differenceInCalendarDays(new Date(a.date), new Date(b.date)));
        return b;
    });

    return intervals;
};
