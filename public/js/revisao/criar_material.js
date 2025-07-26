

const palavrasChaveHTML = document.querySelector("#palavrasChave")

const tagBox = document.querySelector(".tag-box")

const tags = []

function addKeyword() {
    const keyword = palavrasChaveHTML.value
    tags.push(keyword)
    palavrasChaveHTML.value = ""

    renderTags()
}

function renderTags() {
    tagBox.innerHTML = ""
    for (let tag in tags) {
        tagBox.innerHTML = tagBox.innerHTML + `<span class="tag">${tags[tag]}<i class="bx bx-x" onclick="removeTag(${tag})"></i> </span>`
    }
}

function removeTag(tag) {
    tags.splice(tag, 1)
    renderTags()
}



async function loadTopicDropdown(AreaId) {

    const topicos = window.Topicos || [];
    const topicDropdown = document.getElementById('selectTopico');

    // Limpa as opções existentes no dropdown de tópicos
    topicDropdown.innerHTML = '<option selected>Escolha um tópico...</option>';

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

// Event listener para o dropdown de áreas
document.getElementById('selectArea').addEventListener('change', async function () {
    const AreaId = this.value;
    await loadTopicDropdown(AreaId);
});
const datalist = document.getElementById('palavrasChaveList');

window.palavrasChave.forEach(palavra => {
    const option = document.createElement('option');
    option.value = palavra;
    datalist.appendChild(option);
});


