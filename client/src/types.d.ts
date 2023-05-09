type Action = {
    id: string;
    plantId: string;
    date: Date;
    action: ActionType;
};

type Plant = {
    id: string;
    name: string;
    interval: string;
    location: string;
    wateringDiff?: number;
    pictures: Array<string>;
    lastWateringDate: Date;
    nextWateringDate: Date;
    lastFertilizingDate: Date | null;
    userEnteredPlantType: string;
};

type RawPlant = Plant & {
    lastWateringDate: string;
    nextWateringDate: string;
    lastFertilizingDate: string;
};
