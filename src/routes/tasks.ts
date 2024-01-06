// routes/taskRoutes.ts

import { Router, Request, Response } from 'express';
import Task from '../models/Task';

const router = Router();

router.route('/create')
    .get((req: Request, res: Response) => {
        res.render('tasks/create'); // Asegúrate de que la vista 'tasks/create' exista
    })
    .post(async (req: Request, res: Response) => {
        const { title, description } = req.body;
        const newTask = new Task({ title, description });
        await newTask.save();
        res.send('Saved');
    });

router.route('/list')
    .get(async (req: Request, res: Response) => {
        const tasks = await Task.find();
        console.log(tasks); // Asegúrate de que estés viendo las tareas en la consola
        res.render('tasks/list', { tasks });
    });

export default router;
