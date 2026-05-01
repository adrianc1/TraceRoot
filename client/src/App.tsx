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
import Packages from './pages/products/Packages';
import Product from './pages/products/Product';
import CreateProduct from './pages/products/CreateProduct';
import EditProduct from './pages/products/EditProduct';
import ReceiveInventory from './pages/products/ReceiveInventory';
import AdjustInventory from './pages/products/AdjustInventory';
import SplitPackage from './pages/products/SplitPackage';
import Header from './components/Header';
import GeneralReceiving from './pages/products/GeneralReceiving';
import ProductList from './pages/products/ProductList';
import Transfers from './pages/transfers/Transfers';
import Transfer from './pages/transfers/Transfer';
import TransferForm from './pages/transfers/TransferForm';

function App() {
	return (
		<div className="">
			<Header />
			<BrowserRouter>
				<Routes>
					<Route path="/packages/receive" element={<GeneralReceiving />} />
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
					<Route path="/locations/:id" element={<EditLocation />} />
					<Route path="/packages" element={<Packages />} />
					<Route path="/packages/create-product" element={<CreateProduct />} />
					<Route
						path="/packages/:packageTag/adjust"
						element={<AdjustInventory />}
					/>
					<Route
						path="/packages/:packageTag/split"
						element={<SplitPackage />}
					/>
					<Route path="/packages/:id/edit" element={<EditProduct />} />
					<Route path="/packages/:id/receive" element={<ReceiveInventory />} />
					<Route path="/packages/:id" element={<Product />} />
					<Route path="/packages/products" element={<ProductList />} />

					<Route path="/transfers" element={<Transfers />} />
					<Route path="/transfers/create" element={<TransferForm />} />

					<Route path="/transfers/:id" element={<Transfer />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
