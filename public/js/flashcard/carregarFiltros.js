// carregar-filtros.js

async function carregarAreas() {
  const res = await fetch('/areas');
  const areas = await res.json();
  const select = document.getElementById('area');
  const selected = select?.dataset?.selected;
  areas.forEach(a => {
    const isSelected = selected && String(selected) === String(a.id_area);
    select.innerHTML += `<option value="${a.id_area}" ${isSelected ? 'selected' : ''}>${a.nome}</option>`;
  });
}

async function carregarTopicos(id_area) {
  const res = await fetch(`/topicos/${id_area}`);
  const topicos = await res.json();
  const select = document.getElementById('topico');
  const selected = select?.dataset?.selected;
  select.innerHTML = '<option value="">Selecione o Tópico</option>';
  topicos.forEach(t => {
    const isSelected = selected && String(selected) === String(t.id_topico);
    select.innerHTML += `<option value="${t.id_topico}" ${isSelected ? 'selected' : ''}>${t.nome}</option>`;
  });
}

async function carregarDificuldades() {
  const res = await fetch('/dificuldades');
  const dificuldades = await res.json();
  const select = document.getElementById('dificuldade');
  const selected = select?.dataset?.selected;
  dificuldades.forEach(d => {
    const isSelected = selected && String(selected) === String(d.id_dificuldade);
    select.innerHTML += `<option value="${d.id_dificuldade}" ${isSelected ? 'selected' : ''}>${d.nivel}</option>`;
  });
}

if (document.getElementById('area')) {
  document.getElementById('area').addEventListener('change', (e) => {
    const id_area = e.target.value;
    if (id_area) carregarTopicos(id_area);
  });
}

window.onload = async () => {
  const areaSelect = document.getElementById('area');
  const topicoSelect = document.getElementById('topico');
  const dificuldadeSelect = document.getElementById('dificuldade');

  if (areaSelect) {
    await carregarAreas();
    const selectedArea = areaSelect.dataset?.selected;
    if (selectedArea) {
      await carregarTopicos(selectedArea);
    }
  }

  if (dificuldadeSelect) {
    await carregarDificuldades();
  }
};
