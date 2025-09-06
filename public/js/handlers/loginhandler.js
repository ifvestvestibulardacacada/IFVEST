document.getElementById('btn-login').addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = {
        usuario: document.querySelector('input[name="usuario"]').value,
        senha: document.querySelector('input[name="senha"]').value,
    };

    try {
        const response = await axios.post('/login', formData, {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest', // Ensure AJAX detection
            },
        });

        if (response.status === 201 || response.status === 200) {
            console.log('Success:', response.data);
            // Handle success (e.g., redirect to dashboard or homepage)
            window.location.href = '/usuario/inicioLogado'; // Example redirect

        }

    } catch (error) {
        if (error.response && error.response.status === 400) {
            const errors = error.response.data.details;
            const errorMessage = errors.map(e => e.message).join('<br>');
            document.querySelector('.error-message').innerHTML = errorMessage;
        } else {
            document.querySelector('.error-message').innerHTML = 'Erro no servidor. Tente novamente.';
        }
    }
});