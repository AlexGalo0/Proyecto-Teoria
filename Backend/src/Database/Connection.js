import sql from 'mssql'
import config from '../config'

const dbsettings={
    user: config.user,
    password:config.password,
    server:config.server,
    database:config.database,
    options:{
        encrypt: true,
        trustServerCertificate:true
    }
};
export async function getConnection(){
    try{
        const pool = await sql.connect(dbsettings);
        return pool;
    }catch(error){
        console.error(error);
    }
}

export {sql};