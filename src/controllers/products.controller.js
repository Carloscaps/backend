import sql from 'mssql';
import { config } from '../database/connection';

let productsFunctions = {};

productsFunctions.getProductsByClient = (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw error;
        }

        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .input('cliente', id)
                    .query(`SELECT P.producto_id, p.nom_extintor 
                            FROM producto p INNER JOIN productoCliente pc ON p.producto_id = pc.producto_id
                            WHERE pc.cliente_id = @cliente`)
            })
            .then(result => {
                const { recordsets: products } = result;
                return res.status(200).json(products[0]);
            })
            .catch(error => {
                return res.status(400).json({
                    msg: 'error al obtener los productos',
                    error
                });
            })
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor',
            error
        });
    };
};

productsFunctions.getAgents = (req, res) => {
    try {
        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .query(`SELECT * FROM tipo`)
            })
            .then(result => {
                const { recordsets: tipos } = result;
                return res.status(200).json(tipos[0]);
            })
            .catch(error => {
                return res.status(400).json({
                    msg: 'error al obtener los tipos',
                    error
                });
            })
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor',
            error
        });
    };
};

productsFunctions.newProduct = (req, res) => {
    try {
        req.body = JSON.parse(req.body.data);
        const { tipo, capacidad, fechaFabricacion, fechaUltCarga, fechaUltMantencion } = req.body;

        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .input('capacidad', capacidad)
                    .input('estado', 'true')
                    .input('fechaUltMant', fechaUltMantencion)
                    .input('vencMant', fechaUltMantencion) // sumar un año
                    .input('vencCarga', fechaUltCarga) // sumar 5 años
                    .input('fechaUltCarga', fechaUltCarga)
                    .input('fechaFabri', fechaFabricacion)
                    .input('tipo', tipo)
                    .query(`INSERT INTO producto (cap_extagente, estadoProducto, fecha_utlMant, venc_mant, fecha_ultcarga, fecha_vencarga, fecha_fabricacion, tipo_id)
                        VALUES (@capacidad, @estado, @fechaUltMant, @vencMant, @fechaUltCarga, @vencCarga, @fechaFabri, @tipo)`)
            })
            .then(() => {
                return res.status(201).json({
                    msg: 'Producto registrado exitosamente'
                });
            })
            .catch(error => {
                return res.status(400).json({
                    msg: 'error al registrar el nuevo producto',
                    error
                });
            })

    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor',
            error
        });
    }
};

export default productsFunctions;
