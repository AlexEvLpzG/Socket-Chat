const url = ( window.location.hostname.includes( 'localhost' ) ) 
            ? 'http://localhost:4000/api/auth/' : 'url de server de producción';
let usuario = null;
let socket  = null;

// * Referencias HTML
const txtUid     = document.querySelector( '#txtUid' );
const txtMensaje = document.querySelector( '#txtMensaje' );
const ulUsuarios = document.querySelector( '#ulUsuarios' );
const ulMensajes = document.querySelector( '#ulMensajes' );
const btnSalir   = document.querySelector( '#btnSalir' );

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
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem( 'token' )
        }
    });

    socket.on( 'connect', () => {
        console.log( 'Socket Online' );
    });

    socket.on( 'disconnect', () => {
        console.log( 'Socket Offline' );
    });

    socket.on( 'recibir-mensajes', () => {

    });

    socket.on( 'usuarios-activos', () => {

    });
    
    socket.on( 'mensaje-privado', () => {
        
    });
}

const main = async() => {
    // * Validar JWT
    await validarJWT();
}

main();