const jwt = require( 'jsonwebtoken' );

const generarJWT = ( uid = '' ) => {
    return new Promise(( resolve, reject ) => {
        const payload = { uid }; // * para almacenar la información
        
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '4h',
        }, ( error, token ) => {
            if( error ) {
                console.log( error );
                reject( 'Nose pudo generar el token' );
            } else {
                resolve( token );
            }
        });
    });
}

module.exports = { generarJWT }