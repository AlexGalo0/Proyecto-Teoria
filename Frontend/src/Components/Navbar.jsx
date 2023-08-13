import { Link } from 'react-router-dom';

export const Navbar = () => {
	return (
		<nav className='bg-[#4a55a2] min-h-[95px] '>
			<div className='flex flex-row justify-around '>
			<Link to='/'>
				<h1 className='pt-3 text-5xl font-semibold text-white'>CPM LATAM</h1>
				</Link>
		<Link to='/info'>
				<h2 className='pt-4 text-4xl font-semibold text-white '>
					Datos y Estadísticas
				</h2>
		</Link>
		<Link to='/Simulador'>
				<h3 className='pt-3 text-4xl font-semibold text-white '>Simulador</h3>
		</Link>
			</div>
		</nav>
	);
};
