const formEl = document.getElementById('edit-cat-form');

document.addEventListener('DOMContentLoaded', () => {
	const updateCategoryFunction = async () => {
		const categoryId = formEl.dataset.id;

		const formData = new FormData(formEl);
		const data = {
			name: formData.get('name'),
			description: formData.get('description'),
		};

		const res = await fetch(`/categories/${categoryId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (res.ok) {
			window.location.href = `/categories/${categoryId}`;
			return;
		} else {
			alert('failed to update category');
		}
	};
	const handleSubmit = (event) => {
		event.preventDefault();
		updateCategoryFunction();
	};

	formEl.addEventListener('submit', handleSubmit);
});
