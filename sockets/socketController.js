const { Socket } = require( 'socket.io' );
const { comprobarJWT } = require( '../helpers' );

const socketController = async( socket = new Socket(), io ) => {
    const usuario = await comprobarJWT( socket.handshake.headers['x-token'] );

    if( !usuario ) {
        return socket.disconnect();
    }

}

module.exports = {
    socketController
}