document.addEventListener('DOMContentLoaded', function () {
    // Inicializa tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // MODAL DE IMPRESSÃO - FUNCIONANDO
    const botoesPDF = document.querySelectorAll('.generate-pdf');
    const modalImprimir = new bootstrap.Modal(document.getElementById('modal-imprimir'));

    botoesPDF.forEach(botao => {
        botao.addEventListener('click', function (e) {
            e.preventDefault();
            const simuladoId = this.getAttribute('data-simulado-id');
            const iframe = document.getElementById('iframe-imprimir');
            iframe.src = `/simulados/${simuladoId}/imprimir`;
            modalImprimir.show();
        });
    });

    // MODAL DE EXCLUSÃO - CORRIGIDO
    const modalExcluir = new bootstrap.Modal(document.getElementById('modal-excluir'));
    
    document.querySelectorAll('.delete-simulado').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const simuladoId = this.getAttribute('data-simulado-id');
            const form = document.getElementById('deleteAccountForm');
            form.action = `/simulados/${simuladoId}?_method=DELETE`;
            modalExcluir.show();
        });
    });

    // Submit do formulário de delete
    document.getElementById('deleteAccountForm').addEventListener('submit', function(e) {
        if (!confirm('Tem certeza que deseja excluir este simulado?')) {
            e.preventDefault();
        }
    });
});