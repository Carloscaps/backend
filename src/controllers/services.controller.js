import sql from 'mssql';
import { config } from '../database/connection';
import { sendMail } from '../middleware/mailer';

let servicesFunctions = {};

servicesFunctions.getHistoryByClient = (req, res) => {
    try {

        const { id } = req.params;

        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .input('id', id)
                    .query(`select s.comentario as nombre, sc.fecha_mantencion as solicitud, sc.fecha_mantencion_realizada as realizada
                            from servicioCliente sc inner join servicio s ON sc.servicio_id = s.servicio_id
                            where cliente_id = @id`)
            })
            .then(result => {
                const { recordsets: servicios } = result;
                sql.connect(config)
                    .then(pool => {
                        return pool.request()
                            .input('idm', id)
                            .query(`select m.servicio as nombre, ms.fecha_solicitada as solicitud, ms.fecha_hecha as realizada
                                    from mantencionEstado ms inner join mantencion m On ms.mantencion_id = m.mantencion_id
                                        inner join productoCliente pc on pc.producto_id = m.producto_id
                                    where pc.cliente_id = @idm`)
                    })
                    .then(result => {
                        const { recordsets: mantenciones } = result;

                        const response = servicios[0].concat(mantenciones[0]);

                        return res.status(200).json(response);
                    })
                    .catch(error => {
                        return res.status(400).json({
                            msg: 'error al obtener los datos',
                            error
                        });
                    })
            })
            .catch(error => {
                return res.status(400).json({
                    msg: 'error al obtener los datos',
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

servicesFunctions.sendMail = (req, res) => {
    try {
        req.body = JSON.parse(req.body.data);
        const { to } = req.body;
        sendMail(to)
            .then(() => {
                return res.status(200).json({ msg: 'Solicitud enviada exitosamente' });
            })
            .catch(err => {
                return res.status(400).json({
                    msg: 'error al enviar la solicitud',
                    err
                });
            })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error en el servidor',
            error
        });
    }
};

export default servicesFunctions;
