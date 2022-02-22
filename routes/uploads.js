const { Router } = require( 'express' );
const { check } = require( 'express-validator' );

const { validarCampos, validarArchivo } = require( '../middlewares' );
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const router = Router();

router.post( '/', validarArchivo, cargarArchivo );

router.put( '/:coleccion/:id',
    [
        validarArchivo,
        check( 'id', 'El Id no es valido' ).isMongoId(),
        check( 'coleccion' ).custom( c => coleccionesPermitidas( c, [ 'usuarios', 'productos' ]) ),
        validarCampos
    ], //actualizarImagen
    actualizarImagenCloudinary
);

router.get( '/:coleccion/:id',
    [
        check( 'id', 'El Id no es valido' ).isMongoId(),
        check( 'coleccion' ).custom( c => coleccionesPermitidas( c, [ 'usuarios', 'productos' ]) ),
        validarCampos
    ], mostrarImagen
);

module.exports = router;