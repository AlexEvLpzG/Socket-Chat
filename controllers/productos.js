const { response } = require( 'express' );
const { Producto } = require( '../models' );

const obtenerProductos = async( req, res = response ) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query ).populate( 'usuario', 'nombre' ).populate( 'categoria', 'nombre' )
            .skip( Number( desde ) ).limit( Number( limite ) )
    ]);

    res.status(201).json({
        total,
        productos
    });
}

const obtenerProducto = async( req, res ) => {
    const { id } = req.params;

    const productoDB = await Producto.findById( id )
                                        .populate( 'usuario', 'nombre' )
                                        .populate( 'categoria', 'nombre' );

    if( !productoDB.estado ) {
        return res.status(400).json({ msg: 'Producto incorrecta - estado: false' })
    }

    res.status(201).json( productoDB );
}

const crearProducto = async( req, res = response ) => {
    const { estado, usuario, ...body } = req.body;

    body.nombre = body.nombre.toUpperCase();

    let producto = await Producto.findOne({ nombre: body.nombre });

    if( producto ) {
        return res.status(400).json({
            msg: `El Producto con el nombre:"${ producto.nombre }" ya existe`
        });
    }

    const data = {
        nombre: body.nombre,
        usuario: req.usuario._id,
        ...body
    }

    producto = await Producto( data );

    // Todo: Guardar en la DB
    await producto.save();

    res.status(201).json( producto );
}

const actualizarProducto = async( req, res ) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }

    // * Modifica la información del usuario quien lo modifico
    data.usuario = req.usuario._id;

    let productoDB = await Producto.findOne({ nombre: data.nombre });

    if( productoDB ) {
        return res.status(400).json({ msg: `El Producto con el nombre:"${ productoDB.nombre }" ya existe` });
    } 

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true });

    res.status(201).json( producto );
}

const eliminarProducto = async( req, res ) => {
    const { id } = req.params;

    const productoDB = await Producto.findById( id );
    
    if( !productoDB.estado ) {
        return res.status(400).json({ msg: 'El Producto ya ha sido eliminada' });
    }

    const producto = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.status(201).json( producto );
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}