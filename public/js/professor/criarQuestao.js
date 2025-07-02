// Função para inicializar os editores
function initializeQuestionEditors(tipo) {
    const loadingContainer = document.getElementById('loading-container');
    const editors = [];

    const quill = initializeQuill('#editor-container', 'editor-open-btn', 'Digite aqui o Enunciado da questão');
    editors.push({ ['#editor-container']: quill });

    // Lista de IDs dos containers dos editores
    const EDITOR_IDS_OBJETIVA = ['A', 'B', 'C', 'D', 'E'];
    const EDITOR_ID_RESPOSTA = 'A';

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
        const respostaEditor = initializeQuill(`#opcao${EDITOR_ID_RESPOSTA}`, `editor-open-btn${EDITOR_ID_RESPOSTA}`, 'Digite aqui a resposta');
        editors.push({ [`#opcao${EDITOR_ID_RESPOSTA}`]: respostaEditor });
    }
    loadingContainer.style.display = 'none';

    // Função para recuperar a instância de um editor pelo ID
    window.acessarEditorPorId = function(editorId) {
        const editor = editors.find(editor => editor[editorId]);
        return editor ? editor[editorId] : null;
    }

    // Função para recuperar o conteúdo de todos os editores
    function getAllContent() {
        const contents = {};
        if(tipo === 'objetiva'){
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
            const editorInstance = acessarEditorPorId(`#opcao${EDITOR_ID_RESPOSTA}`);
            if (editorInstance) {
                const tamanho = editorInstance.getLength();
                if (tamanho > 1) {
                    contents[`#opcao${EDITOR_ID_RESPOSTA}`] = editorInstance.getContents();
                }
            }
        }
        if (Object.keys(contents).length === 0) {
            alert("Erro: Nenhum conteúdo encontrado.");
        }
        return contents;
    }

    // Função para enviar o conteúdo do editor
    function sendEditorContent() {
        const data = getAllContent();
        console.log(data);
        const length = quill.getLength();
        const pergunta = length > 1 ? quill.getContents() : alert("A pergunta não pode estar vazia.");
        localStorage.setItem('pergunta', JSON.stringify(pergunta));
        document.getElementById('respostasSelecionadas').value = JSON.stringify(data);
        document.getElementById('pergunta').value = JSON.stringify(pergunta);
    }

    // Adicionar event listener ao botão de registro
    document.querySelector('.botao-registro').addEventListener('click', sendEditorContent);
}

// Exportar a função para uso global
window.initializeQuestionEditors = initializeQuestionEditors; 