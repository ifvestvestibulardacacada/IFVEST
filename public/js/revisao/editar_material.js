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

    // Load topics based on area
    async function loadTopicDropdown(AreaId) {
        const topicos = window.Topicos || [];
        const topicDropdown = document.getElementById('selectTopico');
        topicDropdown.innerHTML = '<option value="">Escolha um tópico...</option>';

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
            if (topic.id_topico === parseInt(window.Material.topico.id_topico)) {
                option.selected = true;
            }
            topicDropdown.appendChild(option);
        });
    }

    // Initialize form
    document.addEventListener('DOMContentLoaded', async () => {
        // Populate tags
        renderTags();

        // Load topics for the selected area
        const areaId = window.Material.topico.id_area;
        if (areaId) {
            await loadTopicDropdown(areaId);
        }

        // Set markdown content in localStorage for the editor
        localStorage.setItem('EditorContent', window.Material.conteudo_markdown);

        // Ensure iframe reloads to pick up localStorage changes
        const iframe = document.getElementById('myIframe');
        iframe.src = iframe.src; // Force reload to trigger editor initialization

        // Handle form submission
     
    });

    // Event listener for area dropdown
    document.getElementById('selectArea').addEventListener('change', async function() {
        const AreaId = this.value;
        await loadTopicDropdown(AreaId);
    });