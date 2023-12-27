import mongoose from 'mongoose';

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ts-app', {
        
        });
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
    }
}

export default connect;
