import { useState , useEffect } from "react";

export const Simulador = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [paises, setPaises] = useState([]);
  const [poblacionInicialData, setPoblacionInicial] = useState("");
  const [inputValues, setInputValues] = useState({
    TasaNatalidad: "",
    TasaMortalidad: "",
    TasaMigracion: "",
    CantidadAnios: "",
  });


  const SelectChange = async (event) => {
    const value = event.target.value;
    setSelectedOption(value);

    try {
      const response = await fetch("http://localhost:8080/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pais: value }),
      });

      if (response.ok) {
        const data = await response.json();
        setInputValues({
          TasaNatalidad: data.TasaNatalidad.toString(),
          TasaMortalidad: data.TasaMortalidad.toString(),
          TasaMigracion: data.TasaMigracion.toString(),
        });
        setPoblacionInicial(data.PoblacionTotal)
      } else {
        console.error("Error fetching country data");
      }
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  useEffect(() => {
    // Realizar una solicitud a tu API para obtener los nombres de los países
    fetch("http://localhost:8080/paises")
      .then(response => response.json())
      .then(data => {
        // Supongamos que el servidor responde con un array de nombres de países
        setPaises(data);
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const InputChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    console.log(`Input ${name}:`, value);
  };

  const Calculos = () => {
    const {
      TasaNatalidad,
      TasaMortalidad,
      TasaMigracion,
      CantidadAnios,
    } = inputValues;

    const poblacionInicial = parseInt(poblacionInicialData); // Cambia esto a tu población inicial deseada
    let poblacion = [poblacionInicial];
    let crecimiento = [];

    for (let i = 1; i <= CantidadAnios; i++) {
      const nuevoCrecimiento =
        Math.ceil((parseFloat(TasaNatalidad) - parseFloat(TasaMortalidad) + parseFloat(TasaMigracion)) *
        poblacion[i - 1]);

      crecimiento.push(nuevoCrecimiento);
      poblacion.push(poblacion[i - 1] + nuevoCrecimiento);
    }

    console.log("Crecimiento:", crecimiento);
    console.log("Población:", poblacion);
  };

  return (
    <>
      <form>
      <div>
          <label htmlFor="selectOption">Selecciona el país:</label>
          <select
            id="selectOption"
            name="selectOption"
            value={selectedOption}
            onChange={SelectChange}
          >
            <option value="">Selecciona...</option>
            {paises.map((pais, index) => (
              <option key={index} value={pais}>
                {pais}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="TasaNatalidad">Tasa natalidad:</label>
          <input
            type="text"
            id="TasaNatalidad"
            name="TasaNatalidad"
            value={inputValues.TasaNatalidad}
            onChange={InputChange}
          />
        </div>
        <div>
          <label htmlFor="TasaMortalidad">Tasa mortalidad:</label>
          <input
            type="text"
            id="TasaMortalidad"
            name="TasaMortalidad"
            value={inputValues.TasaMortalidad}
            onChange={InputChange}
          />
        </div>
        <div>
          <label htmlFor="TasaMigracion">Tasa de migración:</label>
          <input
            type="text"
            id="TasaMigracion"
            name="TasaMigracion"
            value={inputValues.TasaMigracion}
            onChange={InputChange}
          />
        </div>
        <div>
          <label htmlFor="CantidadAnios">Cantidad de años:</label>
          <input
            type="text"
            id="CantidadAnios"
            name="CantidadAnios"
            value={inputValues.CantidadAnios}
            onChange={InputChange}
          />
        </div>
        <button type="button" onClick={Calculos}>
          Calcular Crecimiento
        </button>
      </form>
    </>
  );
};
