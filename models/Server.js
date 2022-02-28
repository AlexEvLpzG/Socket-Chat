const express = require( 'express' );
const cors = require( 'cors' );
const fileUpload = require( 'express-fileupload' );

const { dbConnection } = require( '../database/config' );
const { socketController } = require( '../sockets/socketController' );

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.port;
        this.server = require( 'http' ).createServer( this.app );
        this.io = require( 'socket.io' )( this.server );

        this.paths = {
            auth:      '/api/auth',
            buscar:    '/api/buscar',
            categoria: '/api/categorias', 
            producto:  '/api/productos', 
            usuario:   '/api/usuarios',    
            uploads:   '/api/uploads'   
        }

        // * Conectar a base de datos
        this.conectarDB();

        // * Middlewares
        this.middlewares();

        // * Rutas de la applicación
        this.routes();

        // * Sockets
        this.sockets();
    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // * Cors
        this.app.use( cors() );

        // * Lectura y parseo del body
        this.app.use( express.json() );

        // * Directorio Público
        this.app.use( express.static( 'public' ) );

        // * FileUpload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles: true,
            tempFileDir: '',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use( this.paths.auth, require( '../routes/auth' ) );
        this.app.use( this.paths.buscar, require( '../routes/buscar' ) );
        this.app.use( this.paths.categoria, require( '../routes/categorias' ) );
        this.app.use( this.paths.producto, require( '../routes/productos' ) );
        this.app.use( this.paths.usuario, require( '../routes/usuarios' ) );
        this.app.use( this.paths.uploads, require( '../routes/uploads' ) );
    }

    sockets() {
        this.io.on( 'connection', ( socket ) => socketController( socket, this.io ) );
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log( 'Servidor corriendo en el puerto:', this.port );
        });
    }
}

module.exports = Server;