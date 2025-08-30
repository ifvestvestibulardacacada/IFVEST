function atualizarContadorQuestoesSelecionadas() {
    const idsSelecionados = JSON.parse(sessionStorage.getItem('idsSelecionados<%= simulado.id %>') || '[]');
    const numeroQuestoesSelecionadas = idsSelecionados.length;
    document.getElementById('numero-questoes-selecionadas').textContent = numeroQuestoesSelecionadas.toString();
}

function manipularCheckbox(checkbox) {
    const id = checkbox.value;
    const chave = 'idsSelecionados<%= simulado.id %>';

    if (checkbox.checked) {
        adicionarId(id, chave, checkbox);
    } else {
        removerId(id, chave);
    }
    atualizarContadorQuestoesSelecionadas();
}

function adicionarId(id, chave, checkbox) {
    let arrayAtual = JSON.parse(sessionStorage.getItem(chave) || "[]");
    if (!arrayAtual.includes(id)) {
        arrayAtual.push(id);
        sessionStorage.setItem(chave, JSON.stringify(arrayAtual));
    }
}

function removerId(id, chave) {
    let arrayAtual = JSON.parse(sessionStorage.getItem(chave) || "[]");
    let arrayFiltrado = arrayAtual.filter(elemento => elemento !== id);
    sessionStorage.setItem(chave, JSON.stringify(arrayFiltrado));
}

function verificarEAtualizarCheckboxes() {
    const idsSelecionados = JSON.parse(sessionStorage.getItem('idsSelecionados<%= simulado.id %>') || '[]');
    document.querySelectorAll('input[type="checkbox"][name="questoesSelecionadas"]').forEach(checkbox => {
        const id = checkbox.value;
        checkbox.checked = idsSelecionados.includes(id);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Adicionar event listeners para todos os checkboxes
    document.querySelectorAll('input[type="checkbox"][name="questoesSelecionadas"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            manipularCheckbox(this);
        });
    });

    // Adicionar event listener para o botão de associar
    const botaoAssociar = document.querySelector('.botao-associar');
    if (botaoAssociar) {
        botaoAssociar.addEventListener('click', function(event) {
            const selectedQuestionIds = JSON.parse(sessionStorage.getItem('idsSelecionados<%= simulado.id %>') || '[]');
            const idsAsString = selectedQuestionIds.join(',');
            document.getElementById('selectedQuestionIds').value = idsAsString;
            sessionStorage.removeItem('idsSelecionados<%= simulado.id %>');
        });
    }

    // Inicializar o estado dos checkboxes e contador
    verificarEAtualizarCheckboxes();
    atualizarContadorQuestoesSelecionadas();
});


