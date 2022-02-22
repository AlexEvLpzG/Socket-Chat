const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { login, googleSignIn, renovarToken } = require( '../controllers/auth' );
const { validarJWT } = require( '../middlewares' );
const { validarCampos } = require( '../middlewares/validar-campos' );

const router = Router();

router.post( '/login', 
    [
        check('correo', 'El correo es obligatorio' ).isEmail(),
        check('password', 'La contraseña es obligatorio' ).not().isEmpty(),
        validarCampos
    ],
    login 
);

router.post( '/google', 
    [
        check('id_token', 'El id_token es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    googleSignIn
);

router.get( '/', validarJWT, renovarToken );

module.exports = router;