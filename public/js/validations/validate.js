function containsHTMLorSQL(str) {
    const htmlPattern = /<[^>]*>/g;
    const sqlPattern = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|--)\b/i;
    return htmlPattern.test(str) || sqlPattern.test(str);
}

document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('input[type="text"], textarea');
    const submitButton = document.getElementById('submitButton');

    // Function to check if any input contains invalid content
    function updateSubmitButtonState() {
        let hasInvalidInput = false;
        inputs.forEach(input => {
            if (containsHTMLorSQL(input.value)) {
                hasInvalidInput = true;
            }
        });
        submitButton.disabled = hasInvalidInput;
    }

    inputs.forEach(input => {
        // Create error message element
        const errorMsg = document.createElement('div');
        errorMsg.style.color = 'red';
        errorMsg.style.fontSize = '0.9em';
        errorMsg.style.display = 'none';
        errorMsg.textContent = 'Entrada inválida ';
        input.parentNode.insertBefore(errorMsg, input.nextSibling);

        // Handle input changes
        input.addEventListener('input', function () {
            if (containsHTMLorSQL(input.value)) {
                input.style.border = '2px solid red';
                errorMsg.style.display = 'block';
            } else {
                input.style.border = '';
                errorMsg.style.display = 'none';
            }
            // Update submit button state after every input change
            updateSubmitButtonState();
        });

        // Prevent typing invalid content
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

    // Initial check to set button state
    updateSubmitButtonState();
});