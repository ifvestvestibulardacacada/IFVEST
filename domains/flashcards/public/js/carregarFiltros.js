// carregar-filtros.js — VERSÃO NUCLEAR (FUNCIONA ATÉ NO INFERNO)

document.addEventListener('DOMContentLoaded', function () {
  console.log('Iniciando carregamento dos filtros...');

  const areaSelect = document.getElementById('area');
  const topicoSelect = document.getElementById('topico');
  const dificuldadeSelect = document.getElementById('dificuldade');

  // Configuração global do Axios pra forçar JSON
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  async function carregarAreas() {
    try {
      const response = await axios.get('/shared/api/areas', {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const areas = response.data;
      console.log('ÁREAS CARREGADAS:', areas);

      const selected = areaSelect?.dataset?.selected || '';
      areaSelect.innerHTML = `<option value="" selected disabled>Selecione a Área</option>`;
      areas.forEach(a => {
        const sel = String(a.id_area) === selected ? 'selected' : '';
        areaSelect.innerHTML += `<option value="${a.id_area}" ${sel}>${a.nome}</option>`;
      });
    } catch (err) {
      console.error('ERRO AO CARREGAR ÁREAS:', err.response?.status, err.response?.data || err.message);
      areaSelect.innerHTML = `<option value="">Erro ao carregar áreas</option>`;
    }
  }

  async function carregarTopicos(id_area) {
    try {
      const response = await axios.get(`/shared/api/topicos/${id_area}`, {
        headers: { 'Accept': 'application/json' }
      });
      const topicos = response.data;
      console.log('TÓPICOS CARREGADOS:', topicos);

      const selected = topicoSelect?.dataset?.selected || '';
      topicoSelect.innerHTML = `<option value="" selected disabled>Selecione o Tópico</option>`;
      topicos.forEach(t => {
        const sel = String(t.id_topico) === selected ? 'selected' : '';
        topicoSelect.innerHTML += `<option value="${t.id_topico}" ${sel}>${t.nome}</option>`;
      });
    } catch (err) {
      console.error('ERRO TÓPICOS:', err);
    }
  }

  async function carregarDificuldades() {
    try {
      const response = await axios.get('/dificuldades', {
        headers: { 'Accept': 'application/json' }
      });
      const dificuldades = response.data;
      console.log('DIFICULDADES:', dificuldades);

      const selected = dificuldadeSelect?.dataset?.selected || '';
      dificuldadeSelect.innerHTML = `<option value="" selected disabled>Selecione a Dificuldade</option>`;
      dificuldades.forEach(d => {
        const sel = String(d.id_dificuldade) === selected ? 'selected' : '';
        dificuldadeSelect.innerHTML += `<option value="${d.id_dificuldade}" ${sel}>${d.nivel}</option>`;
      });
    } catch (err) {
      console.error('ERRO DIFICULDADES:', err);
    }
  }

  // EXECUTA
  if (areaSelect) carregarAreas().then(() => {
    const selected = areaSelect.dataset.selected;
    if (selected) carregarTopicos(selected);
  });

  if (dificuldadeSelect) carregarDificuldades();

  areaSelect?.addEventListener('change', e => {
    const id = e.target.value;
    topicoSelect.innerHTML = `<option value="" selected disabled>Carregando...</option>`;
    if (id) carregarTopicos(id);
  });
});