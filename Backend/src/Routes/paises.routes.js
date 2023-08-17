import {Router} from 'express';

import {Paises,datosPaises, migracioPaises} from '../Controllers/poblacion.controllers'

const router = Router();

router.get('/paises',Paises)

router.post('/info',datosPaises)

router.get('/migracion', migracioPaises)

console.log("OK")

export default router;