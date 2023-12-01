import axios from 'axios';
import { parseISO } from 'date-fns';
const baseUrl = import.meta.env.VITE_APP_API_URL + 'api/plants';

const convertPlantDates = (plant: RawPlant): Plant => ({
    ...plant,
    lastWateringDate: parseISO(plant.lastWateringDate),
    nextWateringDate: parseISO(plant.nextWateringDate),
    lastFertilizingDate: plant.lastFertilizingDate ? parseISO(plant.lastFertilizingDate) : null,
});

export const getAllPlants = (): Promise<Plant[]> => {
    const request = axios.get<RawPlant[]>(baseUrl);

    return request.then(response => response.data.map((plant: RawPlant) => convertPlantDates(plant)));
};

export const updatePlant = (id: string, plant: Partial<Plant>) => {
    const request = axios.put<RawPlant>(`${baseUrl}/${id}`, plant);

    return request.then(response => convertPlantDates(response.data));
};

export const updatePlants = (plants: Partial<Plant>[]) => {
    const request = axios.put<RawPlant[]>(baseUrl, plants);

    return request.then(response => response.data.map((plant: RawPlant) => convertPlantDates(plant)));
};
