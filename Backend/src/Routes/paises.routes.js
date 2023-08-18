import {Router} from 'express';

import {Paises,datosPaises, migracionPaises, poblacionPais} from '../Controllers/poblacion.controllers'

const router = Router();

router.get('/paises',Paises)

router.post('/info',datosPaises)

router.get('/migracion', migracionPaises)

router.post('/poblacion', poblacionPais)

console.log("OK")

export default router;