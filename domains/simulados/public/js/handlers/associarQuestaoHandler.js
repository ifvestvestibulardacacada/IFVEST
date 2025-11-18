
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-associar') || document.getElementById('form-remover');
   
    const submitButton = document.getElementById('submitButton');
    const selectedQuestionIdsInput = document.getElementById('selectedQuestionIds');
     const contadorSelecionadas = document.getElementById('numero-questoes-selecionadas');
    const simuladoId = ContentManager.getIdSimulado();

    form.addEventListener('submit', async function (e) {
        e.preventDefault(); // Impede o envio padrão

        // Confirmação
        // const confirmacao = confirm('Deseja associar as questões selecionadas ao simulado?');
        // if (!confirmacao) return;


        if (selectedQuestionIdsInput.value.length === 0) {
            alert('Nenhuma questão foi selecionada.');
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Associando...';

        try {
            const response = await axios.post(form.action, {
                simuladoId: simuladoId,
                selectedQuestionIds: selectedQuestionIdsInput.value
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.status === 200) {
                alert(`${selectedQuestionIdsInput.value.split(',').length} questão(ões) associada(s) /removida(s) com sucesso!`);

                // Redireciona para a lista de simulados
                setTimeout(() => {
                    window.location.href = '/simulados/meus-simulados';
                }, 200);
            } else {
                alert('Erro: ' + (response.data.message || 'Não foi possível associar as questões.'));
            }
        } catch (error) {
            console.error('Erro ao associar questões:', error);
            const msg = error.response?.data?.message || error.message || 'Erro desconhecido';
            alert('Falha ao associar questões: ' + msg);
        } finally {
            // Reabilita o botão
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="bi bi-link-45deg"></i> Associar Questões Selecionadas';
        }
    });
});
