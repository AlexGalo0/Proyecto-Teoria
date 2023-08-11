import { getConnection,sql, querys} from "../Database"

export const Paises = async (req, res) => {

    const pool = await getConnection();
    const pais = await pool. request().query("select distinct Pais from poblacion")

    const paises = pais.recordset.map(item => item.Pais);

    res.json(paises);
}

export const datosPaises=async (req, res) => {
    const {pais}= req.body;

    const pool = await getConnection();
    const Año = await pool.request().input("pais",sql.VarChar,pais).query(`select Max(anio) as anio from poblacion where pais=@pais`)
    const info = await pool.request()
    .input("pais",sql.VarChar,pais)
    .query(
    `SELECT TasaNatalidad, TasaMortalidad, TasaMigracion, PoblacionTotal
    FROM poblacion 
    WHERE pais = @pais and anio=${Año.recordset[0].anio}
    `)

    res.json(info.recordset[0])

}

