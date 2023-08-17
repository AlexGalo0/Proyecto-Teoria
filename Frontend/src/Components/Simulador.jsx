import { useState, useEffect,useRef } from "react";
import Chart from 'chart.js/auto';


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
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
    const barChartRef = useRef(null);
  const [barChartInstance, setBarChartInstance] = useState(null);

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
    fetch("http://localhost:8080/paises")
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
    const {
      TasaNatalidad,
      TasaMortalidad,
      TasaMigracion,
      CantidadAnios,
    } = inputValues;

    const poblacionInicial = parseInt(poblacionInicialData); // población inicial deseada
    let poblacion = [poblacionInicial];
    let crecimiento = [];

    for (let i = 1; i <= CantidadAnios; i++) {
      const nuevoCrecimiento =
        Math.ceil((parseFloat(TasaNatalidad) - parseFloat(TasaMortalidad) + parseFloat(TasaMigracion)) *
        poblacion[i - 1]);

      crecimiento.push(nuevoCrecimiento);
      poblacion.push(poblacion[i - 1] + nuevoCrecimiento);
    }

    
    if (chartInstance) {
    chartInstance.destroy();
    }

    if (barChartInstance) {
      barChartInstance.destroy();
    }

    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext("2d");
      const newBarChartInstance = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: Array.from({ length: CantidadAnios }, (_, i) => 2023 + i),
          datasets: [
            {
              label: "Población por Año",
              data: poblacion,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: false,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Años",
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Población",
              },
            },
          },
        },
      });
      setBarChartInstance(newBarChartInstance);
    }
  

    const ctx = chartRef.current.getContext("2d");
     const newChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: CantidadAnios }, (_, i) => 2023 + i),
        datasets: [
          {
            label: "Población",
            data: poblacion,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
          },
          {
            label: "Crecimiento",
            data: crecimiento,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Años",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Cantidad",
            },
          },
        },
      },
    });
    setChartInstance(newChartInstance);
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
          El uso de este simulador es muy sencillo, una vez seleccionas el país de Latinoamérica que quieres calcular su crecimiento poblacional y migración, te traerá datos actuales de su tasa de natalidad, tasa de mortalidad y tasa de migración.  Estas tasas pueden ser manipuladas en sus valores para poder calcular otras proyecciones en la cantidad de años a futuro que desees y lo que hará será mostrarte una gráfica con estas proyecciones en tiempo real mientras vas cambiando sus valores.
          </p>
        </div>
      </div>
 

  
      <div className="bg-[#C5DFF8] pt-8 pl-9 flex justify-around ">
   
   
        {" "}
        {/* General */}
        <div className="bg-[#73b1f3] max-w-[360px] mb-8 rounded-lg">
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
                  className="rounded text-center"
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
                  className="w-[100px] rounded text-center"
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
                  className="w-[100px] rounded text-center"
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
                  className="w-[100px] rounded text-center"
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
                  className="w-[100px] rounded text-center"
                  placeholder="5"
                />
              </div>
              { <div className="flex  justify-end">
                <button type="button" onClick={Calculos} className="bg-cyan-100 mb-5 rounded">
                  Calcular Crecimiento
                </button>
              </div>
               }
            </div>
            
          </form>
          
        </div>
        <div className="bg-[#C5DFF8] pt-8 pl-9 flex justify-around ">
        <canvas ref={chartRef} width="900" height="400"></canvas>
      </div>

      </div>
      <div className="bg-[#C5DFF8] pt-8 pl-9 flex justify-around ">
        <canvas ref={barChartRef} width="900" height="900"></canvas>
      </div>
    </>
  );
};
