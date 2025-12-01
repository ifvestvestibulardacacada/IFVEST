
let currentPage = 1;
const itemsPerPage = 10;
let filteredQuestoes = [];
let selectedQuestions = [];

const tbody = document.getElementById('questoes-tbody');
const paginationContainer = document.getElementById('pagination-container');
const counterSpan = document.getElementById('numero-questoes-selecionadas');
const selectAllCheckbox = document.getElementById('select-all');



// ---------- Atualizar contador ----------
function updateSelectedCount() {
    const count = selectedQuestions.length;
    counterSpan.textContent = count;
    document.getElementById('selectedQuestionIds').value = selectedQuestions.join(',');
}

// ---------- Renderizar tabela ----------
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredQuestoes.slice(start, end);

    tbody.innerHTML = '';

    if (pageItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">Nenhuma questão encontrada.</td></tr>';
    } else {
        pageItems.forEach(questao => {
            const isChecked = selectedQuestions.includes(String(questao.id_questao)) ? 'checked' : '';
            const row = document.createElement('tr');
            row.innerHTML = `
    <td class="text-center">
    <div class="form-check">
        <input 
            class="form-check-input questao-checkbox"
            type="checkbox" 
            id="questao-${questao.id_questao}"
            value="${questao.id_questao}"
            ${isChecked ? 'checked' : ''}
            aria-describedby="questao-help-${questao.id_questao}">
            
        <label 
            class="form-check-label" 
            for="questao-${questao.id_questao}">
            <!-- Você pode deixar vazio ou colocar um ícone/texto curto se quiser -->
            <span class="visually-hidden">
                Selecionar questão ${questao.id_questao}: ${questao.titulo}
            </span>
        </label>
    </div>
</td>
<td 
    data-bs-toggle="tooltip" 
    data-bs-placement="top" 
    title="${questao.titulo}"
    aria-label="Título completo: ${questao.titulo.replace(/"/g, '&quot;')}">
    ${questao.titulo.length > 40 ? questao.titulo.substring(0, 40) + '...' : questao.titulo}
</td>
                <td><span class="badge bg-secondary"
                        aria-label="Tipo da questão: ${questao.tipo}">${questao.tipo}</span></td>
                <td>
                    <div class="name text-muted small" data-delta='${questao.pergunta}'>
                        <span class="required">*</span>
                    </div>
                </td>
                <div id="questao-help-${questao.id_questao}" class="visually-hidden">
                    ${questao.pergunta.replace(/</g, '&lt;').replace(/>/g, '&gt;')} <!-- sanitiza HTML bruto -->
                    <span class="text-danger" aria-hidden="true">*</span>
                </div>
                <td aria-label="Tópicos: ${questao.Topico.map(t => t.nome).join(', ')}">
                    ${questao.Topico.map((t, i) =>
                `<span class="badge bg-light text-dark me-1">${t.nome}</span>`
            ).join('')}
                </td>
                `;
            tbody.appendChild(row);
        });
    }
    processQuillDeltas();

    // Re-inicializar tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        if (el._tooltip) el._tooltip.dispose();
        new bootstrap.Tooltip(el);
    });

    renderPagination();
    updateSelectAllState();
    updateSelectedCount();
}
function processQuillDeltas() {
    const maxLength = 100;
    const quillContainers = document.querySelectorAll('.name[data-delta]');

    quillContainers.forEach(container => {
        const deltaJson = container.getAttribute('data-delta');
        if (!deltaJson || deltaJson === 'null' || deltaJson.trim() === '') {
            container.textContent = 'Questão sem conteúdo';
            return;
        }

        try {
            const delta = JSON.parse(deltaJson);
            if (!delta || !delta.ops || delta.ops.length === 0) {
                container.textContent = 'Questão vazia';
                return;
            }

            // Criar Quill temporário (invisível)
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            document.body.appendChild(tempDiv);

            const quill = new Quill(tempDiv, {
                modules: { toolbar: false },
                readOnly: true
            });
            quill.setContents(delta);

            let text = quill.getText().trim();
            if (text.length > maxLength) {
                text = text.substring(0, maxLength) + '...';
            }

            container.textContent = text || 'Questão carregada';
            document.body.removeChild(tempDiv);
        } catch (e) {
            console.error('Erro ao processar delta:', deltaJson, e);
            container.textContent = 'Erro ao carregar questão';
        }
    });
}
// ---------- Renderizar paginação ----------
function renderPagination() {
    const pageCount = Math.max(1, Math.ceil(filteredQuestoes.length / itemsPerPage));
    paginationContainer.innerHTML = '';

    // Container principal da paginação (importante para leitores de tela)
    paginationContainer.setAttribute('role', 'navigation');
    paginationContainer.setAttribute('aria-label', 'Paginação');

    // Botão Anterior
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-outline-primary';
    prevBtn.innerHTML = '<i class="bi bi-chevron-left" aria-hidden="true"></i>';
    prevBtn.setAttribute('aria-label', 'Página anterior');
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            prevBtn.focus(); // mantém foco acessível após navegação
        }
    };
    paginationContainer.appendChild(prevBtn);

    // Números de página (máx 5 visíveis)
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(pageCount, startPage + maxVisible - 1);
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Primeiro página + reticências
    if (startPage > 1) {
        const first = document.createElement('button');
        first.className = 'btn btn-outline-primary';
        first.textContent = '1';
        first.setAttribute('aria-label', 'Ir para página 1');
        first.onclick = () => { currentPage = 1; renderTable(); first.focus(); };
        paginationContainer.appendChild(first);

        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.className = 'px-2';
            dots.textContent = '...';
            dots.setAttribute('aria-hidden', 'true'); // reticências são decorativas
            paginationContainer.appendChild(dots);
        }
    }

    // Páginas visíveis
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `btn ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
        btn.textContent = i;

        // Acessibilidade
        btn.setAttribute('aria-label', `Página ${i}${i === currentPage ? ', atual' : ''}`);
        if (i === currentPage) {
            btn.setAttribute('aria-current', 'page');
        }

        btn.onclick = () => {
            currentPage = i;
            renderTable();
            btn.focus(); // importante para navegação por teclado
        };

        paginationContainer.appendChild(btn);
    }

    // Última página + reticências
    if (endPage < pageCount) {
        if (endPage < pageCount - 1) {
            const dots = document.createElement('span');
            dots.className = 'px-2';
            dots.textContent = '...';
            dots.setAttribute('aria-hidden', 'true');
            paginationContainer.appendChild(dots);
        }

        const last = document.createElement('button');
        last.className = 'btn btn-outline-primary';
        last.textContent = pageCount;
        last.setAttribute('aria-label', `Ir para página ${pageCount}`);
        last.onclick = () => { currentPage = pageCount; renderTable(); last.focus(); };
        paginationContainer.appendChild(last);
    }

    // Botão Próximo
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-outline-primary';
    nextBtn.innerHTML = '<i class="bi bi-chevron-right" aria-hidden="true"></i>';
    nextBtn.setAttribute('aria-label', 'Próxima página');
    nextBtn.disabled = currentPage === pageCount;
    nextBtn.onclick = () => {
        if (currentPage < pageCount) {
            currentPage++;
            renderTable();
            nextBtn.focus();
        }
    };
    paginationContainer.appendChild(nextBtn);
}

// ---------- Atualizar estado do Select All ----------
function updateSelectAllState() {
    const checkboxes = tbody.querySelectorAll('.questao-checkbox');
    const checkedCheckboxes = tbody.querySelectorAll('.questao-checkbox:checked');
    selectAllCheckbox.checked = checkboxes.length > 0 && checkboxes.length === checkedCheckboxes.length;
    selectAllCheckbox.indeterminate = checkedCheckboxes.length > 0 && checkedCheckboxes.length < checkboxes.length;
}

// ---------- Select All (página atual) ----------
selectAllCheckbox.addEventListener('change', function () {
    const checkboxes = tbody.querySelectorAll('.questao-checkbox');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageIds = filteredQuestoes.slice(start, end).map(q => String(q.id_questao));

    checkboxes.forEach(cb => {
        const id = cb.value;
        if (this.checked) {
            if (!selectedQuestions.includes(id)) selectedQuestions.push(id);
            cb.checked = true;
        } else {
            selectedQuestions = selectedQuestions.filter(sid => !pageIds.includes(sid));
            if (pageIds.includes(id)) cb.checked = false;
        }
    });

    //sessionStorage.setItem('selectedQuestions_<%= simulado.id_simulado %>', JSON.stringify(selectedQuestions));
    updateSelectedCount();
});

// ---------- Checkbox individual ----------
tbody.addEventListener('change', (e) => {
    if (e.target.classList.contains('questao-checkbox')) {
        const id = e.target.value;
        if (e.target.checked) {
            if (!selectedQuestions.includes(id)) selectedQuestions.push(id);
        } else {
            selectedQuestions = selectedQuestions.filter(sid => sid !== id);
        }
        //sessionStorage.setItem('selectedQuestions_<%= simulado.id_simulado %>', JSON.stringify(selectedQuestions));
        updateSelectedCount();
        updateSelectAllState();
    }
});

// ---------- Aplicar filtros ----------
function applyFilters() {
    const titulo = (document.getElementById('titulo').value || '').toLowerCase().trim();
    const areaId = document.getElementById('areaId').value;
    const topicoId = document.getElementById('topicosSelecionados').value;

    const questoes = ContentManager.getQuestoes();
    console.log(questoes)


    filteredQuestoes = questoes.filter(questao => {
        const matchTitulo = !titulo || questao.titulo.toLowerCase().includes(titulo);
        const matchArea = !areaId || String(questao.id_area) === areaId;
        const matchTopico = !topicoId || questao.Topico.some(t => String(t.id_topico) === topicoId);
        return matchTitulo && matchArea && matchTopico;
    });

    currentPage = 1;
    renderTable();
}

// ---------- Eventos de filtro em tempo real ----------
document.getElementById('titulo').addEventListener('input', applyFilters);
document.getElementById('areaId').addEventListener('change', applyFilters);
document.getElementById('topicosSelecionados').addEventListener('change', applyFilters);

// ---------- Inicialização ----------
document.addEventListener('DOMContentLoaded', () => {
    applyFilters(); // Usa valores atuais dos inputs/selects
    updateSelectedCount();

    // Limpar ao sair
    // window.addEventListener('beforeunload', () => {
    //     sessionStorage.removeItem('selectedQuestions_<%= simulado.id_simulado %>');
    // });
});