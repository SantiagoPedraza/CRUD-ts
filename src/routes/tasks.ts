// routes/tasks.ts
import { Router, Request, Response } from 'express';
import Task, { ITask } from '../models/Task';

const tasksRouter = Router();

tasksRouter.route('/create')
    .get((req: Request, res: Response) => {
        res.render('tasks/create');
    })
    .post(async (req: Request, res: Response) => {
        const { title, description, category, quantity, price } = req.body;

        try {
            // Añade la validación para el campo 'price'
            if (!title || !description || !category || !quantity || !price) {
                return res.status(400).send('Todos los campos son requeridos');
            }

            const newTask = new Task({ title, description, category, quantity, price });
            await newTask.save();
            res.redirect('/tasks/list');
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            res.status(500).send('Error interno del servidor');
        }
    });

tasksRouter.route('/list')
    .get(async (req: Request, res: Response) => {
        try {
            const { categoryFilter } = req.query;
            let tasks;

            if (categoryFilter) {
                tasks = await Task.find({ category: categoryFilter });
            } else {
                tasks = await Task.find();
            }

            const tasksAsPlainObjects = tasks.map(task => task.toObject());

            res.render('tasks/list', { tasks: tasksAsPlainObjects, selectedCategory: categoryFilter });
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
            res.status(500).send('Error interno del servidor');
        }
    });

tasksRouter.route('/delete/:id')
    .delete(async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await Task.findByIdAndDelete(id);
            res.sendStatus(204); // No Content
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            res.status(500).send('Error interno del servidor');
        }
    });

tasksRouter.route('/edit/:id')
    .get(async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const task = await Task.findById(id).lean();

            if (!task) {
                return res.status(404).send('Tarea no encontrada');
            }

            res.render('tasks/edit', { task });
        } catch (error) {
            console.error('Error al obtener la tarea para editar:', error);
            res.status(500).send('Error interno del servidor');
        }
    })
     .post(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { title, description, category, quantity, price } = req.body;
        await Task.findByIdAndUpdate(id, { title, description, category, quantity, price });
        res.redirect('/tasks/list');
    });

tasksRouter.route('/updateQuantity/:id')
    .put(async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { quantity } = req.query;
            const task = await Task.findByIdAndUpdate(id, { quantity }, { new: true });

            if (!task) {
                return res.status(404).json({ error: 'Tarea no encontrada' });
            }

            return res.json(task.toPlainObject());
        } catch (error) {
            console.error('Error al ajustar la cantidad:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

export default tasksRouter;
