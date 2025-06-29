function initializeQuill(editorId, buttonId, placeholder) {
    

    // Registrar um manipulador personalizado para o clipboard


  const quill = new Quill(editorId, {
        placeholder: placeholder,
        theme: 'snow',
        modules: {
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['link', 'image'],
                    [{ 'resize-image': 'resize-image' }],
                    ['blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    ['align', { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
                    ['formula'],
                     // Custom button with unique ID
                ],
                handlers: {
                    'image': function () {
                        const imageInput = document.createElement('input');
                        imageInput.type = 'file';
                        imageInput.accept = 'image/*';

                        imageInput.onchange = function (event) {
                            const file = event.target.files[0];
                            uploadImage(file, quill);
                        };

                        imageInput.click();
                    },
                    'resize-image': function () {
                        const range = quill.getSelection();
                        if (!range) {
                            alert('Por favor, selecione uma imagem no editor.');
                            return;
                        }

                        const [leaf, offset] = quill.getLeaf(range.index);
                        if (!leaf || !leaf.domNode || leaf.domNode.tagName !== 'IMG') {
                            alert('Nenhuma imagem selecionada. Clique em uma imagem para redimensionar.');
                            return;
                        }

                        const img = leaf.domNode;

                        // Create container for size selection
                        const selectContainer = document.createElement('div');
                        selectContainer.style.position = 'absolute';
                        selectContainer.style.background = '#fff';
                        selectContainer.style.border = '1px solid #ccc';
                        selectContainer.style.padding = '10px';
                        selectContainer.style.zIndex = '1000';
                        selectContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

                        // Create select element with size options
                        const select = document.createElement('select');
                        select.innerHTML = `
                            <option value="muito_pequena">Muito Pequena (100x75)</option>
                            <option value="pequena">Pequena (200x150)</option>
                            <option value="média" selected>Média (400x300)</option>
                            <option value="grande">Grande (600x450)</option>
                            <option value="extra_grande">Extra Grande (800x600)</option>
                        `;

                        // Create confirm and cancel buttons
                        const confirmButton = document.createElement('button');
                        confirmButton.textContent = 'Confirmar';
                        confirmButton.style.marginLeft = '10px';
                        confirmButton.style.padding = '5px 10px';
                        confirmButton.style.background = '#007bff';
                        confirmButton.style.color = '#fff';
                        confirmButton.style.border = 'none';
                        confirmButton.style.cursor = 'pointer';

                        const cancelButton = document.createElement('button');
                        cancelButton.textContent = 'Cancelar';
                        cancelButton.style.marginLeft = '10px';
                        cancelButton.style.padding = '5px 10px';
                        cancelButton.style.background = '#dc3545';
                        cancelButton.style.color = '#fff';
                        cancelButton.style.border = 'none';
                        cancelButton.style.cursor = 'pointer';

                        // Append elements to container
                        selectContainer.appendChild(select);
                        selectContainer.appendChild(confirmButton);
                        selectContainer.appendChild(cancelButton);
                        document.body.appendChild(selectContainer);

                        // Position the container near the editor
                        const editorRect = quill.container.getBoundingClientRect();
                        selectContainer.style.top = `${editorRect.top + window.scrollY + editorRect.height}px`;
                        selectContainer.style.left = `${editorRect.left + window.scrollX}px`;

                        // Size map for image dimensions
                        const sizeMap = {
                            muito_pequena: { width: 100, height: 75 },
                            pequena: { width: 200, height: 150 },
                            média: { width: 400, height: 300 },
                            grande: { width: 600, height: 450 },
                            extra_grande: { width: 800, height: 600 }
                        };

                        // Handle confirm button click
                        confirmButton.onclick = () => {
                            const dimensions = sizeMap[select.value] || sizeMap['média'];
                            quill.formatText(range.index, 1, {
                                width: `${dimensions.width}px`,
                                height: `${dimensions.height}px`
                            });
                            selectContainer.remove();
                        };

                        // Handle cancel button click
                        cancelButton.onclick = () => {
                            selectContainer.remove();
                        };
                    }
                }
            }
        }
    });
    // After initializing Quill
const resizeButtons = document.querySelectorAll('.ql-resize-image');
resizeButtons.forEach(button => {
    button.innerHTML = '<img src="/img/resize.png" alt="Resize" style="width: 16px; height: 16px;">';
    button.title = 'Resize Image'; // Add tooltip to all resize buttons
});
    quill.getModule('toolbar').addHandler('formula', function () {

        const editorOpenBtn = document.getElementById(`${buttonId}`);
        const editorContainer = document.querySelector('.editor-container');

        const marginMap = {
            'editor-open-btn': '20px',
            'editor-open-btnA': '50px',
            'editor-open-btnB': '200px',
            'editor-open-btnC': '300px',
            'editor-open-btnD': '400px',
            'editor-open-btnE': '500px'
        };
        if (marginMap[buttonId]) {
            editorContainer.style.marginTop = marginMap[buttonId];
        }

        if (editorOpenBtn) {
           editorOpenBtn.click();
        }
    });

    quill.clipboard.addMatcher('IMG', () => null);

    quill.getModule('toolbar').addHandler('image', function () {
        const imageInput = document.createElement('input');
        imageInput.type = 'file';
        imageInput.accept = 'image/*';

        imageInput.onchange = function (event) {
            const file = event.target.files[0];
            uploadImage(file, quill);
        };

        imageInput.click();
    });
    quill.root.addEventListener('paste', function (e) {
        const clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData) return;

        const items = clipboardData.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault();
                e.stopPropagation();
                const file = item.getAsFile();
                uploadImage(file, quill);
                break; // Process only the first image
            }
        }
    }, true);

    quill.root.addEventListener('drop', function (e) {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            e.preventDefault();
            e.stopPropagation();
            const file = files[0]; // Process only the first file
            if (file && file.type.indexOf('image') !== -1) {
                uploadImage(file, quill);
            }
        }
    }, true);

    return quill;
}

function uploadImage(file, quillInstance) {
    if (file) {
        // Criar o contêiner para o select
        const selectContainer = document.createElement('div');
        selectContainer.style.position = 'absolute';
        selectContainer.style.background = '#fff';
        selectContainer.style.border = '1px solid #ccc';
        selectContainer.style.padding = '10px';
        selectContainer.style.zIndex = '1000';
        selectContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // Criar o select com opções de tamanho
        const select = document.createElement('select');
        select.innerHTML = `
            <option value="muito_pequena">Muito Pequena (100x75)</option>
            <option value="pequena">Pequena (200x150)</option>
            <option value="média" selected>Média (400x300)</option>
            <option value="grande">Grande (600x450)</option>
            <option value="extra_grande">Extra Grande (800x600)</option>
        `;

        // Botões de confirmar e cancelar
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmar';
        confirmButton.style.marginLeft = '10px';
        confirmButton.style.padding = '5px 10px';
        confirmButton.style.background = '#007bff';
        confirmButton.style.color = '#fff';
        confirmButton.style.border = 'none';
        confirmButton.style.cursor = 'pointer';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.style.marginLeft = '10px';
        cancelButton.style.padding = '5px 10px';
        cancelButton.style.background = '#dc3545';
        cancelButton.style.color = '#fff';
        cancelButton.style.border = 'none';
        cancelButton.style.cursor = 'pointer';

        // Adicionar elementos ao contêiner
        selectContainer.appendChild(select);
        selectContainer.appendChild(confirmButton);
        selectContainer.appendChild(cancelButton);
        document.body.appendChild(selectContainer);

        // Posicionar o select próximo ao editor
        const editorRect = quillInstance.container.getBoundingClientRect();
        selectContainer.style.top = `${editorRect.top + window.scrollY + editorRect.height}px`;
        selectContainer.style.left = `${editorRect.left + window.scrollX}px`;

        // Mapa de tamanhos
        const sizeMap = {
            muito_pequena: { width: 100, height: 75 },
            pequena: { width: 200, height: 150 },
            média: { width: 400, height: 300 },
            grande: { width: 600, height: 450 },
            extra_grande: { width: 800, height: 600 }
        };

        // Função para processar o upload
        const processUpload = (dimensions) => {
            let formData = new FormData();
            formData.append('image', file);

            fetch('/Uploads/editor/', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    const imageUrl = data;
                    const range = quillInstance.getSelection();

                    if (range) {
                        quillInstance.insertEmbed(range.index, 'image', imageUrl);
                        quillInstance.formatText(range.index, range.index + 1, {
                            width: `${dimensions.width}px`,
                            height: `${dimensions.height}px`
                        });
                    } else {
                        quillInstance.insertEmbed(quillInstance.getLength(), 'image', imageUrl);
                        quillInstance.formatText(quillInstance.getLength() - 1, 1, {
                            width: `${dimensions.width}px`,
                            height: `${dimensions.height}px`
                        });
                    }

                    selectContainer.remove();
                })
                .catch(error => {
                    alert('Erro no upload:', error.message);
                    console.error('Erro no upload:', error);
                    selectContainer.remove();
                });
        };

        // Lidar com o clique no botão Confirmar
        confirmButton.onclick = () => {
            const dimensions = sizeMap[select.value] || sizeMap['média'];
            processUpload(dimensions);
        };

        // Lidar com o clique no botão Cancelar
        cancelButton.onclick = () => {
            selectContainer.remove();
        };
    }
}

