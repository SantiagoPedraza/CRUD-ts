import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import indexRoutes from './routes';

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
        this.app.set('views', path.join(__dirname, '..', 'views'));


        const hbs = exphbs.create({
            layoutsDir: path.join(this.app.get('views'), 'layouts'),
            partialsDir: path.join(this.app.get('views'), 'partials'),
            defaultLayout: 'main',
            extname: '.hbs'
        });

        this.app.engine('.hbs', hbs.engine);
        this.app.set('view engine', '.hbs');
    }

    middlewares() {
        // Agrega tus middlewares aquí
    }

    routes() {
        // Define tus rutas aquí
        this.app.use(indexRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

export default Application;
