import { Schema, model } from 'mongoose';

export interface IPlant {
    _id: string;
    name: string;
    interval: number;
    location: string;
    pictures: string[];
    isDeleted: boolean;
    updatedAt: String;
    createdAt: String;
    acquisitionDate: string;
    lastWateringDate: string;
    nextWateringDate: string;
    lastFertilizingDate: string;
    userEnteredPlantType: string;
    species: string;
    needsFertilizer: boolean;
}

const plantSchema = new Schema<IPlant>({
    _id: String,
    name: String,
    interval: Number,
    location: String,
    pictures: Array,
    isDeleted: Boolean,
    updatedAt: String,
    createdAt: String,
    acquisitionDate: String,
    lastWateringDate: String,
    nextWateringDate: String,
    lastFertilizingDate: String,
    userEnteredPlantType: String,
    species: String,
    needsFertilizer: Boolean,
});

plantSchema.set('toJSON', {
    transform: (_, plant) => {
        plant.id = plant._id;
        delete plant._id;
    },
});

export default model<IPlant>('Plant', plantSchema);
