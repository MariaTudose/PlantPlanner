type Action = {
    id: string;
    date: Date;
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
    userEnteredPlantType: string;
};

type RawPlant = Plant & {
    lastWateringDate: string;
    nextWateringDate: string;
};
