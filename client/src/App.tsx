import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Brands from './pages/brands/Brands';
import CreateBrand from './pages/brands/CreateBrand';
import EditBrand from './pages/brands/EditBrand';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<div>App root </div>} />
				<Route path="/brands" element={<Brands />} />
				<Route path="/brands/create" element={<CreateBrand />} />
				<Route path="/brands/:id/edit" element={<EditBrand />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
