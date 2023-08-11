import {Router} from 'express';

import {Paises,datosPaises} from '../Controllers/poblacion.controllers'

const router = Router();

router.get('/paises',Paises)

router.post('/info',datosPaises)

console.log("OK")

export default router;