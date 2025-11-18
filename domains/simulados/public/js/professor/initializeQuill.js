function initializeQuill(editorId, buttonId, placeholder) {
    console.log('QuillResize:', window.QuillResize);
    const quill = new Quill(editorId, {
        placeholder: placeholder,
        theme: 'snow',
        modules: {
            resize: {
                embedTags: ["IMG", "VIDEO", "IFRAME"],
                tools: [
                    "left",
                    "center",
                    "right",
                    "full",
                    "edit",
                    {
                        text: "Alt",
                        attrs: {
                            title: "Set image alt",
                            class: "btn-alt",
                        },
                        verify(activeEle) {
                            return activeEle && activeEle.tagName === "IMG";
                        },
                        handler(evt, button, activeEle) {
                            let alt = activeEle.alt || "";
                            alt = window.prompt("Alt for image", alt);
                            if (alt == null) return;
                            activeEle.setAttribute("alt", alt);
                        },
                    },
                ],
            },

            toolbar: {
                container: [
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['link', 'image'],

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

                },

                keyboard: {
                    bindings: {
                        backspace: {
                            key: 'backspace', // Use key code for reliability
                            handler: function (range, context) {
                                console.log('Backspace handler triggered', { range, context }); // Debug log
                                if (range.length === 0) { // Cursor is at a single point
                                    const [leaf, offset] = quill.getLeaf(range.index - 1);
                                    console.log('Leaf:', leaf, 'Offset:', offset); // Debug leaf
                                    if (leaf && leaf.blotName === 'formula') {
                                        console.log('Deleting formula at index:', range.index - 1);
                                        quill.deleteText(range.index - 1, 1, Quill.sources.USER);
                                        return false; // Prevent default backspace behavior
                                    }
                                }
                                return true; // Allow default behavior
                            }
                        }
                    }
                },
            },
        }


        });
    // After initializing Quill

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
    if (!file) return;

    // Create FormData for image upload
    let formData = new FormData();
    formData.append('image', file);

    // Upload image to server
    fetch('/Uploads/editor/', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Image URL:', data); // Debug: Log the image URL
            const imageUrl = data;
            const range = quillInstance.getSelection() || { index: quillInstance.getLength() };
            quillInstance.insertEmbed(range.index, 'image', imageUrl);
        })
        .catch(error => {
            console.error('Upload error:', error);
            alert('Erro no upload: ' + error.message);
        });
}
