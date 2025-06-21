document.getElementById('areaId').addEventListener('change', function () {
    var searchContainer = document.getElementById('topicosSearchContainer');
    if (this.value === '') {
        // Oculta a barra de pesquisa se nenhuma área for selecionada
        searchContainer.style.display = 'none';
    } else {
        // Exibe a barra de pesquisa se uma área for selecionada
        searchContainer.style.display = 'block';
    }
});
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search').addEventListener('input', function (e) {
        console.log('Pesquisa:', e.target.value);
        var searchValue = e.target.value.toLowerCase();
        var listItems = document.querySelectorAll('#dropdown-list li');

        listItems.forEach(function (item) {
            var label = item.querySelector('label').textContent.toLowerCase();
            if (label.indexOf(searchValue) > -1) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {

    // Função para enviar o formulário
    document.querySelector('form').addEventListener('submit', function (event) {
        // Impede o envio do formulário para poder testar

        // Aqui você pode adicionar qualquer lógica adicional antes de enviar o formulário

        // Permita que o formulário seja enviado normalmente
        this.submit(); // Descomente esta linha para enviar o formulário após o teste
    });
});


function initializeEditQuestionEditors(questao, opcoes) {
    const loadingContainer = document.getElementById('loading-container');
    const editors = [];
    const opcoesIds = [];
    const tipo = questao.tipo;

    const parsedContent = questao.pergunta;
    const parsedOpcoes = opcoes;
    const deltaContent = JSON.parse(parsedContent);


    const quill = initializeQuill('#editor-container', 'editor-open-btn');
    quill.setContents(deltaContent);

    editors.push({[`#editor-container`]:quill});
    const editorIds = (tipo === 'OBJETIVA') ? ['A', 'B', 'C', 'D', 'E'] : ['A'];
    
    editorIds.forEach(id => {
        // Encontre a opção correspondente em parsedOpcoes
        const opcao = parsedOpcoes.find(op => op.alternativa === id);

        // Verifique se a opção foi encontrada
        const editorInstance = initializeQuill(`#opcao${id}`, `editor-open-btn${id}`);
        if (opcao) {
            editorInstance.setContents(JSON.parse(opcao.descricao));
            editors.push({ [`#opcao${id}`]: editorInstance });
            opcoesIds.push({ [`#opcao${id}`]: opcao.id_opcao });
        } else {
            console.warn(`Opção não encontrada para o ID: ${id}`);
        }
    });

    // Função para acessar editores por ID
    function acessarEditoresPorId(editorId) {
        const editor = editors.find(editor => editor[editorId]);
        return editor ? editor[editorId] : null;
    }
    window.acessarEditorPorId = acessarEditoresPorId;
    loadingContainer.style.display = 'none';

    // Função para recuperar o conteúdo de todos os editores
    function getAllContent() {
        const contents = {};
        editorIds.forEach(id => {
            const opcaoId = opcoesIds.find((opcao => opcao[`#opcao${id}`]));

            const editorInstance = acessarEditoresPorId(`#opcao${id}`);
            if (editorInstance) {
                const tamanho = editorInstance.getLength();
                if (tamanho > 1) {
                    contents[`#opcao${id}`] = { 
                        content: editorInstance.getContents(), 
                        id: opcaoId[`#opcao${id}`] 
                    };
                }
            }
        });

        if (Object.keys(contents).length === 0) {
            alert("Erro: Nenhum conteúdo encontrado.");
        }

        return contents;
    }

    // Função para enviar o conteúdo do editor
    function sendEditorContent() {
        const data = getAllContent();
        const length = quill.getLength();
        const pergunta = length > 1 ? quill.getContents() : alert("A pergunta não pode estar vazia.");

        if(!data){
            alert("A pergunta não pode estar vazia.")
        }else{
            localStorage.setItem('data', JSON.stringify(data));
            document.getElementById('respostasSelecionadas').value = JSON.stringify(data);
            document.getElementById('pergunta').value = JSON.stringify(pergunta);
        }
        

    }

    // Adicionar event listener ao botão de registro
    document.querySelector('.botao-registro').addEventListener('click', sendEditorContent);
}

// Exportar a função para uso global
window.initializeEditQuestionEditors = initializeEditQuestionEditors;


// Exemplo de uso:


// Inserindo no Quill editor
// Wait for the DOM to load completely