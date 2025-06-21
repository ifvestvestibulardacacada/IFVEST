document.addEventListener('DOMContentLoaded', function () {
    const deltaElements = document.querySelectorAll('[data-delta]');

    deltaElements.forEach(function (element) {
        const delta = JSON.parse(element.getAttribute('data-delta'));
        const tempDiv = document.createElement('div');
        const tempQuill = new Quill(tempDiv, { modules: { toolbar: false } });
        
        tempQuill.setContents(delta);

        element.innerHTML = tempDiv.innerHTML;

        const allElements = element.getElementsByTagName('*');
        for (let i = 0; i < allElements.length; i++) {
            allElements[i].removeAttribute('contenteditable');
        }
        element.removeAttribute('contenteditable');
    });
});