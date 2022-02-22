const { response } = require( 'express' );
const { status } = require('express/lib/response');
const { Categoria } = require( '../models' );

const obtenerCategorias = async( req, res = response ) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query ).populate( 'usuario', 'nombre' )
            .skip( Number( desde ) ).limit( Number( limite ) )
    ]);

    res.status(201).json({
        total,
        categorias
    });
} 

const obtenerCategoria = async( req, res = response ) => {
    const { id } = req.params;

    const categoria = await Categoria.findById( id ).populate( 'usuario', 'nombre' );

    if( !categoria.estado ) {
        return res.json(400).json({ msg: 'Categoria incorrecta - estado: false' });
    }

    res.status(201).json( categoria );
}

const crearCategoria = async( req, res = response ) => {
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ) {
        return res.status( 400 ).json({
            msg: `La categoria ${ categoriaDB.nombre } que intenta agregar ya existe` 
        });
    }

    // Todo: Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    // Todo: Guardar en la DB
    await categoria.save();

    res.status(201).json( categoria );
}

const actualizarCategoria = async( req, res = response ) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();

    // * Modifica la información del usuario quien lo modifico
    data.usuario = req.usuario._id;

    let categoria = await Categoria.findOne({ nombre: data.nombre });

    if( categoria ) {
        return res.status(400).json({ msg: `Error ya existe una categoria con el nombre ${ data.nombre }` });
    }

    categoria = await Categoria.findByIdAndUpdate( id, data, { new: true });
    
    res.status(201).json( categoria );
}

const eliminarCategoria = async( req, res = response ) => {
    const { id } = req.params;

    let categoria = await Categoria.findById( id );
    
    if( !categoria.estado ) {
        return res.status(400).json({ msg: 'La categoria ya ha sido eliminada' });
    }

    categoria = await Categoria.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.status(201).json( categoria );
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
}