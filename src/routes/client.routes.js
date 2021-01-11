import { Router } from "express";
import clientFunction from '../controllers/client.controller';

const router = Router();

router.get('/', clientFunction.getClients);

router.all('*', (req,res)=> {
    res.status(404).json({
        message:'La ruta solicitada no existe'
    });
});

export default router