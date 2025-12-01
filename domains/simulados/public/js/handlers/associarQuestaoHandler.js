document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-associar') || document.getElementById('form-remover');
    const submitButton = document.getElementById('submitButton');
    const selectedQuestionIdsInput = document.getElementById('selectedQuestionIds');
    const contadorSelecionadas = document.getElementById('numero-questoes-selecionadas');
    const simuladoId = ContentManager.getIdSimulado();

    // Atualiza contador
    function atualizarContador() {
        const ids = selectedQuestionIdsInput.value ? selectedQuestionIdsInput.value.split(',') : [];
        contadorSelecionadas.textContent = ids.filter(id => id.trim() !== '').length.toString();
    }

    // Manipula checkboxes individuais
    function manipularCheckbox(checkbox) {
        let ids = selectedQuestionIdsInput.value ? selectedQuestionIdsInput.value.split(',') : [];
        ids = ids.filter(id => id.trim() !== ''); // limpa vazios

        if (checkbox.checked) {
            if (!ids.includes(checkbox.value)) {
                ids.push(checkbox.value);
            }
        } else {
            ids = ids.filter(id => id !== checkbox.value);
        }

        selectedQuestionIdsInput.value = ids.join(',');
        atualizarContador();
    }

    // Adiciona listeners nos checkboxes individuais
    document.querySelectorAll('input.questao-checkbox').forEach(cb => {
        cb.addEventListener('change', function () {
            manipularCheckbox(this);
        });
    });

    // Listener para "Selecionar todos"
    const selectAll = document.getElementById('select-all');
    if (selectAll) {
        selectAll.addEventListener('change', function () {
            document.querySelectorAll('input.questao-checkbox').forEach(cb => {
                cb.checked = selectAll.checked;
                manipularCheckbox(cb);
            });
        });
    }

    // Listener para envio do formulário
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!selectedQuestionIdsInput.value || selectedQuestionIdsInput.value.length === 0) {
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
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="bi bi-link-45deg"></i> Associar Questões Selecionadas';
        }
    });

    // Inicializa contador ao carregar
    atualizarContador();
});

