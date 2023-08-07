import { Footer } from "./Components/Footer";
import { Landing } from "./Components/Landing";
import { MainInfoGeneral } from "./Components/MainInfoGeneral";
import { Navbar } from "./Components/Navbar";

function App() {
	return (
		<>
			{/* Obviamente aqui falta el routing y ordenar bien los componentes en Pages */}
			{/* LANDING PAGE */}
			{/* <Navbar />
			<Landing />
			<Footer /> */}

			{/* Informacion General */}
			<Navbar />
			<MainInfoGeneral />
			<Footer />
			
		</>
	);
}

export default App;
