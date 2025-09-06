

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

const datalist = document.getElementById('palavrasChaveList');

window.palavrasChave.forEach(palavra => {
    const option = document.createElement('option');
    option.value = palavra;
    datalist.appendChild(option);
});

if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('EditorContent');
    console.log('EditorContent cleared');
} else {
    console.error('localStorage is not available');
}
window.addEventListener('beforeunload', () => {
    try {
        localStorage.removeItem('EditorContent');
        console.log('EditorContent cleared from localStorage on beforeunload');
    } catch (error) {
        console.error('Error clearing EditorContent on beforeunload:', error);
    }
});

document.addEventListener('click', (event) => {
    const target = event.target.closest('a');
    if (target && target.href && !target.href.startsWith(window.location.href)) {

        localStorage.removeItem('EditorContent');
    }
});

