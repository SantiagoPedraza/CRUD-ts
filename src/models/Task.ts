// models/Task.ts

import { Schema, model } from 'mongoose';

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        lowercase: true // Corregí el nombre del atributo "lowecase" a "lowercase"
    },
    description: {
        type: String,
        required: true,
        lowercase: true // Corregí el nombre del atributo "lowecase" a "lowercase"
    }
});

export default model('Task', TaskSchema);
