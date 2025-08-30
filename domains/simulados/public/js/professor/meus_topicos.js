function exibirForm(id) {
    // Oculta o span com o título do tópico
    const titleSpan = document.getElementById(`span${id}`);
    if (titleSpan) titleSpan.style.display = 'none';

    // Mostra o formulário
    const form = document.getElementById(`editForm${id}`);
    if (form) form.classList.remove('hide');

    // Oculta o botão de editar
    const editButton = document.querySelector(`a.editBtn[data-id='${id}']`);
    if (editButton) editButton.style.display = 'none';
}

function ocultarForm(id) {
    // Mostra o span com o título do tópico
    const titleSpan = document.getElementById(`span${id}`);
    if (titleSpan) titleSpan.style.display = '';

    // Oculta o formulário
    const form = document.getElementById(`editForm${id}`);
    if (form) form.classList.add('hide');

    // Exibe o botão de editar
    const editButton = document.querySelector(`a.editBtn[data-id='${id}']`);
    if (editButton) editButton.style.display = '';
}

document.addEventListener('DOMContentLoaded', function() {
    // Edit button click
    document.querySelectorAll('a.editBtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const id = btn.getAttribute('data-id');
            exibirForm(id);
        });
    });
    // Cancel button click
    document.querySelectorAll('button.cancelBtn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const id = btn.getAttribute('data-id');
            ocultarForm(id);
        });
    });
});
