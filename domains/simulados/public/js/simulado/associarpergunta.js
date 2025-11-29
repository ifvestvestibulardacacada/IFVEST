 
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
                    <td>
                        <input type="checkbox" class="form-check-input questao-checkbox"
                               value="${questao.id_questao}" ${isChecked}>
                    </td>
                    <td data-bs-toggle="tooltip" data-bs-placement="top" title="${questao.titulo}">
                        ${questao.titulo.length > 40 ? questao.titulo.substring(0,40)+'...' : questao.titulo}
                    </td>
                    <td><span class="badge bg-secondary">${questao.tipo}</span></td>
                    <td>
                        <div class="name text-muted small" data-delta='${questao.pergunta}'>
                            <span class="required">*</span>
                        </div>
                    </td>
                    <td>
                        ${questao.Topico.map((t, i) => t.nome + (i < questao.Topico.length - 1 ? ', ' : '')).join('')}
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

        // Botão Anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn-outline-primary';
        prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
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

        if (startPage > 1) {
            const first = document.createElement('button');
            first.className = 'btn btn-outline-primary';
            first.textContent = '1';
            first.onclick = () => { currentPage = 1; renderTable(); };
            paginationContainer.appendChild(first);
            if (startPage > 2) {
                const dots = document.createElement('span');
                dots.className = 'px-2';
                dots.textContent = '...';
                paginationContainer.appendChild(dots);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.className = `btn ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
            btn.textContent = i;
            btn.onclick = () => { currentPage = i; renderTable(); };
            paginationContainer.appendChild(btn);
        }

        if (endPage < pageCount) {
            if (endPage < pageCount - 1) {
                const dots = document.createElement('span');
                dots.className = 'px-2';
                dots.textContent = '...';
                paginationContainer.appendChild(dots);
            }
            const last = document.createElement('button');
            last.className = 'btn btn-outline-primary';
            last.textContent = pageCount;
            last.onclick = () => { currentPage = pageCount; renderTable(); };
            paginationContainer.appendChild(last);
        }

        // Botão Próximo
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-outline-primary';
        nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
        nextBtn.disabled = currentPage === pageCount;
        nextBtn.onclick = () => {
            if (currentPage < pageCount) {
                currentPage++;
                renderTable();
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