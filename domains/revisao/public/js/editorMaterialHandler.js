// Handler for submit and form wiring for unified editor
(function () {
  const submitBtn = document.getElementById('submitButton');
  const selectAssunto = document.getElementById('selectAssunto');
  const linksTextarea = document.getElementById('linksExternos');

  // select assunto if provided by server
  try {
    if (window.Material && window.Material.id_assunto) {
      const opt = document.querySelector(`#selectAssunto option[value="${window.Material.id_assunto}"]`);
      if (opt) opt.selected = true;
    } else if (window.Material && window.Material.assunto && window.Material.assunto.id_assunto) {
      const opt = document.querySelector(`#selectAssunto option[value="${window.Material.assunto.id_assunto}"]`);
      if (opt) opt.selected = true;
    }
  } catch (e) {
    console.warn('Erro ao marcar assunto:', e);
  }

  async function submitHandler() {
    // Simple validation
    const nome = document.getElementById('materialTitulo').value.trim();
    if (!nome) {
      alert('Informe um título para o material.');
      return;
    }

    // tags are exposed by editor_material.js
    const palavrasChave = Array.isArray(window.editorTags) ? window.editorTags : [];

    const payload = {
      titulo: nome,
      assuntoId: (selectAssunto && selectAssunto.value) ? selectAssunto.value : null,
      palavrasChave,
      // linksExternos: array of objects { name, link }
      linksExternos: Array.isArray(window.externalMaterials) ? window.externalMaterials : [],
      conteudo: (function () { try { return localStorage.getItem('EditorContent') || ''; } catch (e) { return ''; } })()
    };

    try {
      // Use the routes defined in domains/revisao/router.js
      if (window.MODE === 'edit' && window.Material) {
        // router expects :id_conteudo as param; accept either id_conteudo or id_material
        const id = window.Material.id_conteudo || window.Material.id_material;
        if (!id) throw new Error('Material id not found for edit');
        await axios.patch(`/revisao/editar_material/${id}`, payload);
        // clear temporary editor content
        try { localStorage.removeItem('EditorContent'); } catch (e) {}
        window.location.href = '/revisao';
      } else {
        await axios.post('/revisao/criar_material', payload);
        try { localStorage.removeItem('EditorContent'); } catch (e) {}
        window.location.href = '/revisao';
      }
    } catch (err) {
      console.error('Erro ao salvar material', err);
      alert('Erro ao salvar material. Veja o console para mais detalhes.');
    }
  }

  if (submitBtn) submitBtn.addEventListener('click', submitHandler);

})();
