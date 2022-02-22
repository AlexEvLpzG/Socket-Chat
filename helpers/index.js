const dbValidators  = require( './db-validators' );
const generarJwt    = require( './generar-jwt' );
const googleVerify  = require( './google-verify' );
const subirArchivos = require( './subir-archivos' );

module.exports = {
    ...dbValidators,
    ...generarJwt,
    ...googleVerify,
    ...subirArchivos
}