import sql from 'mssql';
import { config } from '../database/connection';

let countryFunctions = {};

countryFunctions.getRegions = (req, res) => {
    try {
        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .query('SELECT * FROM region')
            })
            .then(result => {
                const { recordsets: regions } = result;
                return res.status(200).json(regions[0]);
            })
            .catch(error => {
                return res.status(400).json({
                    msg: 'error al obtener las regiones',
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

countryFunctions.communesByRegion = (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw error;
        }

        sql.connect(config)
            .then(pool => {
                return pool.request()
                    .input('region', id)
                    .query(`SELECT c.comuna_id, c.nombre_comuna 
                            FROM comuna c
                            WHERE c.region_id = @region`)
            })
            .then(result => {
                const { recordsets: communes } = result;
                return res.status(200).json(communes[0]);
            })
            .catch(error => {
                return res.status(400).json({
                    msg: 'error al obtener las comunas',
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

export default countryFunctions;
