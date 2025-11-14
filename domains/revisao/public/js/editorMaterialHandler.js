// Handler for submit and form wiring for unified editor
(function () {
  const submitBtn = document.getElementById('submitButton');
  const selectedSubjectIdInput = document.getElementById('selected_subject_id');
  const selectedSubjectNameEl = document.getElementById('selected_subject_name');
  const materialTituloInput = document.getElementById('materialTitulo');

  // Fill form fields if in edit mode
  if (window.MODE === 'edit' && window.Material) {
    // Set title
    if (materialTituloInput && window.Material.titulo) {
      materialTituloInput.value = window.Material.titulo;
    }

    // Set subject
    if (selectedSubjectIdInput && selectedSubjectNameEl) {
      if (window.Material.id_assunto) {
        selectedSubjectIdInput.value = window.Material.id_assunto;
      } else if (window.Material.assunto && window.Material.assunto.id_assunto) {
        selectedSubjectIdInput.value = window.Material.assunto.id_assunto;
      }
      
      if (window.Material.assunto && window.Material.assunto.nome) {
        selectedSubjectNameEl.textContent = window.Material.assunto.nome;
      }
    }
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
      assuntoId: selectedSubjectIdInput.value || null,
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
