import { Router } from "express";
import countryFunctions from '../controllers/country.controller';

const router = Router();

// GET
router.get('/regions', countryFunctions.getRegions);
router.get('/communesByRegion/:id', countryFunctions.communesByRegion);

router.all('*', (req,res)=> {
    res.status(404).json({
        message:'La ruta solicitada no existe'
    });
});

export default router