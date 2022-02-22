const { Categoria, Role, Usuario, Producto } = require( '../models' );
// const Role = require( '../models/role' );
// const Usuario = require( '../models/usuario' );

const esRoleValido = async( rol = '' ) => {
    // * Verificar si el rol existe
    const existeRole = await Role.findOne({ rol });
    if( !existeRole ) {
        throw new Error( `El rol ${ rol } no está registrado en la BD` );
    }
}

const emailExiste = async( correo = '' ) => {
    // * Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });

    if( existeEmail ) {
        throw new Error( `El correo ${ correo } ya está registrado` );
    }
}

const existeUsuarioPorId = async( id ) => {
    // * Verificar si el usuario existe
    const existeUsuario = await Usuario.findById( id );

    if( !existeUsuario ) {
        throw new Error( `El id no existe ${ id }` );
    }
}

const exiteCategoriaId = async( id ) => {
    // * Verifica si la categoria existe
    const existeCategoria = await Categoria.findById( id );

    if( !existeCategoria ) {
        throw new Error( `La categoria con el id:${ id } no exite` );
    }
}

const exiteProductoId = async( id ) => {
    // * Verifica si la el Producto existe
    const existeProducto = await Producto.findById( id );

    if( !existeProducto ) {
        throw new Error( `El Producto con el id:${ id } no exite` );
    }
}

// * Validar colecciones permitidas
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {
    const incluida = colecciones.includes( coleccion );

    if( !incluida ) {
        throw new Error( `La colección ${ coleccion } no es permitida, ${ colecciones }` );
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    exiteCategoriaId,
    exiteProductoId,
    coleccionesPermitidas
}