import { Router } from "express";
import productsFunctions from '../controllers/products.controller';

const router = Router();

// GET
router.get('/ByCliente/:id', productsFunctions.getProductsByClient);
router.get('/agents', productsFunctions.getAgents);
router.get('/detail/:id', productsFunctions.detailProduct);

router.post('/', productsFunctions.newProduct);

router.all('*', (req,res)=> {
    res.status(404).json({
        message:'La ruta solicitada no existe'
    });
});

export default router