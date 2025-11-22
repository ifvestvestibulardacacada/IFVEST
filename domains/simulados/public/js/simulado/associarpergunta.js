
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