import { differenceInCalendarDays, parseISO } from 'date-fns';

export const groupPlants = plants =>
    plants
        .map(plant => ({
            ...plant,
            wateringDiff: plant.nextWateringDate
                ? differenceInCalendarDays(parseISO(plant.nextWateringDate), Date.now())
                : null,
        }))
        .filter(plant => plant.wateringDiff !== null)
        .reduce(
            (res, plant) => ({
                ...res,
                [plant.wateringDiff]: [...(res[plant.wateringDiff] || []), plant],
            }),
            {}
        );
