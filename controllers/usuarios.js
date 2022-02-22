const { response, request } = require( 'express' );
const bcryptjs = require( 'bcryptjs' );

const Usuario = require( '../models/usuario' );

const crearUsuario = async( req = request, res = response ) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // * Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // * Guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const actualizarUsuario = async( req = request, res = response ) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // Todo: Validar contra la base de datos
    if( password ) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json({
        usuario
    });
}

const obtenerUsuarios = async( req = request, res = response ) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    
    // const usuarios = await Usuario.find( query ).skip( Number( desde ) ).limit( Number( limite ) );
    // const total = await Usuario.countDocuments( query );

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query ).skip( Number( desde ) ).limit( Number( limite ) )
    ]);

    res.json({
        total,
        usuarios
    });
}

const eliminarUsuario = async( req = request, res = response ) => {
    const { id } = req.params;
    // const uid = req.uid;

    // Todo eliminarlo fisicamente
    // const usuario = await Usuario.findByIdAndDelete( id );
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });
    // const usuarioAutenticado = req.usuario;

    res.json( usuario );
}

module.exports = {
    crearUsuario,
    actualizarUsuario,
    obtenerUsuarios,
    eliminarUsuario
}