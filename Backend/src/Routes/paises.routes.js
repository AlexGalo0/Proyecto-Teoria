import {Router} from 'express';

import {Paises,datosPaises, migracionPaises} from '../Controllers/poblacion.controllers'

const router = Router();

router.get('/paises',Paises)

router.post('/info',datosPaises)

router.get('/migracion', migracionPaises)

console.log("OK")

export default router;