import express from "express";
import config from './config';
import Paises from './Routes/paises.routes'
const cors = require('cors');

const app= express();
app.use(cors());
app.set('port',config.port);
app.use(express.json());
app.use(express.urlencoded({ extended:false}));

app.use(Paises)

console.log(config.port);
export default app




