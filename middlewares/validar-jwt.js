const { response, request } = require('express');
const jwt = require( 'jsonwebtoken' );

const Usuario = require( '../models/usuario' );

const validarJWT = async( req = request, res = response, next ) => {
    const token = req.header( 'x-token' );

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRET_JWT_SEED );

        const usuario = await Usuario.findById( uid );

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en la DB'
            });
        }

        // * Verificar si el uid tiene el estado en true
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado: false'
            });
        }

        req.usuario = usuario;
        req.uid = uid;

        next();
    } catch (error) {
        console.log( error );
        res.status(401).json({
            msg: 'Token np válido'
        });
    }
}

module.exports = { validarJWT }