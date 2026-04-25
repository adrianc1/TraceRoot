import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Brands from './pages/brands/Brands';
import CreateBrand from './pages/brands/CreateBrand';
import EditBrand from './pages/brands/EditBrand';
import Categories from './pages/categories/Categories';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<div>App root </div>} />
				<Route path="/brands" element={<Brands />} />
				<Route path="/brands/create" element={<CreateBrand />} />
				<Route path="/brands/:id/edit" element={<EditBrand />} />
				<Route path="/categories" element={<Categories />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
