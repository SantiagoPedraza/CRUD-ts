
import mongoose, { Document } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description: string;
    category: string;
    quantity: number;
    price: number;
    imageUrl?: string; 
}

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false, 
    },
});

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
