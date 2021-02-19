import sql from 'mssql';
import crypto from 'crypto';
import { config } from '../database/connection';

let clientFunctions = {};

clientFunctions.getClients = (req, res) => {
    try {
        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .query('SELECT * FROM cliente')
            })
            .then(result => {
                const { recordsets: clientes } = result;
                return res.status(200).json(clientes[0]);
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

clientFunctions.insertCliente = (req, res) => {
    try {
        req.body = JSON.parse(req.body.data);
        const { nombre, razonSocial, nombreContacto, rut, direccion, direccionFactura, giro, ciudad, telefono, secondTelefono, email, tipo, password, comuna } = req.body;

        sql.connect(config)
            .then(pool => {
                crypto.randomBytes(16, (err, salt) => {
                    if (err) {
                        throw new Error('Error al encryptar la contraseña');
                    }

                    const newSalt = salt.toString('base64');
                    crypto.pbkdf2(password, newSalt, 1000, 64, 'sha1', (err, key) => {
                        const encryptPassword = key.toString('base64');
                        return pool.request()
                            .input('rut', rut)
                            .input('nombre', nombre)
                            .input('razon', razonSocial)
                            .input('direccion', direccion)
                            .input('ciudad', ciudad)
                            .input('telefono', telefono)
                            .input('email', email)
                            .input('tipo', tipo)
                            .input('password', encryptPassword)
                            .input('salt', newSalt)
                            .input('contacto', nombreContacto)
                            .input('factura', direccionFactura)
                            .input('giro', giro)
                            .input('telefonoDos', secondTelefono)
                            .input('comuna', comuna)
                            .query(`INSERT INTO cliente 
                            (rsocial_cliente,nombre_cliente, nombre_contacto, rut_cliente, password_hash, password_salt, direccion_trabajo, direccion_factura, giro, ciudad, telefono, telefono_dos, email_cliente, tipo_cliente, comuna_id)
                            VALUES (@nombre, @razon, @contacto, @rut, @password, @salt, @direccion, @factura, @giro, @ciudad, @telefono, @telefonoDos, @email, @tipo, @comuna)`);
                    });
                });
            })
            .then(() => {
                return res.status(200).json({
                    msg: 'cliente registrado exitosamente'
                });
            })
            .catch(error => {
                return res.status(400).json({
                    msg: 'error al registrar un nuevo cliente',
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

export default clientFunctions;
