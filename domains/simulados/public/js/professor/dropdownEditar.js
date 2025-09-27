function loadTopicDropdown(AreaId) {
    const topicos = window.Topicos || [];
    const topicDropdown = document.getElementById('selectTopico');
    topicDropdown.innerHTML = '';
    const meusTopicos = window.meusTopicos || [];


    if (!AreaId) {
     
        topicDropdown.disabled = true;
        return;
    }

    topicDropdown.disabled = false;
    const filteredTopics = topicos.filter(topic => topic.id_area === parseInt(AreaId));
 
    filteredTopics.forEach(topic => {
        
        const option = document.createElement('option');
        option.value = topic.id_topico;
        option.textContent = topic.nome;
        let isSelected = meusTopicos.some(t => t.id_topico === topic.id_topico);
        option.selected = isSelected;

        topicDropdown.appendChild(option);
    });
}
document.getElementById('selectArea').addEventListener('change', async function () {
    const area = this.value;

    loadTopicDropdown(area);
});

// Função auxiliar para criar um item de dropdown
