// Function to add items to the dropdown
function addItemsToDropdown(Areas) {
    const areaSelect = document.getElementById('areaId');
    const selectedAreaId = areaSelect.value;
    const selectedArea = Areas.find(area => area.id_area === parseInt(selectedAreaId));
    const topicos = selectedArea ? selectedArea.Topico : [];

    const dropdownList = document.getElementById('dropdown-list');
    dropdownList.innerHTML = '';

    topicos.forEach(function (topico) {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'topicosSelecionados[]';
        checkbox.value = topico.id_topico;
        checkbox.id = 'topico-' + topico.id_topico;

        const label = document.createElement('label');
        label.htmlFor = 'topico-' + topico.id_topico;
        label.textContent = topico.nome;

        checkbox.addEventListener('change', function () {
            updateSelectedTopics();
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        dropdownList.appendChild(listItem);
    });
}

// Function to update selected topics
function updateSelectedTopics() {
   
        const selectedTopics = document.querySelectorAll('#dropdown-list input[type="checkbox"]:checked');

        // Verifica se há tópicos selecionados


        const selectedTopicIds = Array.from(selectedTopics).map(function (checkbox) {
            return checkbox.id.replace('topico-', '');
        });

        // Atualiza o valor do campo oculto com os IDs dos tópicos selecionados
        document.getElementById('topicosSelecionados').value = JSON.stringify(selectedTopicIds);

}
// Function to handle search in the dropdown
function handleSearch(inputValue) {
    const dropdownList = document.getElementById('dropdown-list');
    const searchInput = document.getElementById('search');
    
    // Filter the list based on the search input
    const filteredItems = topicos.filter(item => 
        item.nome.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    // Update the dropdown list with filtered items
    dropdownList.innerHTML = '';
    filteredItems.forEach(item => {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'topicosSelecionados[]';
        checkbox.value = item.id_topico;
        checkbox.id = 'topico-' + item.id_topico;

        const label = document.createElement('label');
        label.htmlFor = 'topico-' + item.id_topico;
        label.textContent = item.nome;

        checkbox.addEventListener('change', function () {
            updateSelectedTopics();
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        dropdownList.appendChild(listItem);
    });
}

async function loadTopicDropdown(AreaId) {
    const response = await fetch(`/professor/topicos/${AreaId}`);
   
    const data = await response.json();
    const topicos = data;


    const dropdownList = document.getElementById('dropdown-list');
    dropdownList.innerHTML = '';

    topicos.forEach(topic => {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'topicosSelecionados[]';
        checkbox.value = topic.id_topico;

        const label = document.createElement('label');
        label.htmlFor = 'topico-' + topic.id_topico;
        label.textContent = topic.nome;

        checkbox.checked = topic.selected; // Inicializa como selecionado

        checkbox.addEventListener('change', function () {
            updateSelectedTopics();
        });

        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        dropdownList.appendChild(listItem);
    });
}
// Event listener for search input
document.getElementById('search').addEventListener('input', function() {
    handleSearch(this.value);
});
document.getElementById('areaId').addEventListener('change', async function() {
    const AreaId = this.value;
    await loadTopicDropdown(AreaId);
});