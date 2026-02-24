document.addEventListener('DOMContentLoaded', () => {
	const formEl = document.getElementById('receive-form');

	const receiveInventoryFunction = async () => {
		const formData = new FormData(formEl);
		const product_id = document.getElementById('product_id').value;

		const data = {
			package_tag: formData.get('packageTag'),
			product_id: product_id,
			quantity: formData.get('quantity'),
			unit: formData.get('unit'),
			unit_price: formData.get('unit_price'),
			reason: formData.get('reason'),
			vendor: formData.get('vendor'),
			batch: formData.get('batch'),
			notes: formData.get('notes'),
		};

		console.log('Data to send:', data);

		const res = await fetch(`/products/receive`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		console.log(res.body);

		if (res.ok) {
			window.location.href = `/products/${product_id}`;
			return;
		} else {
			alert('failed to update product');
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		event.stopPropagation();
		receiveInventoryFunction();
	};

	formEl.addEventListener('submit', handleSubmit);
});
