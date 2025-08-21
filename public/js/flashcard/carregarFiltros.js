// carregar-filtros.js

async function carregarAreas() {
  const res = await fetch('/areas');
  const areas = await res.json();
  const select = document.getElementById('area');
  areas.forEach(a => {
    select.innerHTML += `<option value="${a.id_area}">${a.nome}</option>`;
  });
}

async function carregarTopicos(id_area) {
  const res = await fetch(`/topicos/${id_area}`);
  const topicos = await res.json();
  const select = document.getElementById('topico');
  select.innerHTML = '<option value="">Selecione o Tópico</option>';
  topicos.forEach(t => {
    select.innerHTML += `<option value="${t.id_topico}">${t.nome}</option>`;
  });
}

async function carregarDificuldades() {
  const res = await fetch('/dificuldades');
  const dificuldades = await res.json();
  const select = document.getElementById('dificuldade');
  dificuldades.forEach(d => {
    select.innerHTML += `<option value="${d.id_dificuldade}">${d.nivel}</option>`;
  });
}

if (document.getElementById('area')) {
  document.getElementById('area').addEventListener('change', (e) => {
    const id_area = e.target.value;
    if (id_area) carregarTopicos(id_area);
  });
}

window.onload = () => {
  if (document.getElementById('area')) carregarAreas();
  if (document.getElementById('dificuldade')) carregarDificuldades();
};
