import express from 'express';
import exphbs, { create } from 'express-handlebars';
import path from 'path';
import indexRoutes from './routes';
import tasksRoutes from './routes/tasks'

class Application {
    app: express.Application;

    constructor() {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }
    settings() {
        this.app.set('port', 3000);
        this.app.set("views", path.join(__dirname, "views"));
        this.app.engine(
          ".hbs",
          create({
            layoutsDir: path.join(this.app.get("views"), "layouts"),
            partialsDir: path.join(this.app.get("views"), "partials"),
            defaultLayout: "main",
            extname: ".hbs",
          }).engine
        );
        this.app.set("view engine", ".hbs");
      }
    


    middlewares() {
        // Agrega tus middlewares aquí
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false})); //para que el servidor entienda el form
    }

    routes() {
        // Define tus rutas aquí
        this.app.use("/", indexRoutes);
        this.app.use('/tasks', tasksRoutes);
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

export default Application;