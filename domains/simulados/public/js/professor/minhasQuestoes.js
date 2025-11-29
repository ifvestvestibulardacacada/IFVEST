

// Função para renderizar conteúdos do Quill (se estiver usando)



let questoesFiltradas = [...questoes];

const ITENS_POR_PAGINA = 10;
let paginaAtual = 1;

// === FUNÇÕES ===
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function filtrarQuestoes() {
    const titulo = document.getElementById('titulo').value.trim().toLowerCase();
    const areaId = document.getElementById('areaId').value;
    const topicoId = document.getElementById('topicosSelecionados').value;

    questoesFiltradas = questoes.filter(questao => {
        const matchTitulo = !titulo || questao.titulo.toLowerCase().includes(titulo);
        const matchArea = !areaId || questao.id_area == areaId;
        const matchTopico = !topicoId || questao.Topico.some(t => t.id_topico == topicoId);
        return matchTitulo && matchArea && matchTopico;
    });

    paginaAtual = 1; // resetar para página 1
    renderizar();
}
function renderizarQuill() {
    document.querySelectorAll('.questao-content').forEach(el => {
            const deltaStr = el.getAttribute('data-delta');
            if (deltaStr && typeof Quill !== 'undefined') {
                try {
                    const delta = JSON.parse(deltaStr);
                 const tempDiv = document.createElement('div');
                    const tempQuill = new Quill(tempDiv, { modules: { toolbar: false } });
                    tempQuill.setContents(delta);

                    let text = tempQuill.getText();
                    const maxLength = 40;

                    if (text.length > maxLength) {
                        text = text.substring(0, maxLength);
                    }

                    if (text.length <= maxLength) {
                        text += '...';
                    }
                    el.textContent = text;
                } catch (e) {
                    el.textContent = `Erro ao carregar questão: ${e.message}`;
                }
            }
        });

}


function renderizarTabela() {
    const tbody = document.getElementById('questoesTableBody');
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    const pagina = questoesFiltradas.slice(inicio, fim);

    if (pagina.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Nenhuma questão encontrada.</td></tr>`;
        return;
    }

    tbody.innerHTML = pagina.map(questao => {
        const topicosNomes = questao.Topico.map(t => t.nome).join(', ');
        return `
                <tr>
                    <td>${escapeHtml(questao.titulo)}</td>
                    <td>${escapeHtml(questao.tipo)}</td>
                    <td>
                        <div class="questao-content" data-delta='${questao.pergunta.replace(/'/g, "\\'")}'>
                            <!-- Quill vai renderizar aqui -->
                        </div>
                    </td>
                    <td>${escapeHtml(topicosNomes)}</td>
                    <td>
                        <div class="d-flex gap-2">
                            <a href="/professor/editar_questao/${questao.id_questao}"
                               class="btn btn-outline-primary btn-sm">
                                <i class="bi bi-pencil"></i> Editar
                            </a>
                            <button type="button" class="btn btn-outline-danger btn-sm"
                                    onclick="confirmDelete(${questao.id_questao})">
                                <i class="bi bi-trash"></i> Excluir
                            </button>
                            <form id="deleteForm${questao.id_questao}"
                                  action="/professor/excluir-questao/${questao.id_questao}?_method=DELETE"
                                  method="POST" style="display: none;"></form>
                        </div>
                    </td>
                </tr>
            `;
    }).join('');

    // Renderizar Quill (se usar)
    renderizarQuill();
}


function renderizarPaginacao() {
    const totalPaginas = Math.ceil(questoesFiltradas.length / ITENS_POR_PAGINA);
    const paginacao = document.getElementById('pagination');

    if (totalPaginas <= 1) {
        paginacao.innerHTML = '';
        return;
    }

    let html = '';

    // Anterior
    html += `<li class="page-item ${paginaAtual === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${paginaAtual - 1}">Anterior</a>
        </li>`;

    // Páginas
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= paginaAtual - 2 && i <= paginaAtual + 2)) {
            html += `<li class="page-item ${i === paginaAtual ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>`;
        } else if (i === paginaAtual - 3 || i === paginaAtual + 3) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // Próxima
    html += `<li class="page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${paginaAtual + 1}">Próxima</a>
        </li>`;

    paginacao.innerHTML = html;

    // Eventos de clique
    paginacao.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = parseInt(link.getAttribute('data-page'));
            if (page >= 1 && page <= totalPaginas && page !== paginaAtual) {
                paginaAtual = page;
                renderizar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

function atualizarInfo() {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA + 1;
    const fim = Math.min(paginaAtual * ITENS_POR_PAGINA, questoesFiltradas.length);
    const total = questoesFiltradas.length;

    document.getElementById('resultsInfo').textContent =
        total === 0 ? 'Nenhuma questão encontrada' :
            `Mostrando ${inicio}–${fim} de ${total} questões`;
}

function renderizar() {
    renderizarTabela();
    renderizarPaginacao();
    atualizarInfo();
}

// === EVENTOS ===
document.getElementById('filterForm').addEventListener('submit', e => {
    e.preventDefault();
    filtrarQuestoes();
});

['titulo', 'areaId', 'topicosSelecionados'].forEach(id => {
    document.getElementById(id).addEventListener('input', filtrarQuestoes);
    document.getElementById(id).addEventListener('change', filtrarQuestoes);
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderizar();
});