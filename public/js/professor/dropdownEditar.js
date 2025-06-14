// Function to add items to the dropdown
function addItemsToDropdown(Areas, Topicos) {
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

        const label = document.createElement('label');
        label.htmlFor = 'topico-' + topico.id_topico;
        label.textContent = topico.nome;
        
    

        let isSelected = false;
        Topicos.forEach(t => {
            if (t.id_topico === topico.id_topico) {
                isSelected = true;
                return false; // Sair do loop interno
            }
        });

        checkbox.checked = isSelected;// Inicializa como não selecionado

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
    const selectedTopicIds = Array.from(selectedTopics).map(function (checkbox) {
        return checkbox.id.replace('topico-', '');
    });

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
        checkbox.value = item.id;
        checkbox.id = 'topico-' + item.id;

        const label = document.createElement('label');
        label.htmlFor = 'topico-' + item.id;
        label.textContent = item.nome;

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
