import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Brands from './pages/brands/Brands';
import CreateBrand from './pages/brands/CreateBrand';
import EditBrand from './pages/brands/EditBrand';
import Categories from './pages/categories/Categories';
import CreateCategory from './pages/categories/CreateCategory';
import EditCategory from './pages/categories/EditCategory';
import CategoryProducts from './pages/categories/CategoryProducts';
import Strains from './pages/strains/Strains';
import CreateStrain from './pages/strains/CreateStrain';
import EditStrain from './pages/strains/EditStrain';
import Locations from './pages/locations/Locations';
import CreateLocation from './pages/locations/CreateLocation';
import EditLocation from './pages/locations/EditLocation';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<div>App root </div>} />
				<Route path="/brands" element={<Brands />} />
				<Route path="/brands/create" element={<CreateBrand />} />
				<Route path="/brands/:id/edit" element={<EditBrand />} />
				<Route path="/categories" element={<Categories />} />
				<Route path="/categories/create" element={<CreateCategory />} />
				<Route path="/categories/:id/edit" element={<EditCategory />} />
				<Route path="/categories/:id" element={<CategoryProducts />} />
				<Route path="/strains" element={<Strains />} />
				<Route path="/strains/create" element={<CreateStrain />} />
				<Route path="/strains/:id/edit" element={<EditStrain />} />

				<Route path="/locations" element={<Locations />} />
				<Route path="/locations/create" element={<CreateLocation />} />
				<Route path="/locations/:id/edit" element={<EditLocation />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
