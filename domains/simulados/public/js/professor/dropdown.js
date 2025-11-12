async function loadTopicDropdown(AreaId) {

    const topicos = Topicos || [];
    const topicDropdown = document.getElementById('selectTopico');

    // Limpa as opções existentes no dropdown de tópicos
     topicDropdown.innerHTML = '';

    // Se não houver AreaId selecionado, desativa o dropdown de tópicos
    if (!AreaId) {
        topicDropdown.disabled = true;
        return;
    }

    // Habilita o dropdown de tópicos
    topicDropdown.disabled = false;

    // Filtra os tópicos com base no AreaId
    const filteredTopics = topicos.filter(topic => topic.id_area === parseInt(AreaId));

    // Adiciona as opções de tópicos ao dropdown
    filteredTopics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic.id_topico;
        option.textContent = topic.nome;
        topicDropdown.appendChild(option);
    });
}
document.getElementById('selectArea').addEventListener('change', async function () {
    const AreaId = this.value;
    await loadTopicDropdown(AreaId);
});