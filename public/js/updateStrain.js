const formEl = document.getElementById('edit-cat-form');

document.addEventListener('DOMContentLoaded', () => {
	const updateStrainFunction = async () => {
		const strainId = formEl.dataset.id;

		const formData = new FormData(formEl);
		const data = {
			name: formData.get('name'),
			description: formData.get('description'),
		};

		const res = await fetch(`/strains/${strainId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		if (res.ok) {
			window.location.href = `/strains/${strainId}`;
			return;
		} else {
			alert('failed to update strain');
		}
	};
	const handleSubmit = (event) => {
		event.preventDefault();
		updateStrainFunction();
	};

	formEl.addEventListener('submit', handleSubmit);
});
