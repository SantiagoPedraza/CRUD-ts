
import App from './app';
import Database from './database';

const databaseInstance = Database.getInstance();
databaseInstance.connect();

const app = new App();
app.start();
