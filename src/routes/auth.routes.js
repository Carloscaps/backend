import { Router } from "express";
import authFunctions from '../controllers/auth.controller';

const router = Router();

router.post('/login', authFunctions.login);

router.all('*', (req,res)=> {
    res.status(404).json({
        message:'La ruta solicitada no existe'
    });
});

export default router