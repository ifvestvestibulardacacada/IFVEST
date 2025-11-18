document.addEventListener('DOMContentLoaded', function () {
    // Initial setup
    const listaMateriais = window.listaMateriais || [];
    const listaAssuntos = window.listaAssuntos || [];

    if (listaMateriais.length === 0) {
        // oculta os inputs de busca se não houver materiais
        document.getElementById('searchInputs').style.display = 'none';
    }
    if (listaAssuntos.length === 0) {
        // oculta os inputs de busca se não houver assuntos
        document.getElementById('searchAssunto').style.display = 'none';
    }

    // variaveis globais de paginacao
    const assuntosPerPage = 6;
    const materiaisPerPage = 4;
    let currentAssuntosPage = 1;
    let currentMateriaisPage = 1;

    // elementos do dom
    const searchAssunto = document.getElementById('searchAssunto');
    const assuntosContainer = document.getElementById('assuntosContainer');
    const noAssuntos = document.getElementById('noAssuntos');
    const assuntosPagination = document.getElementById('assuntosPagination');
    const searchConteudo = document.getElementById('searchConteudo');
    const searchKeyword = document.getElementById('searchKeyword');
    const materiaisContainer = document.getElementById('materiaisContainer');
    const noMateriais = document.getElementById('noMateriais');
    const materiaisPagination = document.getElementById('materiaisPagination');

    // funcao de paginacao
    function paginate(items, page, perPage) {
        const start = (page - 1) * perPage;
        return items.slice(start, start + perPage);
    }

    // render de paginacao
    function renderPagination(container, totalItems, currentPage, type) {
        container.innerHTML = '';
        const perPage = type === 'assuntos' ? assuntosPerPage : materiaisPerPage;
        const totalPages = Math.ceil(totalItems / perPage);
        if (totalPages <= 1) return;

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 1;
        prevButton.className = currentPage === 1 ? 'disabled' : '';
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                if (type === 'assuntos') {
                    currentAssuntosPage--;
                    updateAssuntosDisplay();
                } else {
                    currentMateriaisPage--;
                    updateMateriaisDisplay();
                }
            }
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Próximo';
        nextButton.disabled = currentPage === totalPages;
        nextButton.className = currentPage === totalPages ? 'disabled' : '';
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                if (type === 'assuntos') {
                    currentAssuntosPage++;
                    updateAssuntosDisplay();
                } else {
                    currentMateriaisPage++;
                    updateMateriaisDisplay();
                }
            }
        });

        const pageInfo = document.createElement('span');
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        container.appendChild(prevButton);
        container.appendChild(pageInfo);
        container.appendChild(nextButton);
    }

    // Filter and paginate assuntos
    function updateAssuntosDisplay() {

        const filter = searchAssunto ? searchAssunto.value.toLowerCase() : '';
        const filteredAssuntos = listaAssuntos.filter(assunto =>
            assunto.nome.toLowerCase().includes(filter)
        );

        const paginatedAssuntos = paginate(filteredAssuntos, currentAssuntosPage, assuntosPerPage);
        const assuntoItems = assuntosContainer.querySelectorAll('.assunto-item');
        assuntoItems.forEach(item => item.style.display = 'none');
        paginatedAssuntos.forEach(assunto => {
            const item = Array.from(assuntoItems).find(
                el => el.getAttribute('href') === `/revisao/busca/${assunto.id_assunto}`
            );
            if (item) item.style.display = '';
        });

        
        noAssuntos.style.display = filteredAssuntos.length === 0 ? '' : 'none';
        renderPagination(assuntosPagination, filteredAssuntos.length, currentAssuntosPage, 'assuntos');
    }


    function updateMateriaisDisplay() {
        const filterNome = searchConteudo ? searchConteudo.value.toLowerCase() : '';
        const filterKeyword = searchKeyword ? searchKeyword.value.toLowerCase() : '';

        const filteredMateriais = listaMateriais.filter(conteudo => {
            const name = conteudo.nome.toLowerCase();
            const keywords = conteudo.PalavraChave ? conteudo.PalavraChave.map(keyword => keyword.palavrachave.toLowerCase()).join(',') : '';
            const matchesNome = name.includes(filterNome);
            const matchesKeyword = !filterKeyword || keywords.split(',').includes(filterKeyword);
            return matchesNome && matchesKeyword;
        });

        const paginatedMateriais = paginate(filteredMateriais, currentMateriaisPage, materiaisPerPage);
        const materialItems = materiaisContainer.querySelectorAll('.material-item');
        materialItems.forEach(item => item.style.display = 'none');
        paginatedMateriais.forEach(conteudo => {
            const item = Array.from(materialItems).find(
                el => el.getAttribute('href') === `/revisao/leitura/${conteudo.id_conteudo}`
            );
            if (item) item.style.display = '';
        });

        
        noMateriais.style.display = filteredMateriais.length === 0 ? '' : 'none';
        renderPagination(materiaisPagination, filteredMateriais.length, currentMateriaisPage, 'materiais');
    }

    // Event listeners
    if (searchAssunto) {
        searchAssunto.addEventListener('input', () => {
            currentAssuntosPage = 1;
            updateAssuntosDisplay();
        });
    }

    if (searchConteudo) {
        searchConteudo.addEventListener('input', () => {
            currentMateriaisPage = 1;
            updateMateriaisDisplay();
        });
    }

    if (searchKeyword) {
        searchKeyword.addEventListener('change', () => {
            currentMateriaisPage = 1;
            updateMateriaisDisplay();
            console.log('searchKeyword changed:', searchKeyword.value); // Debug: Log change
        });
    }

    // Initial render
    updateAssuntosDisplay();
    updateMateriaisDisplay();
});