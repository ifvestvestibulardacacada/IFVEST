     document.addEventListener('DOMContentLoaded', function () {
                // Modal de impressão
                const botoesImprimir = document.querySelectorAll('.button[id="generate-pdf"]');
                const modalImprimir = document.getElementById('modal-imprimir');

                botoesImprimir.forEach(botao => {
                    botao.addEventListener('click', function (e) {
                        e.preventDefault();
                        const simuladoId = this.href.split('/').filter(part => !isNaN(part)).pop();
                        const iframe = document.getElementById('iframe-imprimir');
                        iframe.src = `/simulados/${simuladoId}/imprimir`;
                        modalImprimir.style.display = 'block';
                    });
                });

                // Fechamento da modal de impressão
                window.addEventListener('click', function (event) {
                    if (event.target === modalImprimir) {
                        modalImprimir.style.display = "none";
                    }
                });

                // Modal de exclusão
                const modalExcluir = document.getElementById('modal-excluir');
                const deleteForm = document.getElementById('deleteAccountForm');
                const closeBtn = modalExcluir.querySelector('.close');
                const cancelBtn = modalExcluir.querySelector('.cancel-delete');

                // Adicionar event listeners para os botões de exclusão
                document.querySelectorAll('.delete-simulado').forEach(button => {
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        const simuladoId = this.getAttribute('data-simulado-id');
                        deleteForm.action = `/simulados/${simuladoId}/excluir-simulado?_method=DELETE`;
                        modalExcluir.style.display = 'block';
                    });
                });

                // Função para fechar o modal
                function closeModal() {
                    modalExcluir.style.display = 'none';
                }

                // Event listeners para fechar o modal
                closeBtn.addEventListener('click', closeModal);
                cancelBtn.addEventListener('click', closeModal);

                // Fechar modal ao clicar fora dele
                window.addEventListener('click', function(event) {
                    if (event.target === modalExcluir) {
                        closeModal();
                    }
                });
            });