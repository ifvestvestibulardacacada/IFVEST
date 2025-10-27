    const tags = window.ContentManager.getPalavraChave() || [];

    // Keyword handling
    const palavrasChaveHTML = document.querySelector("#palavrasChave");
    const tagBox = document.querySelector(".tag-box");

    function addKeyword() {
        const keyword = palavrasChaveHTML.value.trim();
        if (keyword) {
            tags.push(keyword);
            palavrasChaveHTML.value = "";
            renderTags();
        }
    }

    function renderTags() {
        tagBox.innerHTML = "";
        for (let tag in tags) {
            tagBox.innerHTML += `<span class="tag">${tags[tag]}<i class="bx bx-x" onclick="removeTag(${tag})"></i></span>`;
        }
    }

    function removeTag(tag) {
        tags.splice(tag, 1);
        renderTags();
    }

    // Initialize form
    document.addEventListener('DOMContentLoaded', async () => {
        // Populate tags
        renderTags();
        const id_assunto = window.ContentManager.getIdAssunto() || '';

        document.querySelector(`#selectAssunto option[value="${id_assunto}"]`).selected = true;

    });