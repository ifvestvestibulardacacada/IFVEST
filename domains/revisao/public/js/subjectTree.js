document.addEventListener('DOMContentLoaded', () => {

    const treeContainer = document.getElementById('subject-tree');
    const selectedIdInput = document.getElementById('selected_subject_id');
    const selectedNameSpan = document.getElementById('selected_subject_name');

    if (!treeContainer) return;

    // Usamos "event delegation" para gerenciar todos os cliques
    treeContainer.addEventListener('click', (e) => {
        const target = e.target;

        // Caso 1: Clicou no "toggle" (►) para expandir/recolher
        if (target.classList.contains('toggle')) {
            const li = target.closest('li');
            if (li) {
                li.classList.toggle('expanded');
            }
        }

        // Caso 2: Clicou no nome do assunto para selecionar
        if (target.classList.contains('subject-name')) {
            const li = target.closest('li');
            if (li) {
                const id = li.dataset.id;
                const name = target.textContent;

                // 1. Remove a seleção anterior (se houver)
                const currentSelected = treeContainer.querySelector('li.selected');
                if (currentSelected) {
                    currentSelected.classList.remove('selected');
                }

                // 2. Adiciona a classe 'selected' ao <li> clicado
                li.classList.add('selected');

                // 3. Atualiza o input hidden (para o form) e o span (para o usuário)
                selectedIdInput.value = id;
                selectedNameSpan.textContent = name;
            }
        }
    });
});
