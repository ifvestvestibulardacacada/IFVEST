


document.addEventListener('DOMContentLoaded', function () {

    // Função para enviar o formulário
    document.querySelector('form').addEventListener('submit', function (event) {
        // Impede o envio do formulário para poder testar

        // Aqui você pode adicionar qualquer lógica adicional antes de enviar o formulário

        // Permita que o formulário seja enviado normalmente
        this.submit(); // Descomente esta linha para enviar o formulário após o teste
    });
});


async function initializeEditQuestionEditors(questao, opcoes) {
    // const loadingContainer = document.getElementById('loading-container');
    const editors = [];
    const opcoesIds = [];
    const tipo = questao.tipo;

    const parsedContent = questao.pergunta;
    const parsedOpcoes = opcoes;
    const deltaContent = JSON.parse(parsedContent);


    const quill = initializeQuill('#editor-container', 'editor-open-btn');
    quill.setContents(deltaContent);

    editors.push({ [`#editor-container`]: quill });
    const editorIds = (tipo === 'OBJETIVA') ? ['A', 'B', 'C', 'D', 'E'] : ['resposta'];

    editorIds.forEach(id => {
        const editorId = id === 'resposta' ? '#resposta' : `#opcao${id}`;
        const buttonId = id === 'resposta' ? 'editor-open-btn-resposta' : `editor-open-btn${id}`;

        // Encontre a opção correspondente em parsedOpcoes
        console.log(parsedOpcoes)
        const opcao = tipo === 'OBJETIVA'
            ? parsedOpcoes.find(op => op.alternativa === id)
            : parsedOpcoes.find(op => !op.alternativa || op.alternativa === 'A');

        // Inicializa o editor independentemente de a opção existir
        const editorInstance = initializeQuill(editorId, buttonId);
        if (opcao) {
            editorInstance.setContents(JSON.parse(opcao.descricao));
            editors.push({ [editorId]: editorInstance });
            opcoesIds.push({ [editorId]: opcao.id_opcao });
        } else {
            console.warn(`Opção não encontrada para o ID: ${id}`);
            editors.push({ [editorId]: editorInstance });
            opcoesIds.push({ [editorId]: null }); // Usa null para indicar que não há id_opcao
        }
    });

    // Função para acessar editores por ID
    function acessarEditoresPorId(editorId) {
        const editor = editors.find(editor => editor[editorId]);
        return editor ? editor[editorId] : null;
    }
    window.acessarEditorPorId = acessarEditoresPorId;
    // loadingContainer.style.display = 'none';

    // Função para recuperar o conteúdo de todos os editores
    function getAllContent() {
        const contents = {};

        editorIds.forEach(id => {
            const editorId = id === 'resposta' ? '#resposta' : `#opcao${id}`;
            const opcaoId = opcoesIds.find(opcao => opcao[editorId])?.[editorId] || null;
            const editorInstance = acessarEditoresPorId(editorId);

            if (editorInstance) {
                const tamanho = editorInstance.getLength();
                if (tamanho > 1) {
                    contents[editorId] = {
                        content: editorInstance.getContents(),
                        id: opcaoId
                    };
                }
            } else {
                console.warn(`Editor não encontrado para o ID: ${editorId}`);
            }
        });

        if (Object.keys(contents).length === 0) {
            alert("Erro: Nenhum conteúdo encontrado.");
            return null;
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

        let tipo = questionType;
        tipo = tipo.toUpperCase(); // Corrigido de "windows" para "window"

        const pergunta = quill.getContents();
        const data = getAllContent(); // Conteúdo das alternativas/resposta

        const formData = {
            id: questao.id_questao.toString(),
            tipo: tipo,
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

            axios.post("/professor/editar_questao", formData, {
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
                    if (tipo === 'OBJETIVA') {
                        editorIds.forEach(id => {
                            const editor = acessarEditorPorId(`#opcao${id}`);
                            if (editor) editor.setContents([]);
                        });
                    } else {
                        const editor = acessarEditorPorId(`#resposta`);
                        if (editor) editor.setContents([]);
                    }
                    window.location.href = '/professor/questoes';
                    return;
                }
                })
                .catch(error => {
                    console.error('Error:', error.response?.data || error.message);
                    alert(`Erro ao criar material: ${error.response?.data?.error || 'Tente novamente.'}`);
                });
        } catch (error) {

            console.error('Unexpected error:', error.message);
            alert('Erro inesperado ao validar os dados.');

        }
    }

    // Adicionar event listener ao botão de registro
    document.querySelector('#submitButton').addEventListener('click', sendEditorContent);
}

// Exportar a função para uso global
window.initializeEditQuestionEditors = initializeEditQuestionEditors;

