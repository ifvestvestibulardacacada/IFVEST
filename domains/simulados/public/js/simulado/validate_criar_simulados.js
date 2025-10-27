const patterns = {
  textPattern: /^[a-zA-Z0-9\s.,!?()-]*$/,
  sqlPattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|;|--|\*)\b)/i
};

function validateTitulo(value) {
  if (!value) return "O título não pode ser vazio";
  if (value.length < 10) return "O título deve ter pelo menos 10 caracteres";
  if (value.length > 200) return "O título não pode exceder 200 caracteres";
  if (!patterns.textPattern.test(value)) return "Formato de título inválido";
  if (patterns.sqlPattern.test(value)) return "Formato de título inválido";
  return "";
}

function validateDescricao(value) {
  if (!value) return "A descrição não pode ser vazia"; // ← Corrija aqui também!
  if (value.length < 10) return "A descrição deve ter pelo menos 10 caracteres";
  if (value.length > 1000) return "A descrição não pode exceder 1000 caracteres";
  if (!patterns.textPattern.test(value)) return "Formato da descrição inválido";
  if (patterns.sqlPattern.test(value)) return "Formato da descrição inválido";
  return "";
}

function validateTipo(value) {
  const validTypes = ['Objetivo', 'Dissertativo', 'Aleatorio'];
  if (!validTypes.includes(value)) return "Selecione um tipo válido";
  return "";
}

function setupValidation() {
  const form = document.getElementById('simuladoForm');
  const tituloInput = document.getElementById('titulo');
  const descricaoInput = document.getElementById('descricao');
  const tipoSelect = document.getElementById('tipo');
  const addQuestionsButton = document.getElementById('addQuestionsButton');

  tituloInput.addEventListener('input', () => {
    const error = validateTitulo(tituloInput.value);
    document.getElementById('titulo-error').textContent = error;
    updateQuestionsButton();
  });

  descricaoInput.addEventListener('input', () => {
    const error = validateDescricao(descricaoInput.value);
    document.getElementById('descricao-error').textContent = error;
    updateQuestionsButton();
  });

  tipoSelect.addEventListener('change', () => {
    const error = validateTipo(tipoSelect.value);
    document.getElementById('tipo-error').textContent = error;
    updateQuestionsButton();
  });

  function updateQuestionsButton() {
    const err1 = validateTitulo(tituloInput.value);
    const err2 = validateDescricao(descricaoInput.value);
    const err3 = validateTipo(tipoSelect.value);
    addQuestionsButton.disabled = !!(err1 || err2 || err3);
  }

  // Validação inicial
  updateQuestionsButton();
}

// Executa quando a página carrega
document.addEventListener('DOMContentLoaded', setupValidation);