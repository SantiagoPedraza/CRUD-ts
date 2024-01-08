// app.ts
import express from 'express';
import exphbs, { create } from 'express-handlebars';
import path from 'path';
import indexRoutes from './routes';
import tasksRouter from './routes/tasks'; // Cambiado el nombre para evitar conflictos

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
                helpers: {
                    safePropertyAccess: function (obj: any, propertyName: string) {
                        return obj && obj.hasOwnProperty(propertyName) ? obj[propertyName] : '';
                    },
                    ifEqual: function (a: any, b: any, options: any) {
                        if (a === b) {
                            return options.fn(this);
                        } else {
                            return options.inverse(this);
                        }
                    },
                },
            }).engine
        );
        this.app.set("view engine", ".hbs");
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    routes() {
        this.app.use("/", indexRoutes);
        this.app.use('/tasks', tasksRouter);
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

export default Application;
