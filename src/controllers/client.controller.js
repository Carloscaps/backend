import {config} from '../database/connection';
import sql from 'mssql';

let clientFunction = {};

clientFunction.getClients = async(req, res) => {
    try {
        console.log(config);
        let pool = await sql.connect(config);
        console.log('hola',pool);
        let clientes = await pool.request().query('select * from cliente');
        return res.status(200).json(clientes);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Error en el servidor', 
            error
        });
    };
};

export default clientFunction;
