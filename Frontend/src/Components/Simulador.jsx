import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

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
  const [migracionData, setMigracionData] = useState([]);
  const barChartRefMigracion = useRef(null);
  const [barChartInstanceMigracion, setBarChartInstanceMigracion] =
    useState(null);
  const [ejecutarcalculos, setEjecutarCalculos] = useState(true);

  const EjecutarCalculos = () => {
    setEjecutarCalculos(!ejecutarcalculos);
  };

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

    fetch("http://localhost:8080/migracion")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMigracionData(data);
      })
      .catch((error) => {
        console.error("Error fetching migration data:", error);
      });
  }, [selectedOption]);

  useEffect(() => {
    if (barChartInstanceMigracion) {
      barChartInstanceMigracion.destroy();
    }
    if (migracionData.length > 0 && barChartRefMigracion.current) {
      const barCtxMigracion = barChartRefMigracion.current.getContext("2d");
      const migracionValues = migracionData.map((item) =>
        Math.abs(item["CantidadDeMigrantes"])
      );
      const migracionLabels = migracionData.map((item) => item.Pais);

      const newBarChartInstanceMigracion = new Chart(barCtxMigracion, {
        type: "bar",
        data: {
          labels: migracionLabels,
          datasets: [
            {
              label: "Migración",
              data: migracionValues,
              backgroundColor: "rgba(255, 159, 64, 0.5)",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          indexAxis: "y",
          scales: {
            y: {
              display: true,
              title: {
                display: true,
                text: "Países",
              },
            },
            x: {
              display: true,
              title: {
                display: true,
                text: "Migración",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Gráfico de Migración por País, año 2022",
            },
          },
        },
      });

      setBarChartInstanceMigracion(newBarChartInstanceMigracion);
      console.log(migracionValues);
    }
  }, [migracionData]);

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

    const poblacionInicial = parseInt(poblacionInicialData); // población inicial deseada
    const crecimiento2 = Math.ceil(
      ((parseFloat(TasaNatalidad) -
        parseFloat(TasaMortalidad) +
        parseFloat(TasaMigracion)) *
        poblacionInicial) %
        1000
    );
    const crecimiento = [crecimiento2];
    const pobprueba = poblacionInicial + crecimiento2;
    const poblacion = [pobprueba];
    for (let i = 1; i <= CantidadAnios; i++) {
      const nuevoCrecimiento = Math.ceil(
        ((parseFloat(TasaNatalidad) -
          parseFloat(TasaMortalidad) +
          parseFloat(TasaMigracion)) *
          poblacion[i - 1]) %
          1000
      );

      crecimiento.push(nuevoCrecimiento);
      if (i < CantidadAnios) {
        poblacion.push(poblacion[i - 1] + nuevoCrecimiento);
      }
    }

    if (chartInstance) {
      chartInstance.destroy();
    }

    fetch("http://localhost:8080/poblacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pais: selectedOption }),
    })
      .then((response) => response.json())
      .then((poblacionTotalRecordset) => {
        console.log("Recordset de población total:", poblacionTotalRecordset);

        // Crear un array con los años desde 2012 hasta 2022
        const poblacionTotalAnios = Array.from(
          { length: 11 },
          (_, i) => 2012 + i
        );

        // Crear un array con la población total correspondiente a cada año
        const poblacionTotalValues = poblacionTotalRecordset.map(
          (item) => item.PoblacionTotal
        );

        // Obtener población calculada desde 2023 hasta CantidadAnios
        const poblacionCalculada = poblacion.slice(0); // Saltar el primer valor que ya es el inicial
        const aniosCalculados = Array.from(
          { length: CantidadAnios },
          (_, i) => 2023 + i
        );

        // Combinar población total y población calculada para mostrar en el gráfico
        const poblacionValues = [
          ...poblacionTotalValues,
          ...poblacionCalculada,
        ];

        const labels = [
          ...poblacionTotalAnios.map((anio) => `Población Total ${anio}`),
          ...aniosCalculados.map((anio) => `Población Calculada ${anio}`),
        ];

        // Mostrar los datos en el gráfico de barras
        if (barChartInstance) {
          barChartInstance.destroy();
        }

        if (barChartRef.current) {
          const barCtx = barChartRef.current.getContext("2d");
          const newBarChartInstance = new Chart(barCtx, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Población",
                  data: poblacionValues,
                  backgroundColor: "rgba(54, 162, 235, 0.5)",
                  borderColor: "rgba(54, 162, 235, 1)",

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
              plugins: {
                title: {
                  display: true,
                  text: "Gráfico de Población por año",
                },
              },
            },
          });
          setBarChartInstance(newBarChartInstance);
        }
      })
      .catch((error) => {
        console.error("Error fetching population data:", error);
      });

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
        plugins: {
          title: {
            display: true,
            text: "Gráfico de crecimiento y población por año",
          },
        },
      },
    });
    setChartInstance(newChartInstance);
    console.log("Crecimiento:", crecimiento);
    console.log("Población:", poblacion);
  };

  useEffect(() => {
    if (ejecutarcalculos) {
      if (
        inputValues.TasaNatalidad !== "" &&
        inputValues.TasaMortalidad !== "" &&
        inputValues.TasaMigracion !== "" &&
        inputValues.CantidadAnios !== ""
      ) {
        Calculos(); // Llama a la función Calculos para realizar los cálculos
        setEjecutarCalculos(true);
      }
    }
  }, [inputValues, ejecutarcalculos]);

  return (
    <>
      {/* Header */}
      <div className="grid-rows-2 ">
        <div className="flex justify-center pt-4 ">
          <h1 className="font-bold text-3xl text-[#7895CB] ">
            Instrucciones de Uso
          </h1>
        </div>
        <div className="flex justify-center ">
          <p className="font-bold px-8 pb-2">
            El uso de este simulador es muy sencillo, una vez seleccionas el
            país de Latinoamérica que quieres calcular su crecimiento
            poblacional y migración, te traerá datos actuales de su tasa de
            natalidad, tasa de mortalidad y tasa de migración. Estas tasas
            pueden ser manipuladas en sus valores para poder calcular otras
            proyecciones en la cantidad de años a futuro que desees y lo que
            hará será mostrarte una gráfica con estas proyecciones en tiempo
            real mientras vas cambiando sus valores.
            <br />
            <p>
              Nota: (Los gráficos mostrados y las tasas son por cada 1,000
              habitantes)
            </p>
          </p>
        </div>
      </div>

      <div className="ml-[50px] mr-[50px] mb-[50px]">
        {/* General */}
        <div className="bg-[#C5DFF8] flex justify-center mt-4 pt-4 ">
          {/* Formulario */}
          <div className=" ml-[110px] mt-10 ">
            <div className="bg-[#426fb3]  rounded-lg min-w-[340px] ">
              {" "}
              <form>
                <h1 className="flex justify-center text-2xl text-white font-bold pt-3">
                  Inicio
                </h1>
                <div className="px-2 ">
                  <div className="flex justify-between pt-2">
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

                  <div className="flex justify-between pt-3 ">
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
                  <div className="flex justify-between pt-3">
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
                  <div className="flex justify-between pt-3">
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
                  <div className="flex justify-between pt-3">
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

                  <div className="flex justify-center pt-3">
                    <button
                      type="button"
                      onClick={EjecutarCalculos}
                      className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                    >
                      <FontAwesomeIcon
                        icon={ejecutarcalculos ? faPause : faPlay}
                      />
                      {ejecutarcalculos
                        ? "  Pausar Simulación"
                        : "  Activar Simulación"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="bg-[#C5DFF8]  ml-[320px] flex justify-around max-h-[600px] ">
            <canvas ref={chartRef} width="750" height="600"></canvas>
          </div>
        </div>

        {/* Siguientes dos graficos */}

        <div className="bg-[#C5DFF8] pt-8 pl-9 flex justify-around  max-h-[700px] rounded-lg ">
          <div className="border-radius: 1.5rem ">
            <canvas ref={barChartRef} width="750" height="500"></canvas>
          </div>
          <div className=" pt-8 pl-9 flex justify-evenly border-radius: 1.5rem  ">
            <canvas
              ref={barChartRefMigracion}
              width="900"
              height="800"
            ></canvas>
          </div>
        </div>
      </div>
    </>
  );
};
