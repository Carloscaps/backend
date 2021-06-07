import sql from 'mssql';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../database/connection';
import { secret } from '../config.json';
import { sendMailRecoverPassword } from '../middleware/mailer';

let authFunctions = {};

const signToken = (email) => {
    return jwt.sign({
        email,
    },
        secret, {
        expiresIn: 60 * 60 * 24, // 24 hrs
    }
    );
};

authFunctions.login = (req, res) => {
    try {
        req.body = JSON.parse(req.body.data);
        const { rut, password } = req.body;

        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .input('id', rut)
                    .query(`SELECT cliente.*, comuna.*   
                            FROM cliente 
                            inner join comuna on cliente.comuna_id = comuna.comuna_id 
                            WHERE rut_cliente = @id`)
            })
            .then(result => {
                const { recordset } = result;
                const cliente = recordset[0];

                crypto.pbkdf2(password, cliente.password_salt, 1000, 64, 'sha1', (err, key) => {
                    const encryptPassword = key.toString('base64');
                    if (cliente.password_hash === encryptPassword) {
                        const token = signToken(cliente.email_cliente);
                        return res.status(200).json({
                            token: token,
                            user: cliente,
                            msg: 'Exito al ingresar',
                        });
                    }
                    return res.status(400).json({
                        msg: 'usuario y/o constraseña incorrecta',
                        error: err,
                    });
                });
            })
            .catch(error => {
                return res.status(400).json({
                    msg: 'error al iniciar sesion',
                    error
                });
            })
    } catch (error) {
        return res.status(500).json({
            msg: 'error en el servidor',
            error
        });
    }
};

authFunctions.recoverPassword = (req, res) => {
    try {
        req.body = JSON.parse(req.body.data);
        const { email } = req.body;

        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .input('email', email)
                    .query('SELECT * FROM cliente WHERE email_cliente = @email')
            })
            .then(result => {
                const { recordset } = result;
                const cliente = recordset[0];

                if (cliente) {
                    crypto.randomBytes(16, (err, salt) => {
                        if (err) {
                            throw new Error('Error al encryptar la contraseña');
                        }

                        const newSalt = salt.toString('base64');
                        const password = `wilug${email}`;
                        crypto.pbkdf2(password, newSalt, 1000, 64, 'sha1', (err, key) => {
                            const encryptPassword = key.toString('base64');
                            sql.connect(config)
                                .then(pool => {
                                    return pool.request()
                                        .input('password', encryptPassword)
                                        .input('salt', newSalt)
                                        .input('email', email)
                                        .query(`UPDATE cliente SET password_hash = @password, password_salt = @salt WHERE email_cliente = @email`)
                                })
                                .then(() => {
                                    sendMailRecoverPassword(email, password)
                                        .then(() => {
                                            return res.status(200).json({
                                                msg: 'Contraseña recuperada exitosamente'
                                            });
                                        })
                                        .catch(error => {
                                            return res.status(400).json({
                                                msg: 'error al enviar el email',
                                                error
                                            });
                                        })
                                })
                                .catch(error => {
                                    return res.status(400).json({
                                        msg: 'error al actualizar la contraseña',
                                        error
                                    });
                                })
                        });
                    });
                } else {
                    return res.status(400).json({
                        msg: 'cliente no existe',
                        error
                    });
                }
            })
            .catch(error => {
                return res.status(400).json({
                    msg: 'error al iniciar sesion',
                    error
                });
            })
    } catch (error) {
        return res.status(500).json({
            msg: 'error en el servidor',
            error
        });
    }
};

export default authFunctions;
