const formSection = document.getElementById('formSection');
const newContentSection = document.getElementById('newContentSection');
const tipoSelect = document.getElementById('tipo');
const modoSelect = document.getElementById('modo');
const questoesTable = document.getElementById('questoesTable');
const questoesBody = document.getElementById('questoesBody');
const selectAllCheckbox = document.getElementById('selectAll');
const contador = document.getElementById('numero-questoes-selecionadas');
const paginationContainer = document.getElementById('pagination');

let currentPage = 1;
const itemsPerPage = 10;
let filteredQuestoes = [];

// Initialize selected questions from sessionStorage
let selectedQuestions = JSON.parse(sessionStorage.getItem('selectedQuestions') || '[]');

// Event listener para limpar selectedQuestions quando o tipo mudar
tipoSelect.addEventListener('change', () => {
  console.log('Tipo selecionado mudou:', tipoSelect.value);
  sessionStorage.removeItem('selectedQuestions');
  selectedQuestions = [];
  updateSelectedCount();
  applyFilters(); // Sempre atualiza
});

function goToNewContent() {
  formSection.style.display = 'none';
  newContentSection.style.display = 'flex';
  history.pushState({ section: 'questions' }, '', '#questions');
  applyFilters();
}

function goBack() {
  newContentSection.style.display = 'none';
  formSection.style.display = 'flex';
  history.pushState({ section: 'form' }, '', '#form');
}

function applyFilters() {
  const tipo = tipoSelect.value || 'Aleatorio';
  const tituloFiltro = document.getElementById('tituloFiltro').value.toLowerCase() || '';

  console.log('Filter inputs:', { tipo, tituloFiltro });

  filteredQuestoes = window.questoes.filter(questao => {
    const rowTipo = (questao.tipo || '').toUpperCase();
    const normalizedTipo = tipo === 'Dissertativo' ? 'DISSERTATIVA' : tipo === 'Objetivo' ? 'OBJETIVA' : tipo;
    const rowTitulo = (questao.titulo || '').toLowerCase();

    const matchesTipo = normalizedTipo === 'Aleatorio' || rowTipo === normalizedTipo;
    const matchesTitulo = rowTitulo.includes(tituloFiltro);

    console.log('Questao evaluation:', { rowTipo, normalizedTipo, matchesTipo, rowTitulo, matchesTitulo });

    return matchesTipo && matchesTitulo;
  });

  console.log('Filtered Questoes:', filteredQuestoes.length, filteredQuestoes);

  renderTable();
}

function renderTable() {
  questoesBody.innerHTML = '';

  if (filteredQuestoes.length === 0) {
    questoesBody.innerHTML = '<tr><td colspan="5">Nenhuma questão encontrada após filtro.</td></tr>';
    paginationContainer.innerHTML = '';
    updateSelectedCount();
    return;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedQuestoes = filteredQuestoes.slice(start, end);

  paginatedQuestoes.forEach(questao => {
    const row = document.createElement('tr');
    row.dataset.tipo = questao.tipo || '';
    const pergunta = questao.pergunta || '';
    const isChecked = selectedQuestions.includes(String(questao.id_questao)) ? 'checked' : '';
    row.innerHTML = `
      <td><input type="checkbox" class="questao-checkbox" name="questoesSelecionadas" value="${questao.id_questao || ''}" ${isChecked}></td>
      <td>${questao.titulo || 'Sem título'}</td>
      <td>${questao.tipo || 'Desconhecido'}</td>
      <td><div class="name" data-delta='${encodeURIComponent(pergunta)}'></div></td>
      <td>${questao.Topico && questao.Topico.length > 0 ? questao.Topico.map(topico => topico.nome || 'Sem nome').join(', ') : 'Sem tópico'}</td>
    `;
    questoesBody.appendChild(row);
  });

  // Process Quill content
  try {
    const maxLength = 100;
    document.querySelectorAll('.name').forEach(div => {
      try {
        const delta = decodeURIComponent(div.dataset.delta || '');
        if (!delta) {
          div.textContent = 'Sem conteúdo';
          return;
        }
        const parsedDelta = JSON.parse(delta);
        const tempDiv = document.createElement('div');
        const tempQuill = new Quill(tempDiv, { modules: { toolbar: false } });
        tempQuill.setContents(parsedDelta);
        let text = tempQuill.getText().trim();
        if (text.length > maxLength) {
          text = text.substring(0, maxLength);
        }
        text += '...';
        div.textContent = text || 'Questão carregada';
      } catch (e) {
        console.error('Error processing Quill delta for div:', div.dataset.delta, e);
        div.textContent = 'Erro ao carregar questão';
      }
    });
  } catch (e) {
    console.error('Error initializing Quill:', e);
    document.querySelectorAll('.name').forEach(div => {
      div.textContent = 'Erro ao inicializar Quill';
    });
  }

  renderPagination();
  updateSelectedCount();
}

function renderPagination() {
  const pageCount = Math.ceil(filteredQuestoes.length / itemsPerPage);
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.disabled = i === currentPage;
    button.onclick = () => {
      currentPage = i;
      renderTable();
    };
    paginationContainer.appendChild(button);
  }
}

function updateSelectedCount() {
  const selectedCount = selectedQuestions.length;
  contador.textContent = selectedCount;
  document.getElementById('selectedQuestionIds').value = selectedQuestions.join(',');
}

selectAllCheckbox.addEventListener('change', () => {
  const checkboxes = document.querySelectorAll('.questao-checkbox');
  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageEnd = Math.min(pageStart + itemsPerPage, filteredQuestoes.length);
  const pageQuestionIds = filteredQuestoes.slice(pageStart, pageEnd).map(q => String(q.id_questao));

  if (selectAllCheckbox.checked) {
    pageQuestionIds.forEach(id => {
      if (!selectedQuestions.includes(id)) {
        selectedQuestions.push(id);
      }
    });
  } else {
    selectedQuestions = selectedQuestions.filter(id => !pageQuestionIds.includes(id));
  }

  sessionStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions));
  console.log('Updated selectedQuestions:', selectedQuestions);
  renderTable();
  updateSelectedCount();
});

questoesBody.addEventListener('change', (e) => {
  if (e.target.classList.contains('questao-checkbox')) {
    const id = e.target.value;
    if (e.target.checked) {
      if (!selectedQuestions.includes(id)) {
        selectedQuestions.push(id);
      }
    } else {
      selectedQuestions = selectedQuestions.filter(qid => qid !== id);
    }
    sessionStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions));
    console.log('Updated selectedQuestions:', selectedQuestions);
    updateSelectedCount();
    selectAllCheckbox.checked = document.querySelectorAll('.questao-checkbox').length ===
      document.querySelectorAll('.questao-checkbox:checked').length;
  }
});

async function saveSimulado() {
  console.log('sessionStorage.selectedQuestions:', sessionStorage.getItem('selectedQuestions'));
  console.log('modo value:', modoSelect.value);

  const formData = {
    titulo: document.getElementById('titulo').value,
    descricao: document.getElementById('descricao').value,
    tipo: document.getElementById('tipo').value,
    modo: modoSelect.value || '1',
    selectedQuestionIds: selectedQuestions.filter(id => id) || []
  };

  console.log('FormData being sent:', formData);

  if (!formData.titulo || !formData.descricao) {
    alert('Por favor, preencha o título e a descrição.');
    formSection.style.display = 'flex';
    newContentSection.style.display = 'none';
    return;
  }

  if (!formData.selectedQuestionIds.length) {
    alert('Por favor, selecione pelo menos uma questão.');
    return;
  }

  const saveButton = document.querySelector('.salvar-btn');
  saveButton.disabled = true;
  saveButton.textContent = 'Salvando...';

  try {
    const response = await axios.post('/simulados/criar-simulado', formData, {
      validateStatus: status => status >= 200 && status < 300,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    console.log('Resposta recebida:', response);
    alert('Simulado salvo com sucesso!');
    sessionStorage.removeItem('selectedQuestions');
    selectedQuestions = [];
    window.location.href = '/simulados/meus-simulados';
  } catch (error) {
    console.error('Erro capturado:', error, error.response);
    if (error.response?.status === 400 && error.response?.data?.details) {
      const errorDetails = error.response.data.details;
      // Format error messages for display
      const errorMessages = errorDetails.map(err => `${err.path}: ${err.message}`).join('\n');
      alert(`Erro ao criar material:\n${errorMessages}`);
    } else {
      // Fallback for other errors
      const errorMessage = error.response?.data?.error || 'Tente novamente.';
      alert(`Erro ao criar material: ${errorMessage}`);
    }
  } finally {
    console.log('Executando finally');
    saveButton.disabled = false;
    saveButton.textContent = 'Salvar';
  }
}

const patterns = {
  textPattern: /^[a-zA-Z0-9\s.,!?()-]*$/, // Allows alphanumeric, spaces, and common punctuation
  sqlPattern: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|;|--|\*)\b)/i // Detects SQL injection patterns
};

// Validation functions
function validateTitulo(value) {
  if (!value) return "O título não pode ser vazio";
  if (value.length < 10) return "O título deve ter pelo menos 10 caracteres";
  if (value.length > 200) return "O título não pode exceder 200 caracteres";
  if (!patterns.textPattern.test(value)) return "Formato de título inválido";
  if (patterns.sqlPattern.test(value)) return "Formato de título inválido";
  return "";
}

function validateDescricao(value) {
  if (!value) return "Descrição não pode ser vazio";
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

// Real-time validation
function setupValidation() {
  const form = document.getElementById('simuladoForm');
  const tituloInput = document.getElementById('titulo');
  const descricaoInput = document.getElementById('descricao');
  const tipoSelect = document.getElementById('tipo');
  const addQuestionsButton = document.getElementById('addQuestionsButton');

  // Real-time validation for titulo
  tituloInput.addEventListener('input', () => {
    const error = validateTitulo(tituloInput.value);
    document.getElementById('titulo-error').textContent = error;
    updateQuestionsButton();
  });

  // Real-time validation for descricao
  descricaoInput.addEventListener('input', () => {
    const error = validateDescricao(descricaoInput.value);
    document.getElementById('descricao-error').textContent = error;
    updateQuestionsButton();
  });

  // Real-time validation for tipo
  tipoSelect.addEventListener('change', () => {
    const error = validateTipo(tipoSelect.value);
    document.getElementById('tipo-error').textContent = error;
    updateQuestionsButton();
  });

  // Enable/disable submit button based on validation
  function updateQuestionsButton() {
    const tituloError = validateTitulo(tituloInput.value);
    const descricaoError = validateDescricao(descricaoInput.value);
    const tipoError = validateTipo(tipoSelect.value);
    addQuestionsButton.disabled = !!(tituloError || descricaoError || tipoError);
  }

  updateQuestionsButton();
}

// Run validation setup when the DOM is loaded
document.addEventListener('DOMContentLoaded', setupValidation);

// Limpa sessionStorage ao sair da página
window.addEventListener('beforeunload', () => {
  console.log('Leaving page, clearing sessionStorage');
  sessionStorage.removeItem('selectedQuestions');
});

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
  history.pushState({ section: 'form' }, '', '#form');
  applyFilters();
});