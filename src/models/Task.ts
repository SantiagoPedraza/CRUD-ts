// models/Task.ts
import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description: string;
    category: string;
    quantity: number;
    price: number; // Agrega el campo price
    toPlainObject: () => Record<string, any>;
}

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
        lowercase: true,
    },
    category: {
        type: String,
        required: true,
        lowercase: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number, // Tipo de dato para el precio
        required: true, // Indica que el precio es obligatorio
    },
});

taskSchema.methods.toPlainObject = function (): Record<string, any> {
    const { _id, ...object } = this.toObject();
    object._id = _id.toString();
    return object;
};

export default model<ITask>('Task', taskSchema);
