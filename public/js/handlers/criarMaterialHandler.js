document.addEventListener('DOMContentLoaded', function () {
 document.getElementById('submitButton').addEventListener('click', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const formData = {
            titulo: document.getElementById('materialTitulo').value,
            areaId: document.getElementById('selectArea').value,
            topicoId: document.getElementById('selectTopico').value,
            palavrasChave: tags, // Array of keywords from the tags array
            conteudo: localStorage.getItem('EditorContent') || '', // Markdown content from localStorage
            linksExternos: document.getElementById('linksExternos').value.split('\n').filter(link => link.trim() !== '') // Split links into an array, remove empty lines
        };

        // Validate required fields
        if (!formData.titulo || !formData.areaId || !formData.topicoId || !formData.conteudo) {
            alert('Por favor, preencha todos os campos obrigatórios (Título, Área, Tópico e Conteúdo).');
            return;
        }

        try {
            // Send data to the server using Axios
            const response = await axios.post('/revisao/criar_material', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Check if the request was successful
            if (response.status === 201 || response.status === 200) {
                alert('Material criado com sucesso!');
                // Reset the form and clear localStorage
                document.querySelector('form').reset();
                localStorage.removeItem('EditorContent');
                tags.length = 0; // Clear the tags array
                renderTags(); // Update the tag display
                document.getElementById('selectTopico').innerHTML = '<option selected>Escolha a área primeiro...</option>';
                document.getElementById('selectTopico').disabled = true;
                window.location.href = '/revisao/home';

            }
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            const errorMessage = error.response?.data?.message || 'Tente novamente.';
            alert(`Erro ao criar material: ${errorMessage}`);
        }
    });
});