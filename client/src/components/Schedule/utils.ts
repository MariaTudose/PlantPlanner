import { differenceInCalendarDays } from 'date-fns';

export const groupPlants = (plants: Plant[]) =>
    plants
        .map(plant => ({
            ...plant,
            wateringDiff: differenceInCalendarDays(plant.nextWateringDate, Date.now()),
        }))
        .reduce((res: Record<string, Plant[]>, plant) => {
            (res[plant.wateringDiff] = res[plant.wateringDiff] || []).push(plant);
            return res;
        }, {});
