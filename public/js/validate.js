function containsHTMLorSQL(str) {

    const htmlPattern = /<[^>]*>/g;


    const sqlPattern = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|--|;)\b/i;
    return htmlPattern.test(str) || sqlPattern.test(str);
}

document.addEventListener('DOMContentLoaded', function () {

    const inputs = document.querySelectorAll('input[type="text"], textarea');
    inputs.forEach(input => {

        const errorMsg = document.createElement('div');
        errorMsg.style.color = 'red';
        errorMsg.style.fontSize = '0.9em';
        errorMsg.style.display = 'none';
        errorMsg.textContent = 'Entrada inválida';
        input.parentNode.insertBefore(errorMsg, input.nextSibling);

        input.addEventListener('input', function () {
            if (containsHTMLorSQL(input.value)) {
                input.style.border = '2px solid red';
                errorMsg.style.display = 'block';
            } else {
                input.style.border = '';
                errorMsg.style.display = 'none';
            }
        });

        input.addEventListener('keydown', function (event) {

            if (containsHTMLorSQL(input.value)) {
                const allowedKeys = [
                    'Backspace', 'Delete',
                    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                    'Home', 'End', 'Tab'
                ];
                if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
                    return;
                }
                event.preventDefault();
            }
        });
    });
});