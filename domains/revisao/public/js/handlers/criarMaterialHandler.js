document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('submitButton').addEventListener('click', async function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Delimitador para separar conteúdo e referências
        const DELIMITER = '---REFERENCES---';

        // Coleta os dados do formulário
        const mainContent = sessionStorage.getItem('EditorContent') || '';
        const references = sessionStorage.getItem('LinksContent') || '';

        // Concatena o conteúdo principal e as referências
        const combinedContent = `${mainContent}\n${DELIMITER}\n${references}`;

        // Monta os dados para envio
        const formData = {
            titulo: document.getElementById('materialTitulo').value,
            assuntoId: document.getElementById('selectAssunto').value,
            palavrasChave: tags, // Array de palavras-chave
            conteudo: combinedContent // Envia o conteúdo concatenado
            // Note que linksExternos não é mais necessário como campo separado
        };

        // Valida os campos obrigatórios
        if (!formData.titulo || !formData.assuntoId || !formData.conteudo) {
            alert('Por favor, preencha todos os campos obrigatórios (Título, Assunto e Conteúdo).');
            return;
        }

        try {
            // Envia os dados para o servidor com Axios
            const response = await axios.post('/revisao/criar_material', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            // Verifica se a requisição foi bem-sucedida
            if (response.status === 201 || response.status === 200) {
                alert('Material criado com sucesso!');
                // Reseta o formulário e limpa o localStorage
                document.querySelector('form').reset();
                localStorage.removeItem('EditorContent');
                localStorage.removeItem('LinksContent');
                tags.length = 0; // Limpa o array de tags
                renderTags(); // Atualiza a exibição das tags
                window.location.href = '/revisao/';
            }
        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);

            // Trata erros de validação do Zod
            if (error.response?.status === 400 && error.response?.data?.details) {
                const errorDetails = error.response.data.details;
                const errorMessages = errorDetails.map(err => `${err.path}: ${err.message}`).join('\n');
                alert(`Erro ao criar material:\n${errorMessages}`);
            } else {
                const errorMessage = error.response?.data?.error || 'Tente novamente.';
                alert(`Erro ao criar material: ${errorMessage}`);
            }
        }
    });
});