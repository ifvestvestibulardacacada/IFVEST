document.addEventListener('DOMContentLoaded', () => {

    const treeContainer = document.getElementById('subject-tree');
    const selectedIdInput = document.getElementById('selected_subject_id');
    const selectedNameSpan = document.getElementById('selected_subject_name');

    if (!treeContainer) return;

    // Usamos "event delegation" para gerenciar todos os cliques
    treeContainer.addEventListener('click', (e) => {
        const target = e.target;

        // Caso 1: Clicou no "toggle" (±) para expandir/recolher
        if (target.classList.contains('toggle')) {
            const li = target.closest('li');
            if (li) {
                li.classList.toggle('expanded');
                // Alterna entre + e -
                target.textContent = li.classList.contains('expanded') ? '−' : '+';
            }
        }

        // Caso 2: Clicou na checkbox para selecionar
        if (target.classList.contains('subject-checkbox')) {
            const li = target.closest('li');
            if (li) {
                const id = li.dataset.id;
                const name = li.querySelector('.subject-name').textContent;

                // 1. Remove a seleção anterior (se houver)
                const currentSelected = treeContainer.querySelector('li.selected');
                if (currentSelected) {
                    currentSelected.classList.remove('selected');
                    currentSelected.querySelector('.subject-checkbox').checked = false;
                }

                // 2. Adiciona a classe 'selected' ao <li> clicado
                li.classList.add('selected');
                target.checked = true;

                // 3. Atualiza o input hidden (para o form) e o span (para o usuário)
                selectedIdInput.value = id;
                selectedNameSpan.textContent = name;
            }
        }

        // Caso 3: Clicou no nome do assunto (manter compatibilidade visual)
        if (target.classList.contains('subject-name')) {
            const li = target.closest('li');
            if (li) {
                const checkbox = li.querySelector('.subject-checkbox');
                if (checkbox) {
                    checkbox.click();
                }
            }
        }
    });
 
            // ---- Inicialização: se estivermos em modo de edição, pré-selecionar o assunto ----
            (function initPreselection() {
                try {
                    // Prioriza o valor do input oculto (pode ter sido preenchido por outro script), senão usa window.Material
                    const preId = (selectedIdInput && selectedIdInput.value) ||
                                  (window.Material && (window.Material.id_assunto || (window.Material.assunto && window.Material.assunto.id_assunto)));

                    if (!preId) return;

                    // localizar o <li> correspondente
                    const li = treeContainer.querySelector(`li[data-id="${preId}"]`);
                    if (!li) return;

                    // remover seleção anterior
                    const currentSelected = treeContainer.querySelector('li.selected');
                    if (currentSelected && currentSelected !== li) {
                        currentSelected.classList.remove('selected');
                        const cbOld = currentSelected.querySelector('.subject-checkbox');
                        if (cbOld) cbOld.checked = false;
                    }

                    // marcar este li como selecionado e checar a checkbox
                    li.classList.add('selected');
                    const checkbox = li.querySelector('.subject-checkbox');
                    if (checkbox) checkbox.checked = true;

                    // atualizar input hidden e label de exibição
                    if (selectedIdInput) selectedIdInput.value = preId;
                    const nameEl = li.querySelector('.subject-name');
                    if (nameEl && selectedNameSpan) selectedNameSpan.textContent = nameEl.textContent;

                    // expandir ancestrais para garantir que o item esteja visível
                    let parent = li.parentElement; // this is the <ul> containing li
                    while (parent && parent !== treeContainer) {
                        const parentLi = parent.closest('li');
                        if (!parentLi) break;
                        parentLi.classList.add('expanded');
                        const toggle = parentLi.querySelector('.toggle');
                        if (toggle) toggle.textContent = '−';
                        parent = parentLi.parentElement;
                    }

                    // se o próprio <li> tiver filhos e estiver expandido, ajustar seu toggle (caso exista)
                    const ownToggle = li.querySelector('.toggle');
                    if (ownToggle) {
                        ownToggle.textContent = li.classList.contains('expanded') ? '−' : '+';
                    }
                } catch (e) {
                    console.warn('Erro ao pré-selecionar assunto:', e);
                }
            })();

});
