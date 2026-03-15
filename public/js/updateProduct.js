const formEl = document.getElementById('edit-product-form');

document.addEventListener('DOMContentLoaded', () => {
	const updateProductFunction = async () => {
		const productId = formEl.dataset.id;

		const formData = new FormData(formEl);
		const data = {
			name: formData.get('name'),
			description: formData.get('description'),
			unit: formData.get('unit'),
			brandId: formData.get('brandId'),
			strainId: formData.get('strainId'),
			categoryId: formData.get('categoryId'),
			sku: formData.get('sku'),
		};

		const res = await fetch(`/packages/${productId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (res.ok) {
			window.location.href = `/packages/${productId}`;
			return;
		} else {
			alert('failed to update product');
		}
	};
	const handleSubmit = (event) => {
		event.preventDefault();
		updateProductFunction();
	};

	formEl.addEventListener('submit', handleSubmit);
});
