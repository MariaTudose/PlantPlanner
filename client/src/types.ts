import { ActionType } from './enums';

export type Action = {
    id: string;
    plantId: string;
    date: Date;
    action: ActionType;
};

export type RawAction = Action & {
    date: string;
};

export type Plant = {
    id: string;
    name: string;
    interval: string;
    location: string;
    wateringDiff?: number;
    pictures: string[];
    lastWateringDate: Date;
    nextWateringDate: Date;
    lastFertilizingDate: Date | null;
    userEnteredPlantType: string;
    species: string;
};

export type RawPlant = Plant & {
    lastWateringDate: string;
    nextWateringDate: string;
    lastFertilizingDate: string;
};
