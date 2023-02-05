import { differenceInCalendarDays, parseISO } from 'date-fns';

export const groupPlants = plants =>
    plants
        .filter(plant => plant.wateringDiff !== null)
        .map(plant => ({
            ...plant,
            wateringDiff: differenceInCalendarDays(parseISO(plant.nextWateringDate), Date.now()),
        }))
        .reduce(
            (res, plant) => ({
                ...res,
                [plant.wateringDiff]: [...(res[plant.wateringDiff] || []), plant],
            }),
            {}
        );
