import { Router } from "express";
import clientFunctions from '../controllers/client.controller';

const router = Router();

// GET
router.get('/', clientFunctions.getClients);

// POST
router.post('/newClient', clientFunctions.insertCliente);

router.all('*', (req,res)=> {
    res.status(404).json({
        message:'La ruta solicitada no existe'
    });
});

export default router