document.getElementById('btn-cadastro').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = {
        usuario: document.querySelector('input[name="usuario"]').value,
        nome: document.querySelector('input[name="nome"]').value,
        email: document.querySelector('input[name="email"]').value,
        senha: document.querySelector('input[name="senha"]').value,
        perfil: document.querySelector('select[name="perfil"]').value,
    };

    try {
        const response = await axios.post('/cadastro', formData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest', // Ensure AJAX detection
            },
        });
        if (response.status === 201 || response.status === 200) {
            console.log('Success:', response.data);
            // Handle success (e.g., redirect to dashboard or homepage)
            window.location.href = '/login'; // Example redirect

        }
        // Handle success (e.g., redirect or show message)
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        if (error.response?.status === 400 && error.response?.data?.details) {
            const errorDetails = error.response.data.details;
            // Format error messages for display
            const errorMessages = errorDetails.map(err => `${err.path}: ${err.message}`).join('\n');
            alert(`Erro ao criar usuario:\n${errorMessages}`);
        } else {
            // Fallback for other errors
            const errorMessage = error.response?.data?.error || 'Tente novamente.';
            alert(`Erro ao criar usuario: ${errorMessage}`);
        }
    }
});