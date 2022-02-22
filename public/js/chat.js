const url = ( window.location.hostname.includes( 'localhost' ) ) 
            ? 'http://localhost:4000/api/auth/' : 'url de server de producción';
let usuario = null;
let socket  = null;

// * Validar el token del localStrorage
const validarJWT = async() => {
    const token = localStorage.getItem( 'token' ) || '';

    if( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error( 'No hay token en el servidor' );
    }

    const response = await fetch( url, {
        headers: { 'x-token': token }
    });
    
    const { usuario: userDB, token: tokenDB } = await response.json();
    // * Renovar token
    localStorage.setItem( 'token', tokenDB );
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
}

const conectarSocket = async() => {
    const socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem( 'token' )
        }
    });
}

const main = async() => {
    // * Validar JWT
    await validarJWT();
}

main();