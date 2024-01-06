// models/Task.ts
import { Schema, model, Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description: string;
    toPlainObject: () => Record<string, any>; // Definimos el tipo del método
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
});

// Agregamos un método toPlainObject al esquema
taskSchema.methods.toPlainObject = function (): Record<string, any> {
    const { _id, ...object } = this.toObject();
    object._id = _id.toString();
    return object;
};

export default model<ITask>('Task', taskSchema);
