import sql from 'mssql';
import { config } from '../database/connection';

let productsFunctions = {};

productsFunctions.getProductsByClient = (req, res) => {
    try {
        const { id, view } = req.params;

        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .input('cliente', id)
                    .query(`select p.producto_id, t.nom_agente,p.cap_extagente,DATEDIFF (DAY, SYSDATETIME() , DATEADD(year, 1, p.fecha_utlMant)) as dias
                            from producto p inner join tipo t on p.tipo_id = t.tipo_id
                            inner join productoCliente pc on pc.producto_id = p.producto_id
                            WHERE pc.cliente_id = @cliente`)
            })
            .then(result => {
                const { recordsets: products } = result;
                const data = products[0].map(value => {
                    if (view == 'mantencion'){
                        return {
                            name: `extintor: ${value.nom_agente}, ${value.cap_extagente}kg`,
                            id: value.producto_id
                        }
                    } else {
                        return {
                            name: `extintor: ${value.nom_agente}, ${value.cap_extagente}kg, dias sgte mantención: ${value.dias}`,
                            id: value.producto_id
                        }
                    }
                })
                return res.status(200).json(data);
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
        const { tipo, capacidad, fechaFabricacion, fechaUltCarga, fechaUltMantencion, idCliente } = req.body;

        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .input('capacidad', capacidad)
                    .input('estado', 'true')
                    .input('fechaUltMant', fechaUltMantencion)
                    .input('vencMant', fechaUltMantencion)
                    .input('vencCarga', fechaUltCarga)
                    .input('fechaUltCarga', fechaUltCarga)
                    .input('fechaFabri', fechaFabricacion)
                    .input('tipo', tipo)
                    .query(`INSERT INTO producto (cap_extagente, estadoProducto, fecha_utlMant, venc_mant, fecha_ultcarga, fecha_vencarga, fecha_fabricacion, tipo_id)
                        OUTPUT INSERTED.producto_id
                        VALUES (@capacidad, @estado, @fechaUltMant,  DATEADD(year, 1, @vencMant), DATEADD(year, 5, @fechaUltCarga), @vencCarga, @fechaFabri, @tipo)`)
            })
            .then((data) => {
                const { producto_id } = data.recordset[0];
                sql.connect(config)
                    .then(pool => {
                        return pool.request()
                            .input('producto', producto_id)
                            .input('cliente', idCliente)
                            .query(`INSERT INTO productoCliente (producto_id, cliente_id) VALUES (@producto, @cliente)`)
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

productsFunctions.detailProduct = (req, res) => {
    try {
        const { id } = req.params;
        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .input('id', id)
                    .query(`select p.num_cert, t.nom_agente, p.cap_extagente, p.fecha_fabricacion, p.fecha_ultcarga, p.fecha_vencarga, p.fecha_utlMant 
                            from producto P inner join tipo t on p.tipo_id = t.tipo_id
                            where p.producto_id = @id`)
            })
            .then(result => {
                const { recordsets: producto } = result;
                return res.status(200).json(producto[0]);
            })
            .catch(error => {
                return res.status(400).json({
                    msg: 'error al obtener los detalles del producto',
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

export default productsFunctions;
