document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('submitButton').addEventListener('click', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const DELIMITER = '---REFERENCES---';

        // Coleta os dados do formulário
        const mainContent = sessionStorage.getItem('EditorContent') || '';
        const references = sessionStorage.getItem('LinksContent') || '';

        // Concatena o conteúdo principal e as referências
        const combinedContent = `${mainContent}\n${DELIMITER}\n${references}`;

        // Collect form data
        const formData = {
            titulo: document.getElementById('materialTitulo').value,
            assuntoId: document.getElementById('selectAssunto').value,
            palavrasChave: window.getKeywords(), // Array of keywords from the tags array
            conteudo: combinedContent, // Markdown content from localStorage
             // Split links into an array, remove empty lines
        };

        // Validate required fields
        if (!formData.titulo || !formData.assuntoId || !formData.conteudo) {
            alert('Por favor, preencha todos os campos obrigatórios (Título, Assunto e Conteúdo).');
            return;
        }

        try {
            // Send data to the server using Axios
            const response = await axios.patch(`/revisao/editar_material/${window.Material.id_conteudo}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            // Check if the request was successful
            if (response.status === 201 || response.status === 200) {
                alert('Material atualizado com sucesso!');
                // Reset the form and clear localStorage
                document.querySelector('form').reset();
                localStorage.removeItem('EditorContent');
                tags.length = 0; // Clear the tags array
                renderTags(); // Update the tag display
                window.location.href = '/revisao/';
            }
            if (response.status === 400) {
                const errorMessage = response.data.message || 'Erro ao atualizar material.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            const errorMessage = error.response?.data?.message || 'Tente novamente.';
            alert(`Erro ao criar material: ${errorMessage}`);
        }
    });
});