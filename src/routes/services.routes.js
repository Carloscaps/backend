import { Router } from "express";
import servicesFunctions from '../controllers/services.controller';

const router = Router();

router.get('/history/:id', servicesFunctions.getHistoryByClient)

router.all('*', (req,res)=> {
    res.status(404).json({
        message:'La ruta solicitada no existe'
    });
});

export default router