    const tags = window.Material.PalavraChave || [];

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
        
        // Set markdown content in localStorage for the editor
        localStorage.setItem('EditorContent', window.Material.conteudo_markdown);

        // Ensure iframe reloads to pick up localStorage changes
        // const iframe = document.getElementById('myIframe');
        // iframe.src = iframe.src; // Force reload to trigger editor initialization

        // Handle form submission

        // loading assunto
        document.querySelector(`#selectAssunto option[value="${window.Material.id_assunto}"]`).selected = true
     
    });