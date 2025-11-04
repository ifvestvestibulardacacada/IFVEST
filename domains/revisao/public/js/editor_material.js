// Unified editor logic for criar/editar material
(function () {
  const palavrasChaveInput = document.querySelector('#palavrasChave');
  const tagBox = document.querySelector('.tag-box');
  const datalist = document.getElementById('palavrasChaveList');
  const addBtn = document.getElementById('addKeywordBtn');

  // Initialize tags from server-provided Material.PalavraChave (array of strings)
  const tags = Array.isArray(window.Material && window.Material.PalavraChave) ? [...window.Material.PalavraChave] : [];
  // expose for external handlers
  window.editorTags = tags;

  // populate datalist
  (window.PalavrasChave || []).forEach(p => {
    try {
      const option = document.createElement('option');
      option.value = p;
      datalist.appendChild(option);
    } catch (e) {
      // ignore
    }
  });

  function renderTags() {
    if (!tagBox) return;
    tagBox.innerHTML = '';
    tags.forEach((t, i) => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.innerHTML = `${escapeHtml(t)}<i class="bx bx-x" data-index="${i}"></i>`;
      tagBox.appendChild(span);
    });
  }

  function addKeyword() {
    if (!palavrasChaveInput) return;
    const keyword = palavrasChaveInput.value.trim();
    if (!keyword) {
      alert('Por favor, insira uma palavra-chave válida (não vazia).');
      return;
    }
    tags.push(keyword);
    palavrasChaveInput.value = '';
    window.editorTags = tags; // update global reference
    renderTags();
  }

  function removeTag(index) {
    tags.splice(index, 1);
    window.editorTags = tags;
    renderTags();
  }

  // delegate click to remove icons
  if (tagBox) {
    tagBox.addEventListener('click', (e) => {
      const el = e.target.closest('i[data-index]');
      if (el) {
        const idx = Number(el.dataset.index);
        if (!Number.isNaN(idx)) removeTag(idx);
      }
    });
  }

  if (addBtn) addBtn.addEventListener('click', addKeyword);

  // expose function for inline onclick compatibility
  window.addKeyword = addKeyword;

  // Editor content handling via localStorage
  try {
    if (window.MODE === 'edit' && window.Material && window.Material.conteudo_markdown) {
      localStorage.setItem('EditorContent', window.Material.conteudo_markdown);
      console.log('EditorContent set from Material.conteudo_markdown');
    } else {
      localStorage.removeItem('EditorContent');
      console.log('EditorContent removed for create mode');
    }
  } catch (e) {
    console.warn('localStorage unavailable', e);
  }

  // Clear EditorContent on beforeunload to avoid leaking content when leaving
  window.addEventListener('beforeunload', () => {
    try {
      localStorage.removeItem('EditorContent');
    } catch (e) {}
  });

  // If clicking an external anchor, also remove EditorContent
  document.addEventListener('click', (event) => {
    try {
      const target = event.target.closest('a');
      if (target && target.href && !target.href.startsWith(window.location.href)) {
        localStorage.removeItem('EditorContent');
      }
    } catch (e) {}
  });

  // initial render
  renderTags();

  // ---- External materials management ----
  const externalNameInput = document.getElementById('externalName');
  const externalLinkInput = document.getElementById('externalLink');
  const addExternalBtn = document.getElementById('addExternalBtn');
  const clearExternalBtn = document.getElementById('clearExternalBtn');
  const uploadExternalBtn = document.getElementById('uploadExternalBtn');
  const externalListEl = document.getElementById('externalList');
  const externalFileInput = document.getElementById('externalFileInput');

  // Initialize externalMaterials preferring window.MaterialExterno, then fallback to Material.links_externos
  // Support multiple shapes: string (newline), array of strings, array of objects
  let externalMaterials = [];
  function normalizeExternalItem(item) {
    if (!item) return null;
    if (typeof item === 'string') return { name: item, link: item };
    if (typeof item === 'object') return { name: item.name || item.description || item.filename || '', link: item.link || item.url || item.path || item.value || '' };
    return null;
  }

  try {
    // 1) If window.MaterialExterno is provided use it
    const me = window.MaterialExterno;
    if (me) {
      if (Array.isArray(me)) {
        externalMaterials = me.map(normalizeExternalItem).filter(Boolean);
      } else if (typeof me === 'string') {
        externalMaterials = me.split(/\r?\n/).map(s => s.trim()).filter(Boolean).map(s => ({ name: s, link: s }));
      }
    }

    // 2) fallback to window.Material.links_externos if still empty
    if ((!externalMaterials || externalMaterials.length === 0) && window.Material) {
      const src = window.Material.links_externos;
      if (!src) externalMaterials = externalMaterials || [];
      else if (Array.isArray(src)) {
        externalMaterials = src.map(normalizeExternalItem).filter(Boolean);
      } else if (typeof src === 'string') {
        externalMaterials = src.split(/\r?\n/).map(s => s.trim()).filter(Boolean).map(s => ({ name: s, link: s }));
      }
    }
  } catch (e) {
    externalMaterials = [];
  }

  // expose globally for submit handler
  window.externalMaterials = externalMaterials;

  function renderExternalList() {
    if (!externalListEl) return;
    externalListEl.innerHTML = '';
    externalMaterials.forEach((m, i) => {
      const row = document.createElement('div');
      row.className = 'external-item d-flex align-items-center gap-2 mb-2';
      row.innerHTML = `
        <div class="btn-group me-2" role="group">
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-index="${i}">✖</button>
          <button class="btn btn-sm btn-outline-secondary" data-action="edit" data-index="${i}">✎</button>
        </div>
        <div class="external-info flex-grow-1">
          <div><strong>${escapeHtml(m.name)}</strong></div>
          <div><a href="${escapeAttr(m.link)}" target="_blank" rel="noopener">${escapeHtml(m.link)}</a></div>
        </div>
      `;
      externalListEl.appendChild(row);
    });
  }

  function addExternal() {
    const name = (externalNameInput && externalNameInput.value || '').trim();
    const link = (externalLinkInput && externalLinkInput.value || '').trim();
    if (!name || !link) {
      alert('Por favor, informe o nome e o link do material externo.');
      return;
    }
    externalMaterials.push({ name, link });
    window.externalMaterials = externalMaterials;
    clearExternalInputs();
    renderExternalList();
  }

  function clearExternalInputs() {
    if (externalNameInput) externalNameInput.value = '';
    if (externalLinkInput) externalLinkInput.value = '';
  }

  function editExternalAt(index) {
    const m = externalMaterials[index];
    if (!m) return;
    // populate inputs and remove from list temporarily
    if (externalNameInput) externalNameInput.value = m.name;
    if (externalLinkInput) externalLinkInput.value = m.link;
    externalMaterials.splice(index, 1);
    window.externalMaterials = externalMaterials;
    renderExternalList();
  }

  function deleteExternalAt(index) {
    externalMaterials.splice(index, 1);
    window.externalMaterials = externalMaterials;
    renderExternalList();
  }

  // delegate click on external list for edit/delete
  if (externalListEl) {
    externalListEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const idx = Number(btn.dataset.index);
      const act = btn.dataset.action;
      if (act === 'edit') editExternalAt(idx);
      if (act === 'delete') deleteExternalAt(idx);
    });
  }

  if (addExternalBtn) addExternalBtn.addEventListener('click', addExternal);
  if (clearExternalBtn) clearExternalBtn.addEventListener('click', clearExternalInputs);

  // upload flow: open file input, POST to /revisao/upload
  if (uploadExternalBtn && externalFileInput) {
    uploadExternalBtn.addEventListener('click', () => externalFileInput.click());
    externalFileInput.addEventListener('change', async (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('file', file);
      try {
        uploadExternalBtn.disabled = true;
        const res = await axios.post('/revisao/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        // Expecting response to contain { url, filename } or similar
        console.log(res)
        // const data = res && res.data ? res.data : null;
        const name = file.name;
        const link = res.data;
        externalMaterials.push({ name, link });
        window.externalMaterials = externalMaterials;
        renderExternalList();
      } catch (err) {
        console.error('Erro no upload do arquivo', err);
        alert('Erro ao fazer upload do arquivo. Veja o console.');
      } finally {
        uploadExternalBtn.disabled = false;
        externalFileInput.value = '';
      }
    });
  }

  // initial render of externals
  renderExternalList();

  // small helper to avoid XSS when rendering tags into innerHTML
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[s];
    });
  }

  function escapeAttr(url) {
  try {
    if (!url) return '';
    const s = String(url).trim();
    // remove caracteres nulos
    const clean = s.replace(/\u0000/g, '');
    const lower = clean.toLowerCase();

    // rejeitar esquemas potencialmente perigosos
    if (/^\s*(javascript:|data:|vbscript:)/.test(lower)) return '';

    // opcional: permitir apenas http(s), mailto ou caminhos relativos
    // if (!/^(https?:|mailto:|\/\/|\/|[a-z0-9\-_.]+\/)/.test(lower)) return '';

    // escapar entidades para uso seguro em atributos
    return clean
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  } catch (e) {
    return '';
  }
}

})();
