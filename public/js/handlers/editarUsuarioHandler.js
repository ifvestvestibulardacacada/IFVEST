document.addEventListener('DOMContentLoaded', function () {
  // === 1. UPLOAD DE FOTO ===
  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const file = document.getElementById('image-input').files[0];
      if (!file) return alert('Selecione uma imagem.');
      if (file.size > 800 * 1024) return alert('Imagem muito grande (máx. 800KB).');

      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await axios.post('/uploads/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const img = document.getElementById('preview-image');
        img.src = res.data.imageUrl + '?t=' + Date.now();
        alert('Foto atualizada com sucesso!');
      } catch (err) {
        alert(err.response?.data?.error || 'Erro no upload.');
      }
    });
  }

  // === 2. EDIÇÃO DE PERFIL ===
  const formEditar = document.getElementById('formEditarPerfil');
  if (formEditar) {
    formEditar.addEventListener('submit', async function (e) {
      e.preventDefault();
      const id = formEditar.dataset.id;
      const data = {
        usuario: formEditar.usuario.value.trim(),
        nome: formEditar.nome.value.trim(),
        email: formEditar.email.value.trim()
      };

      if (!data.usuario || !data.nome || !data.email) {
        return alert('Preencha todos os campos.');
      }

      try {
        await axios.patch(`/usuario/editar/${id}`, data);
        alert('Perfil atualizado com sucesso!');

        // Atualiza na tela
        document.querySelector('.profile-header h3').textContent = data.nome;
        document.querySelector('.profile-header p:nth-of-type(2)').innerHTML = `<i class="fa fa-envelope"></i> ${data.email}`;
      } catch (err) {
        alert(err.response?.data?.error || 'Erro ao salvar.');
      }
    });
  }

  // === 3. EXCLUSÃO DE CONTA ===
  const formExcluir = document.getElementById('formExcluirConta');
  if (formExcluir) {
    formExcluir.addEventListener('submit', async function (e) {
      e.preventDefault();
      const id = formExcluir.dataset.id;
      const input = document.getElementById('confirmInput').value.trim();

      if (input !== 'DELETAR') {
        return alert('Digite exatamente "DELETAR" para confirmar.');
      }

      if (!confirm('Esta ação é IRREVERSÍVEL. Tem certeza?')) return;

      try {
        await axios.delete(`/usuario/${id}`);
        alert('Conta excluída. Redirecionando...');
        setTimeout(() => location.href = '/login', 1000);
      } catch (err) {
        alert(err.response?.data?.error || 'Erro ao excluir conta.');
      }
    });
  }

  // === 4. PREVIEW DE IMAGEM ===
  const imageInput = document.getElementById('image-input');
  if (imageInput) {
    imageInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById('preview-image').src = e.target.result;
        reader.readAsDataURL(file);
      }
    });
  }