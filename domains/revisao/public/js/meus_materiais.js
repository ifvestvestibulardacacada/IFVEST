const inputBusca = document.querySelector('#materia');
const formPesquisa = inputBusca.closest('form');
const linhasTabela = document.querySelectorAll('table tbody tr');

// Função de filtro
function filtrarTabela() {
    const termo = inputBusca.value.trim().toLowerCase();
    
    linhasTabela.forEach(linha => {
        const titulo = linha.querySelector('td:first-child span').textContent.toLowerCase();
        if (titulo.includes(termo)) {
            linha.style.display = '';
        } else {
            linha.style.display = 'none';
        }
    });
}

// Adiciona evento de digitação
inputBusca.addEventListener('input', filtrarTabela);

// Opcional: impede o envio do formulário (para evitar reload)


// Executa filtro inicial (caso já tenha valor no campo)
filtrarTabela();

