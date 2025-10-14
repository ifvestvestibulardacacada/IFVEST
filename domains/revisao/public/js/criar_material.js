

const palavrasChaveHTML = document.querySelector("#palavrasChave")

const tagBox = document.querySelector(".tag-box")

const tags = []

function addKeyword() {
    const keyword = palavrasChaveHTML.value.trim(); // Remove espaços em branco
    if (!keyword) {
        alert('Por favor, insira uma palavra-chave válida (não vazia).');
        return;
    }
    tags.push(keyword);
    palavrasChaveHTML.value = ''; // Limpa o input
    renderTags();
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





