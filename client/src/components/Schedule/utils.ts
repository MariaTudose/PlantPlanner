import { differenceInCalendarDays } from 'date-fns';

export const groupPlants = (plants: Array<Plant>) =>
    plants
        .map(plant => ({
            ...plant,
            wateringDiff: differenceInCalendarDays(plant.nextWateringDate, Date.now()),
        }))
        .reduce((res: Record<string, Array<Plant>>, plant) => {
            (res[plant.wateringDiff] = res[plant.wateringDiff] || []).push(plant);
            return res;
        }, {});
