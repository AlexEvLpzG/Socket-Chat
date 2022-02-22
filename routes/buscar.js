const { Router } = require( 'express' );
const { buscar } = require( '../controllers/buscar' );

const router = Router();

/*
* /api/buscar/:colección/:termino
*    
*/

router.get( '/:coleccion/:termino', buscar );

module.exports = router;