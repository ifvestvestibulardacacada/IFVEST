     

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