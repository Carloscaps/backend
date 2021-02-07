import sql from 'mssql';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../database/connection';
import { secret } from '../config.json';

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
                    .query('SELECT * FROM cliente WHERE rut_cliente = @id')
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
                            user: {
                                email: cliente.email_cliente,
                                name: cliente.nombre_cliente,
                                rut: cliente.rut_cliente,
                            },
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

export default authFunctions;
