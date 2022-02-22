const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { exiteCategoriaId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

/*
* /api/categorias
*    
*/

// ? Obtener todas las categorias - public
router.get( '/', obtenerCategorias );

// ? Obtener categoria por el id - publico
router.get( '/:id', 
    [
        check( 'id', 'No es un ID válido' ).isMongoId(),
        check( 'id' ).custom( exiteCategoriaId ),
        validarCampos
    ], obtenerCategoria
);

// ? Crear categoria - Privado - Cualquiera con un token válido
router.post( '/', 
    [ 
        validarJWT,
        check( 'nombre', 'El nombre es obligatorio' ).not().isEmpty(),
        validarCampos
    ], crearCategoria
);

// ? Actualizar categoria - Privado - Cualquiera con un token válido
router.put( '/:id', 
    [
        validarJWT,
        check( 'nombre', 'El nuevo nombre es obligatorio' ).not().isEmpty(),
        check( 'id', 'No es un ID válido' ).isMongoId(),
        check( 'id' ).custom( exiteCategoriaId ),
        validarCampos
    ], actualizarCategoria
);

// ? Borrar categoria - Solo con permiso de administrador
router.delete( '/:id', 
    [
        validarJWT,
        esAdminRole,
        check( 'id', 'No es un ID válido' ).isMongoId(),
        check( 'id' ).custom( exiteCategoriaId ),
        validarCampos
    ], eliminarCategoria
);

module.exports = router;