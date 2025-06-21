
const formSection = document.getElementById('formSection');
const newContentSection = document.getElementById('newContentSection');
const tipoSelect = document.getElementById('tipo');
const questoesTable = document.getElementById('questoesTable');
const questoesBody = document.getElementById('questoesBody');
const selectAllCheckbox = document.getElementById('selectAll');
const contador = document.getElementById('numero-questoes-selecionadas');
const paginationContainer = document.getElementById('pagination');

let currentPage = 1;
const itemsPerPage = 10;
let filteredQuestoes = [];

function goToNewContent() {
    formSection.style.display = 'none';
    newContentSection.style.display = 'flex';
    applyFilters();
}

function goBack() {
    newContentSection.style.display = 'none';
    formSection.style.display = 'flex';
}

function applyFilters(questoes) {
    const tipo = tipoSelect.value || 'Aleatorio';
    const tituloFiltro = document.getElementById('tituloFiltro').value.toLowerCase() || '';

    console.log('Filter inputs:', { tipo, tituloFiltro });

    filteredQuestoes = questoes.filter(questao => {
        const rowTipo = (questao.tipo || '').toUpperCase();
        const normalizedTipo = tipo === 'Dissertativo' ? 'DISSERTATIVA' : tipo === 'Objetivo' ? 'OBJETIVA' : tipo;
        const rowTitulo = (questao.titulo || '').toLowerCase();

        const matchesTipo = normalizedTipo === 'Aleatorio' || rowTipo === normalizedTipo;
        const matchesTitulo = rowTitulo.includes(tituloFiltro);

        console.log('Questao evaluation:', { rowTipo, normalizedTipo, matchesTipo, rowTitulo, matchesTitulo });

        return matchesTipo && matchesTitulo;
    });

    console.log('Filtered Questoes:', filteredQuestoes.length, filteredQuestoes);

    renderTable();
}

function renderTable() {
    questoesBody.innerHTML = '';

    if (filteredQuestoes.length === 0) {
        questoesBody.innerHTML = '<tr><td colspan="5">Nenhuma questão encontrada após filtro.</td></tr>';
        paginationContainer.innerHTML = '';
        updateSelectedCount();
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedQuestoes = filteredQuestoes.slice(start, end);

    paginatedQuestoes.forEach(questao => {
        const row = document.createElement('tr');
        row.dataset.tipo = questao.tipo || '';
        const pergunta = questao.pergunta || '';
        row.innerHTML = `
            <td><input type="checkbox" class="questao-checkbox" name="questoesSelecionadas" value="${questao.id_questao || ''}"></td>
            <td>${questao.titulo || 'Sem título'}</td>
            <td>${questao.tipo || 'Desconhecido'}</td>
            <td><div class="name" data-delta='${encodeURIComponent(pergunta)}'></div></td>
            <td>${questao.Topico && questao.Topico.length > 0 ? questao.Topico.map(topico => topico.nome || 'Sem nome').join(', ') : 'Sem tópico'}</td>
        `;
        questoesBody.appendChild(row);
    });

    // Process Quill content
    try {
        const maxLength = 100;
        document.querySelectorAll('.name').forEach(div => {
            try {
                const delta = decodeURIComponent(div.dataset.delta || '');
                if (!delta) {
                    div.textContent = 'Sem conteúdo';
                    return;
                }
                const parsedDelta = JSON.parse(delta);
                const tempDiv = document.createElement('div');
                const tempQuill = new Quill(tempDiv, { modules: { toolbar: false } });
                tempQuill.setContents(parsedDelta);
                let text = tempQuill.getText().trim();
                if (text.length > maxLength) {
                    text = text.substring(0, maxLength);
                }
                text += '...';
                div.textContent = text || 'Questão carregada';
            } catch (e) {
                console.error('Error processing Quill delta for div:', div.dataset.delta, e);
                div.textContent = 'Erro ao carregar questão';
            }
        });
    } catch (e) {
        console.error('Error initializing Quill:', e);
        document.querySelectorAll('.name').forEach(div => {
            div.textContent = 'Erro ao inicializar Quill';
        });
    }

    renderPagination();
    updateSelectedCount();
}

function renderPagination() {
    const pageCount = Math.ceil(filteredQuestoes.length / itemsPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.disabled = i === currentPage;
        button.onclick = () => {
            currentPage = i;
            renderTable();
        };
        paginationContainer.appendChild(button);
    }
}

function updateSelectedCount() {
    const selectedCount = document.querySelectorAll('.questao-checkbox:checked').length;
    contador.textContent = selectedCount;
    document.getElementById('selectedQuestionIds').value = Array.from(
        document.querySelectorAll('.questao-checkbox:checked')
    ).map(cb => cb.value).join(',');
}

selectAllCheckbox.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll('.questao-checkbox');
    checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
    updateSelectedCount();
});

questoesBody.addEventListener('change', (e) => {
    if (e.target.classList.contains('questao-checkbox')) {
        updateSelectedCount();
        selectAllCheckbox.checked = document.querySelectorAll('.questao-checkbox').length ===
            document.querySelectorAll('.questao-checkbox:checked').length;
    }
});

function saveSimulado() {
    alert('Simulado salvo com sucesso!');
}

document.addEventListener('DOMContentLoaded', () => {
    applyFilters();
});
simuladoForm.addEventListener('submit', (e) => {
    const selectedQuestionIds = document.getElementById('selectedQuestionIds').value;
    if (!selectedQuestionIds) {
        e.preventDefault();
        alert('Por favor, selecione pelo menos uma questão.');
        return;
    }
    // Optional: Add loading state
    const saveButton = document.querySelector('.salvar-btn');
    saveButton.disabled = true;
    saveButton.textContent = 'Salvando...';
});