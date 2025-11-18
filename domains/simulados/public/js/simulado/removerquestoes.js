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

        // ---------- Processar Quill Delta ----------
        function processQuillDeltas() {
            const maxLength = 100;
            const containers = document.querySelectorAll('.name[data-delta]');

            containers.forEach(container => {
                const deltaJson = container.getAttribute('data-delta');
                if (!deltaJson || deltaJson === 'null') {
                    container.textContent = 'Sem conteúdo';
                    return;
                }

                try {
                    const delta = JSON.parse(deltaJson);
                    if (!delta?.ops?.length) {
                        container.textContent = 'Questão vazia';
                        return;
                    }

                    const tempDiv = document.createElement('div');
                    tempDiv.style.position = 'absolute';
                    tempDiv.style.left = '-9999px';
                    document.body.appendChild(tempDiv);

                    const quill = new Quill(tempDiv, { modules: { toolbar: false }, readOnly: true });
                    quill.setContents(delta);
                    let text = quill.getText().trim();

                    if (text.length > maxLength) text = text.substring(0, maxLength) + '...';
                    container.textContent = text || 'Questão carregada';

                    document.body.removeChild(tempDiv);
                } catch (e) {
                    console.error('Erro Quill:', e);
                    container.textContent = 'Erro ao carregar';
                }
            });
        }

        // ---------- Renderizar tabela ----------
        function renderTable() {
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageItems = filteredQuestoes.slice(start, end);

            tbody.innerHTML = '';

            if (pageItems.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">Nenhuma questão encontrada.</td></tr>';
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
                    `;
                    tbody.appendChild(row);
                });
            }

            processQuillDeltas();

            // Tooltips
            document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
                if (el._tooltip) el._tooltip.dispose();
                new bootstrap.Tooltip(el);
            });

            renderPagination();
            updateSelectAllState();
            updateSelectedCount();
        }

        // ---------- Paginação ----------
        function renderPagination() {
            const pageCount = Math.max(1, Math.ceil(filteredQuestoes.length / itemsPerPage));
            paginationContainer.innerHTML = '';

            const prevBtn = document.createElement('button');
            prevBtn.className = 'btn btn-outline-primary';
            prevBtn.innerHTML = '<i class="bi bi-chevron-left"></i>';
            prevBtn.disabled = currentPage === 1;
            prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderTable(); } };
            paginationContainer.appendChild(prevBtn);

            const maxVisible = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let endPage = Math.min(pageCount, startPage + maxVisible - 1);
            if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);

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

            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn btn-outline-primary';
            nextBtn.innerHTML = '<i class="bi bi-chevron-right"></i>';
            nextBtn.disabled = currentPage === pageCount;
            nextBtn.onclick = () => { if (currentPage < pageCount) { currentPage++; renderTable(); } };
            paginationContainer.appendChild(nextBtn);
        }

        // ---------- Select All ----------
        function updateSelectAllState() {
            const checkboxes = tbody.querySelectorAll('.questao-checkbox');
            const checked = tbody.querySelectorAll('.questao-checkbox:checked');
            selectAllCheckbox.checked = checkboxes.length > 0 && checkboxes.length === checked.length;
            selectAllCheckbox.indeterminate = checked.length > 0 && checked.length < checkboxes.length;
        }

        selectAllCheckbox.addEventListener('change', function () {
            const checkboxes = tbody.querySelectorAll('.questao-checkbox');
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageIds = filteredQuestoes.slice(start, end).map(q => String(q.id_questao));

            checkboxes.forEach(cb => {
                const id = cb.value;
                if (this.checked && !selectedQuestions.includes(id)) {
                    selectedQuestions.push(id);
                    cb.checked = true;
                } else if (!this.checked && pageIds.includes(id)) {
                    selectedQuestions = selectedQuestions.filter(sid => sid !== id);
                    cb.checked = false;
                }
            });

            
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
                
                updateSelectedCount();
                updateSelectAllState();
            }
        });

        // ---------- Filtro em tempo real ----------
        function applyFilters() {
            const titulo = (document.getElementById('titulo').value || '').toLowerCase().trim();
            const questoes = ContentManager.getQuestoes();
            console.log(questoes)
            filteredQuestoes = questoes.filter(q => 
                q.titulo.toLowerCase().includes(titulo)
            );
            currentPage = 1;
            renderTable();
        }

        document.getElementById('titulo').addEventListener('input', applyFilters);

        // ---------- Inicialização ----------
        document.addEventListener('DOMContentLoaded', () => {
            applyFilters();
            updateSelectedCount();

      
        });