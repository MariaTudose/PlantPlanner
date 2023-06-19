import { Schema, model } from 'mongoose';

export interface IAction {
    _id: string;
    plantId: string;
    action: string;
    date: string;
}

const actionSchema = new Schema<IAction>({
    _id: String,
    plantId: String, //{ type: String, ref: 'Plant' },
    action: String,
    date: String,
});

actionSchema.set('toJSON', {
    transform: (_, schema) => {
        schema.id = schema._id;
        delete schema._id;
    },
});

export default model<IAction>('Action', actionSchema);
