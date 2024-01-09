// routes/tasks.ts
import express, { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import Task, { ITask } from '../models/Task';

const tasksRouter = Router();
const upload = multer({ dest: 'uploads/' }); // Ajusta la carpeta de destino según tus necesidades

const publicPath = path.join(__dirname, 'public'); // Reemplaza 'public' con tu directorio de archivos estáticos

tasksRouter.use(express.urlencoded({ extended: true }));
tasksRouter.use(express.json());
tasksRouter.use(express.static(publicPath));

tasksRouter.route('/create')
    .get(async (req: Request, res: Response) => {
        try {
            // Obtén todas las categorías únicas
            const uniqueCategories = await Task.distinct('category');

            res.render('tasks/create', { uniqueCategories });
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
            res.status(500).send('Error interno del servidor');
        }
    })
    .post(upload.single('image'), async (req: Request, res: Response) => {
        const { title, description, category, quantity, price } = req.body;
        const image = req.file ? req.file.path : undefined; // Obtén la ruta de la imagen si existe

        try {
            if (!title || !description || !category || !quantity || !price) {
                return res.status(400).send('Todos los campos son requeridos');
            }

            const newTask = new Task({ title, description, category, quantity, price, image });
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

            // Obtén todas las tareas
            const tasks = await Task.find();

            // Obtén categorías únicas de todas las tareas
            const uniqueCategories = [...new Set(tasks.map(task => task.category))];

            // Si hay un filtro por categoría, filtra las tareas
            let filteredTasks = tasks;
            if (categoryFilter && categoryFilter !== 'all') {
                filteredTasks = tasks.filter(task => task.category === categoryFilter);
            }

            // Convierte las tareas y las categorías a objetos planos
            const tasksAsPlainObjects = filteredTasks.map(task => task.toObject());

            res.render('tasks/list', {
                tasks: tasksAsPlainObjects,
                selectedCategory: categoryFilter,
                uniqueCategories,
            });
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
            res.sendStatus(204);
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
