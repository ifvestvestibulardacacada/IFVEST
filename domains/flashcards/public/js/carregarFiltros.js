// carregar-filtros.js

async function carregarAreas() {
  const res = await fetch('/areas');
  const areas = await res.json();
  const select = document.getElementById('area');
  const selected = select?.dataset?.selected;
<<<<<<< HEAD
  const isRequired = select?.hasAttribute('required');
  // Start with a visible placeholder; mark it selected only when there's no preselected value
  const placeholderSelected = selected ? '' : 'selected';
  const placeholderText = isRequired ? 'Selecione a área' : 'Selecione a Área (opcional)';
  select.innerHTML = `<option value="" ${placeholderSelected} disabled>${placeholderText}</option>`;
=======
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
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
<<<<<<< HEAD
  const isRequired = select?.hasAttribute('required');
  // Visible placeholder; select it only when there's no preselected tópico
  const placeholderSelected = selected ? '' : 'selected';
  const placeholderText = isRequired ? 'Selecione o tópico' : 'Selecione o Tópico (opcional)';
  select.innerHTML = `<option value="" ${placeholderSelected} disabled>${placeholderText}</option>`;
  // Populate topics returned by the server
=======
  select.innerHTML = '<option value="">Selecione o Tópico</option>';
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
  topicos.forEach(t => {
    const isSelected = selected && String(selected) === String(t.id_topico);
    select.innerHTML += `<option value="${t.id_topico}" ${isSelected ? 'selected' : ''}>${t.nome}</option>`;
  });
<<<<<<< HEAD

  // If there is a selected topic id provided by server but it wasn't included in the returned list,
  // add a fallback option so the select still shows the selected value (prevents disappearing selection).
  if (selected) {
    const found = topicos.some(t => String(t.id_topico) === String(selected));
    if (!found) {
      console.warn(`Selected tópico id ${selected} not present in /topicos/${id_area} response. Adding fallback option.`);
      // Add a fallback option with a readable label
      const fallbackLabel = `Tópico (ID: ${selected})`;
      select.innerHTML += `<option value="${selected}" selected>${fallbackLabel}</option>`;
    }
  }
=======
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
}

async function carregarDificuldades() {
  const res = await fetch('/dificuldades');
  const dificuldades = await res.json();
  const select = document.getElementById('dificuldade');
  const selected = select?.dataset?.selected;
<<<<<<< HEAD
  const isRequired = select?.hasAttribute('required');
  // Visible placeholder; select it only when there's no preselected dificuldade
  const placeholderSelected = selected ? '' : 'selected';
  const placeholderText = isRequired ? 'Selecione a dificuldade' : 'Selecione a Dificuldade (opcional)';
  select.innerHTML = `<option value="" ${placeholderSelected} disabled>${placeholderText}</option>`;
=======
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
  dificuldades.forEach(d => {
    const isSelected = selected && String(selected) === String(d.id_dificuldade);
    select.innerHTML += `<option value="${d.id_dificuldade}" ${isSelected ? 'selected' : ''}>${d.nivel}</option>`;
  });
}

if (document.getElementById('area')) {
  document.getElementById('area').addEventListener('change', (e) => {
    const id_area = e.target.value;
<<<<<<< HEAD
    const topicoSelect = document.getElementById('topico');
    // Reset the tópico select to a visible placeholder while loading
    const isRequired = topicoSelect?.hasAttribute('required');
    const placeholderText = isRequired ? 'Selecione o tópico' : 'Selecione o Tópico (opcional)';
    topicoSelect.innerHTML = `<option value="" selected disabled>${placeholderText}</option>`;
    // Clear any previously stored data-selected because the user actively changed area
    if (topicoSelect) topicoSelect.dataset.selected = '';
    if (id_area) carregarTopicos(id_area).catch(err => {
      console.error('Erro ao carregar tópicos para a área', id_area, err);
    });
=======
    if (id_area) carregarTopicos(id_area);
>>>>>>> 49cd21b (feat: architecture change on flashcards domain)
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
