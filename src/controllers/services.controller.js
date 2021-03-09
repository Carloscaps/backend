import sql from 'mssql';
import { config } from '../database/connection';

let servicesFunctions = {};

servicesFunctions.getHistoryByClient = (req, res) => {
    try {

        const { id } = req.params;
        
        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .input('id', id)
                    .query(`select s.comentario, sc.fecha_mantencion, sc.fecha_mantencion_realizada
                            from servicioCliente sc inner join servicio s ON sc.servicio_id = s.servicio_id
                            where cliente_id = @id`)
            })
            .then(result => {
                const { recordsets: servicios } = result;
                sql.connect(config)
                    .then(pool => {
                        return pool.request()
                            .input('idm', id)
                            .query(`select s.comentario, sc.fecha_mantencion, sc.fecha_mantencion_realizada
                                from servicioCliente sc inner join servicio s ON sc.servicio_id = s.servicio_id
                                where cliente_id = @idm`)
                    })
                    .then(result => {
                        const { recordsets: mantenciones } = result;

                        return res.status(200).json({servicios: servicios[0], mantenciones: mantenciones[0]});
                    })
                    .catch(error => {
                        return res.status(400).json({
                            msg: 'error al obtener los clientes',
                            error
                        });
                    })
            })
            .catch(error => {
                return res.status(400).json({
                    msg: 'error al obtener los clientes',
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

export default servicesFunctions;
