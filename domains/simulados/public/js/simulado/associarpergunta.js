// function atualizarContadorQuestoesSelecionadas() {
//     const idsSelecionados = JSON.parse(sessionStorage.getItem('idsSelecionados<%= simulado.id %>') || '[]');
//     const numeroQuestoesSelecionadas = idsSelecionados.length;
//     document.getElementById('numero-questoes-selecionadas').textContent = numeroQuestoesSelecionadas.toString();
// }

// function manipularCheckbox(checkbox) {
//     const id = checkbox.value;
//     const chave = 'idsSelecionados<%= simulado.id %>';

//     if (checkbox.checked) {
//         adicionarId(id, chave, checkbox);
//     } else {
//         removerId(id, chave);
//     }
//     atualizarContadorQuestoesSelecionadas();
// }

// function adicionarId(id, chave, checkbox) {
//     let arrayAtual = JSON.parse(sessionStorage.getItem(chave) || "[]");
//     if (!arrayAtual.includes(id)) {
//         arrayAtual.push(id);
//         sessionStorage.setItem(chave, JSON.stringify(arrayAtual));
//     }
// }

// // function removerId(id, chave) {
// //     let arrayAtual = JSON.parse(sessionStorage.getItem(chave) || "[]");
// //     let arrayFiltrado = arrayAtual.filter(elemento => elemento !== id);
// //     sessionStorage.setItem(chave, JSON.stringify(arrayFiltrado));
// // }

// // function verificarEAtualizarCheckboxes() {
// //     const idsSelecionados = JSON.parse(sessionStorage.getItem('idsSelecionados<%= simulado.id %>') || '[]');
// //     document.querySelectorAll('input[type="checkbox"][name="questoesSelecionadas"]').forEach(checkbox => {
// //         const id = checkbox.value;
// //         checkbox.checked = idsSelecionados.includes(id);
// //     });
// // }

// // document.addEventListener('DOMContentLoaded', function() {
// //     // Adicionar event listeners para todos os checkboxes
// //     document.querySelectorAll('input[type="checkbox"][name="questoesSelecionadas"]').forEach(checkbox => {
// //         checkbox.addEventListener('change', function() {
// //             manipularCheckbox(this);
// //         });
// //     });

// //     // Adicionar event listener para o botão de associar
// //     const botaoAssociar = document.querySelector('.botao-associar');
// //     if (botaoAssociar) {
// //         botaoAssociar.addEventListener('click', function(event) {
// //             const selectedQuestionIds = JSON.parse(sessionStorage.getItem('idsSelecionados<%= simulado.id %>') || '[]');
// //             const idsAsString = selectedQuestionIds.join(',');
// //             document.getElementById('selectedQuestionIds').value = idsAsString;
// //             sessionStorage.removeItem('idsSelecionados<%= simulado.id %>');
// //         });
// //     }

// //     // Inicializar o estado dos checkboxes e contador
// //     verificarEAtualizarCheckboxes();
// //     atualizarContadorQuestoesSelecionadas();



// // });



document.addEventListener('DOMContentLoaded', function () {
  const chaveStorage = `idsSelecionados${simuladoId}`;

  
  function obterIdsSelecionados() {
    return JSON.parse(sessionStorage.getItem(chaveStorage) || '[]');
  }

  // Salva os IDs selecionados no sessionStorage
  function salvarIdsSelecionados(ids) {
    sessionStorage.setItem(chaveStorage, JSON.stringify(ids));
  }

  // Atualiza o contador de questões selecionadas
  function atualizarContadorQuestoesSelecionadas() {
    const numero = obterIdsSelecionados().length;
    const contador = document.getElementById('numero-questoes-selecionadas');
    if (contador) {
      contador.textContent = numero.toString();
    }
  }

  function manipularCheckbox(checkbox) {
    const id = checkbox.value;
    let ids = obterIdsSelecionados();

    if (checkbox.checked) {
      if (!ids.includes(id)) ids.push(id);
    } else {
      ids = ids.filter(item => item !== id);
    }

    salvarIdsSelecionados(ids);
    atualizarContadorQuestoesSelecionadas();
  }

  // Marca os checkboxes que estavam selecionados anteriormente
  function verificarEAtualizarCheckboxes() {
    const ids = obterIdsSelecionados();
    document.querySelectorAll('input[type="checkbox"][name="questoesSelecionadas"]').forEach(checkbox => {
      checkbox.checked = ids.includes(checkbox.value);
    });
  }

  // Aplica rótulos acessíveis aos checkboxes com base nos elementos da linha
  function configurarAcessibilidadeCheckboxes() {
    document.querySelectorAll('input[type="checkbox"][name="questoesSelecionadas"]').forEach(checkbox => {
      const id = checkbox.value;

      const titulo = document.getElementById(`titulo-${id}`);
      const tipo = document.getElementById(`tipo-${id}`);
      const pergunta = document.getElementById(`pergunta-${id}`);
      const topico = document.getElementById(`topico-${id}`);

      if (titulo && tipo && pergunta && topico) {
        checkbox.setAttribute('aria-labelledby', `titulo-${id} tipo-${id} pergunta-${id} topico-${id}`);
      } else {
        checkbox.setAttribute('aria-label', `Selecionar questão ${id}`);
        console.warn(`Elementos de rótulo ausentes para checkbox ${id}`);
      }
    });
  }

  // Adiciona evento de mudança aos checkboxes
  function configurarEventosCheckboxes() {
    document.querySelectorAll('input[type="checkbox"][name="questoesSelecionadas"]').forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        manipularCheckbox(this);
      });
    });
  }

 
  const botaoAssociar = document.querySelector('.botao-associar, #submitButton');
  if (botaoAssociar) {
    botaoAssociar.addEventListener('click', function () {
      const ids = obterIdsSelecionados();
      const campoHidden = document.getElementById('selectedQuestionIds');
      if (campoHidden) {
        campoHidden.value = ids.join(',');
      }
      sessionStorage.removeItem(chaveStorage);
    });
  }

  
  verificarEAtualizarCheckboxes();
  configurarAcessibilidadeCheckboxes();
  configurarEventosCheckboxes();
  atualizarContadorQuestoesSelecionadas();
});
