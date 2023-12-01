import { Schema, model } from 'mongoose';

export interface IPlant {
    _id: string;
    name: string;
    notes: string;
    interval: number;
    location: string;
    pictures: string[];
    isDeleted: boolean;
    updatedAt: String;
    createdAt: String;
    plantSpeciesId: string;
    acquisitionDate: string;
    lastWateringDate: string;
    nextWateringDate: string;
    lastFertilizingDate: string;
    userEnteredPlantType: string;
}

const plantSchema = new Schema<IPlant>({
    _id: String,
    name: String,
    notes: String,
    interval: Number,
    location: String,
    pictures: Array,
    isDeleted: Boolean,
    updatedAt: String,
    createdAt: String,
    plantSpeciesId: String,
    acquisitionDate: String,
    lastWateringDate: String,
    nextWateringDate: String,
    lastFertilizingDate: String,
    userEnteredPlantType: String,
});

plantSchema.set('toJSON', {
    transform: (_, plant) => {
        plant.id = plant._id;
        delete plant._id;
    },
});

export default model<IPlant>('Plant', plantSchema);
