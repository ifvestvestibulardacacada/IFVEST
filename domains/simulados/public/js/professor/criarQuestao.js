
function initializeQuestionEditors(tipo) {
    // const loadingContainer = document.getElementById('loading-container');
    const editors = [];

    const quill = initializeQuill('#editor-container', 'editor-open-btn', 'Digite aqui o Enunciado da questão');
    editors.push({ ['#editor-container']: quill });

    // Lista de IDs dos containers dos editores
    const EDITOR_IDS_OBJETIVA = ['A', 'B', 'C', 'D', 'E'];
    const EDITOR_ID_RESPOSTA = 'resposta';

    // Função para criar editores
    function criarEditores(ids, placeholder) {
        ids.forEach(id => {
            const editorInstance = initializeQuill(`#opcao${id}`, `editor-open-btn${id}`, 'Digite aqui a alternativa');
            editors.push({ [`#opcao${id}`]: editorInstance });
        });
    }

    // Verificando o tipo de questão e criando os editores apropriados
    if (tipo === 'objetiva') {
        criarEditores(EDITOR_IDS_OBJETIVA);
    } else {
        const respostaEditor = initializeQuill(`#${EDITOR_ID_RESPOSTA}`, `editor-open-btn-${EDITOR_ID_RESPOSTA}`, 'Digite aqui a resposta');
        editors.push({ [`#resposta`]: respostaEditor });
    }
    // loadingContainer.style.display = 'none';

    // Função para recuperar a instância de um editor pelo ID
    window.acessarEditorPorId = function (editorId) {
        const editor = editors.find(editor => editor[editorId]);
        return editor ? editor[editorId] : null;
    }

    // Função para recuperar o conteúdo de todos os editores
    function getAllContent() {
        const contents = {};
        if (tipo === 'objetiva') {
            EDITOR_IDS_OBJETIVA.forEach(id => {
                const editorInstance = acessarEditorPorId(`#opcao${id}`);
                if (editorInstance) {
                    const tamanho = editorInstance.getLength();
                    if (tamanho > 1) {
                        contents[`#opcao${id}`] = editorInstance.getContents();
                    }
                }
            });
        } else {
            const editorInstance = acessarEditorPorId(`#${EDITOR_ID_RESPOSTA}`);
            if (editorInstance) {
                const tamanho = editorInstance.getLength();
                if (tamanho > 1) {
                    contents[`#${EDITOR_ID_RESPOSTA}`] = editorInstance.getContents();
                }
            }
        }
        if (Object.keys(contents).length === 0) {
            alert("Erro: Nenhum conteúdo encontrado.");
        }
        return contents;
    }

    // Função para enviar o conteúdo do editor
    async function sendEditorContent(event) {
        event.preventDefault(); // Impede o comportamento padrão do botão

        // 1. OBTENHA TODOS OS DADOS PRIMEIRO
        const titulo = document.getElementById('titulo').value;
        const selectArea = document.getElementById('selectArea').value;
        const selectTopico = Array.from(document.getElementById('selectTopico').selectedOptions).map(option => option.value);

        let tipo = window.questionType;
        tipo = tipo.toUpperCase(); // Corrigido de "windows" para "window"

        const pergunta = quill.getContents();
        const data = getAllContent(); // Conteúdo das alternativas/resposta

        const formData = {
            titulo: titulo,
            area: selectArea,
            topicos: selectTopico,
            pergunta: JSON.stringify(pergunta),
            respostas: JSON.stringify(data),

        };
        if (tipo === 'OBJETIVA') {
            formData.correta = document.getElementById('correta').value;
            if (!formData.correta) {
                appendAlert("A alternativa correta deve ser selecionada.", "danger");
                return;
            }
        }

        if (quill.getLength() <= 1) {
            appendAlert("A pergunta não pode estar vazia.", "danger");
            return;
        }
        if (!titulo) {
            appendAlert("O título não pode estar vazio.", "danger");
            return;
        }
        if (!selectArea) {
            appendAlert("A área deve ser selecionada.", "danger");
            return;
        }
        if (selectTopico.length === 0) {
            appendAlert("Pelo menos um tópico deve ser selecionado.", "danger");
            return;
        }



        try {

            console.log('Form Data:', formData);
            axios.post(`/professor/registrar-questao/${tipo}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
                .then(response => {
                    if (response.status === 201 || response.status === 200) {
                        console.log('Success:', response.data);
                        alert('Questão registrada com sucesso!');
                        document.getElementById('questaoForm').reset();
                        quill.setContents([]);
                        if (tipo === 'objetiva') {
                            EDITOR_IDS_OBJETIVA.forEach(id => {
                                const editor = acessarEditorPorId(`#opcao${id}`);
                                if (editor) editor.setContents([]);
                            });
                        } else {
                            const editor = acessarEditorPorId(`#resposta`);
                            if (editor) editor.setContents([]);
                        }
                        window.location.href = '/professor/questoes'
                    }
                })
                .catch(error => {
                    console.error('Error:', error.response?.data || error.message);
                    alert(`Erro ao criar material: ${error.response?.data?.error || 'Tente novamente.'}`);
                });
        } catch (error) {
            if (error instanceof window.zod.ZodError) {
                const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('\n');
                alert(`Erro ao validar os dados:\n${errorMessages}`);
            } else {
                console.error('Unexpected error:', error);
                alert('Erro inesperado ao validar os dados.');
            }
        }
    }

    // Adiciona o listener ao botão de submit
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.addEventListener('click', sendEditorContent);

    } else {
        console.error('ERRO CRÍTICO: O botão com id="submitButton" não foi encontrado no DOM. O formulário não pode ser enviado.');
    }
}

// Exportar a função para uso global
window.initializeQuestionEditors = initializeQuestionEditors; 