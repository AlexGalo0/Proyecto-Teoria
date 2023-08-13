import { useState, useEffect } from "react";

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
        setPoblacionInicial(data.PoblacionTotal);
      } else {
        console.error("Error fetching country data");
      }
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  useEffect(() => {
    // Realizar una solicitud a tu API para obtener los nombres de los países
    fetch("http://localhost:8000/paises")
      .then((response) => response.json())
      .then((data) => {
        // Supongamos que el servidor responde con un array de nombres de países
        setPaises(data);
      })
      .catch((error) => {
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
    const { TasaNatalidad, TasaMortalidad, TasaMigracion, CantidadAnios } =
      inputValues;

    const poblacionInicial = poblacionInicialData; // Cambia esto a tu población inicial deseada
    let poblacion = [poblacionInicial];
    let crecimiento = [];

    for (let i = 1; i <= CantidadAnios; i++) {
      const nuevoCrecimiento =
        (parseFloat(TasaNatalidad) -
          parseFloat(TasaMortalidad) +
          parseFloat(TasaMigracion)) *
        poblacion[i - 1];

      crecimiento.push(nuevoCrecimiento);
      poblacion.push(poblacion[i - 1] + nuevoCrecimiento);
    }

    console.log("Crecimiento:", crecimiento);
    console.log("Población:", poblacion);
  };

  return (
    <>
      <div className="grid-rows-2">
        <div className="flex justify-center pt-4">
          <h1 className="font-bold text-3xl text-[#7895CB] ">
            Instrucciones de Uso
          </h1>
        </div>
        <div className="flex justify-center">
          <p className="font-bold px-8 pb-2">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veniam in
            eligendi dolor nisi est quisquam accusantium rem, voluptates
            distinctio ullam adipisci suscipit doloribus, mollitia, quos itaque
            libero velit minus. Non! Ipsa necessitatibus quos veritatis illum
            mollitia tenetur itaque sint veniam aperiam excepturi provident quia
            praesentium autem exercitationem molestiae asperiores inventore
            alias accusamus, voluptates impedit atque facere? Ipsa quasi commodi
            quo!
          </p>
        </div>
      </div>
 

  
      <div className="bg-[#C5DFF8] pt-8 pl-9 flex justify-around ">
   
   
        {" "}
        {/* General */}
        <div className="bg-[#73b1f3] max-w-[360px] mb-8">
          {" "}
         
          {/* Formulario */}
          <form>
            <div className="pt-6 px-2 ">
              <div className="flex justify-between ">
                <label
                  htmlFor="selectOption"
                  className="font-bold text-white text-xl"
                >
                  Selecciona el país:
                </label>
                <select
                  id="selectOption"
                  name="selectOption"
                  value={selectedOption}
                  onChange={SelectChange}
                >
                  <option value="">Países</option>
                  {paises.map((pais, index) => (
                    <option key={index} value={pais}>
                      {pais}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <label
                  htmlFor="TasaNatalidad"
                  className="font-bold text-white text-xl"
                >
                  Tasa natalidad:
                </label>
                <input
                  type="number"
                  id="TasaNatalidad"
                  name="TasaNatalidad"
                  value={inputValues.TasaNatalidad}
                  onChange={InputChange}
                  className="w-[100px] "
                  placeholder="1.2"
                />
              </div>
              <div className="flex justify-between pt-4">
                <label
                  htmlFor="TasaMortalidad"
                  className="font-bold text-white text-xl"
                >
                  Tasa mortalidad:
                </label>
                <input
                  type="number"
                  id="TasaMortalidad"
                  name="TasaMortalidad"
                  value={inputValues.TasaMortalidad}
                  onChange={InputChange}
                  className="w-[100px] "
                  placeholder="0.7"
                />
              </div>
              <div className="flex justify-between pt-4">
                <label
                  htmlFor="TasaMigracion"
                  className="font-bold text-white text-xl"
                >
                  Tasa de migración:
                </label>
                <input
                  type="number"
                  id="TasaMigracion"
                  name="TasaMigracion"
                  value={inputValues.TasaMigracion}
                  onChange={InputChange}
                  className="w-[100px] "
                  placeholder="0.31"
                />
              </div>
              <div className="flex justify-between pt-4 pb-3  ">
                <label
                  htmlFor="CantidadAnios"
                  className="font-bold text-white text-xl"
                >
                  Cantidad de años:
                </label>
                <input
                  type="number"
                  id="CantidadAnios"
                  name="CantidadAnios"
                  value={inputValues.CantidadAnios}
                  onChange={InputChange}
                  className="w-[100px] "
                  placeholder="5"
                />
              </div>
              {/* <div className="flex  justify-end">
                <button type="button" onClick={Calculos} className="bg-cyan-100 mb-5">
                  Calcular Crecimiento
                </button>
              </div>
               */}
            </div>
            
          </form>
          
        </div>
        <div className="max-w-[350px]">

        <img src="https://th.bing.com/th/id/OIP.tkYza1sR2kW89yiRLt85xgHaEp?pid=ImgDet&rs=1" alt="" />
        </div>
      </div>

    </>
  );
};
