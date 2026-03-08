document.addEventListener('DOMContentLoaded', () => {
	const deleteBtn = document.getElementById('delete-btn');
	const unarchiveBtn = document.getElementById('unarchive-btn');

	if (deleteBtn) {
		deleteBtn.addEventListener('click', async () => {
			const confirmed = confirm(
				'Are you sure you want to archive this product? This action cannot be undone.',
			);

			if (!confirmed) return;

			const productId = deleteBtn.dataset.id;

			deleteBtn.disabled = true;
			deleteBtn.textContent = 'Archiving...';
			const res = await fetch(`/packages/${productId}/archive`, {
				method: 'PUT',
			});

			console.log(res.ok);

			if (res.ok) {
				window.location.href = '/packages';
				return;
			} else {
				const data = await res.json();
				alert(data.error || 'Failed to archive product');
				deleteBtn.disabled = false;
				deleteBtn.textContent = 'Archive';
			}
		});
	}

	if (unarchiveBtn) {
		unarchiveBtn.addEventListener('click', async () => {
			const productId = unarchiveBtn.dataset.id;
			unarchiveBtn.disabled = true;
			unarchiveBtn.textContent = 'Unarchiving...';

			const res = await fetch(`/packages/${productId}/unarchive`, {
				method: 'PUT',
			});

			if (res.ok) {
				window.location.href = `/packages/${productId}`;
			} else {
				alert('Failed to unarchive product');
				unarchiveBtn.disabled = false;
				unarchiveBtn.textContent = 'Unarchive';
			}
		});
	}
});
