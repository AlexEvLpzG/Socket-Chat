const { Socket } = require( 'socket.io' );
const { comprobarJWT } = require( '../helpers' );
const { ChatMensajes } = require( '../models' );

const chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket(), io ) => {
    const usuario = await comprobarJWT( socket.handshake.headers['x-token'] );

    if( !usuario ) {
        return socket.disconnect();
    }

    // * Agregar el usuario conectado
    chatMensajes.conectarUsuario( usuario );
    io.emit( 'usuarios-activos',     chatMensajes.usuariosArr );
    socket.emit( 'recibir-mensajes', chatMensajes.ultimos10 );

    // * Conectarlo a una Sala especial.
    socket.join( usuario.id ); //* Global, socket.id, usuario.id

    // * Limpiar los usuarios cuando alguien se desconecta
    socket.on( 'disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit( 'usuarios-activos', chatMensajes.usuariosArr );
    });

    // * Enviar mensaje
    socket.on( 'enviar-mensaje', ({ uid, mensaje }) => {
        if( uid ) {
            // * Mensaje privado
            socket.to( uid ).emit( 'mensaje-privado', { de: usuario.nombre, mensaje });
        } else {
            chatMensajes.enviarMensajes( usuario.uid, usuario.nombre, mensaje );
            io.emit( 'recibir-mensajes', chatMensajes.ultimos10 )
        }
    });
}

module.exports = {
    socketController
}