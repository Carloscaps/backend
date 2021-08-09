import sql from 'mssql';
import { config } from '../database/connection';
import { sendMail, sendMailWilug, sendMailContactenos, sendMailFormulario } from '../middleware/mailer';

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
        const { text, to } = req.body;
        sendMailWilug(text, to)
            .then(() => {
                sendMail(to)
                .then(() => {
                    return res.status(200).json({ msg: 'Solicitud enviada exitosamente' });
                })
                .catch(err => {
                    console.log(err)
                    return res.status(400).json({
                        msg: 'error al enviar la solicitud',
                        err
                    });
                })
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    msg: 'error al enviar la solicitud',
                    err
                });
            })
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor',
            error
        });
    }
};

servicesFunctions.sendMailContacto = (req, res) => {
    try {
        req.body = JSON.parse(req.body.data);
        const { email_cliente, msg, nombre_comuna } = req.body;
        sendMailContactenos(email_cliente, msg, nombre_comuna)
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
        return res.status(500).json({
            message: 'Error en el servidor',
            error
        });
    }
};

servicesFunctions.saveMantencion = (req, res) => {
    try {
        req.body = JSON.parse(req.body.data);
        const { user, msg, selectData } = req.body;
        let valid = true;
        let id = "";
        selectData.selectedFruits.map(value => {
            sql.connect(config)
                .then(pool => {
                    return pool.request()
                        .input('servicio', 'Mantencion')
                        .input('producto', value.value)
                        .query(`INSERT INTO mantencion (servicio, producto_id)
                                OUTPUT INSERTED.mantencion_id
                                VALUES (@servicio, @producto)`)
                })
                .then((data) => {
                    const { mantencion_id } = data.recordset[0];
                    id = mantencion_id
                    sql.connect(config)
                        .then(pool => {
                            return pool.request()
                                .input('mantencion', mantencion_id)
                                .input('estado', '80C52D48-3FC7-4E9E-873A-984A004FF5C1')
                                .query(`INSERT INTO mantencionEstado (mantencion_id, estado_id, fecha_hecha, fecha_solicitada) VALUES (@mantencion, @estado, NULL,SYSDATETIME())`)
                        })
                        .catch(() => {
                            valid = false;
                        })
                })
                .catch(() => {
                    valid = false;
                })
        });

        if (valid) {
            sendMailFormulario(user, id, msg, selectData.selectedFruits)
            .then(() => {
                return res.status(200).json({ msg: 'Mantenciones enviadas exitosamente' });
            })
            .catch(() => {
                return res.status(400).json({ msg: 'error al enviar el correo, pero se ingreso la mantencion' });
            })
        } else {
            return res.status(400).json({ msg: 'error al enviar las mantenciones' });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error en el servidor',
            error
        });
    }
};

export default servicesFunctions;
