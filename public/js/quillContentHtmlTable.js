

document.addEventListener('DOMContentLoaded', function () {

    const deltaElements = document.querySelectorAll('[data-delta]');
    const maxLength = 100; 
    deltaElements.forEach(function (element) {
        const delta = JSON.parse(element.getAttribute('data-delta'));
        const tempDiv = document.createElement('div');
        const tempQuill = new Quill(tempDiv, { modules: { toolbar: false } });
        tempQuill.setContents(delta);

        let text = tempQuill.getText();

        if (text.length > maxLength) {
            text = text.substring(0, maxLength);
        }

        if (text.length <= maxLength) {
            text += '...';
        }

        element.textContent = text;
    });
});