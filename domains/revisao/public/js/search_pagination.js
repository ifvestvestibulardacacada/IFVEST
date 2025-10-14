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
            //procura pelo termo de pesquisa dentro do array de assuntos
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

        //console.log('Assuntos visíveis:', Array.from(assuntoItems).filter(item => item.style.display !== 'none').map(item => item.getAttribute('href')));
        noAssuntos.style.display = filteredAssuntos.length === 0 ? '' : 'none';
        renderPagination(assuntosPagination, filteredAssuntos.length, currentAssuntosPage, 'assuntos');
    }

    // Filter and paginate materiais
    function updateMateriaisDisplay() {
        const filterNome = searchConteudo ? searchConteudo.value.toLowerCase() : '';
        const filterKeyword = searchKeyword ? searchKeyword.value.toLowerCase() : '';
        console.log('filterKeyword:', filterKeyword); // Debug: Log selected keyword
        const filteredMateriais = listaMateriais.filter(conteudo => {
            console.log('Conteudo para filtro:', JSON.stringify(conteudo)); // Debug: Log content being checked
            const name = conteudo.nome.toLowerCase();
            const keywords = conteudo.PalavraChave ? conteudo.PalavraChave.map(keyword => keyword.palavrachave.toLowerCase()).join(',') : '';
            //console.log('Conteudo:', conteudo.id_conteudo, 'Keywords:', keywords); // Debug: Log keywords
            const matchesNome = name.includes(filterNome);

            //console.log(JSON.stringify(keywords)); // Debug: Log keywords array

            const matchesKeyword = !filterKeyword || keywords.split(',').includes(filterKeyword);
            //console.log('Conteudo:', conteudo.id_conteudo, 'Keywords:', keywords);
            //console.log('filterKeyword', filterKeyword, 'matchesKeyword', matchesKeyword);
            return matchesNome && matchesKeyword;
        });

        console.log('filteredMateriais:', filteredMateriais.map(c => c.id_conteudo)); // Debug: Log filtered IDs
        const paginatedMateriais = paginate(filteredMateriais, currentMateriaisPage, materiaisPerPage);
        const materialItems = materiaisContainer.querySelectorAll('.material-item');
        materialItems.forEach(item => item.style.display = 'none');
        paginatedMateriais.forEach(conteudo => {
            const item = Array.from(materialItems).find(
                el => el.getAttribute('href') === `/revisao/leitura/${conteudo.id_conteudo}`
            );
            if (item) item.style.display = '';
        });

        console.log('Materiais visíveis:', Array.from(materialItems).filter(item => item.style.display !== 'none').map(item => item.getAttribute('href')));
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