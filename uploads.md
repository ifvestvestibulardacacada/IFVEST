# Fluxo de Uploads de Arquivos

Este documento detalha o fluxo de uploads para os três cenários principais do sistema IFVest:

---

## 1. Edição de Foto de Perfil de Usuário

**Frontend:**
- O usuário acessa a página de edição de perfil (`/usuario/editar`).
- Um formulário permite selecionar uma nova imagem (`<input type="file" name="image">`).
- Ao submeter, faz POST para `/uploads/`.

**Backend:**
- Rota: `routes/uploadRouter.js`
  - `roteador.post('/', upload.single('image'), Database.usuarios.changeImg);`
- Middleware: `middleware/multerConfig.js`
  - Salva o arquivo em `UPLOADS_DIR` (por padrão `/home/ifvestjc/public_html/uploads`).
  - O nome do arquivo é prefixado com timestamp.
- Controller: `modules/Database.js` > `changeImg`
  - Verifica se o arquivo foi enviado.
  - Remove a imagem antiga do usuário (se existir).
  - Atualiza o campo `imagem_perfil` do usuário no banco de dados.
  - Atualiza a sessão com o novo caminho da imagem.
  - O caminho salvo é `/uploads/<nome_do_arquivo>`.

**Exibição:**
- O campo `imagemPerfil` da sessão é usado para exibir a imagem do usuário.

---

## 2. Adição de Foto em Questão

**Frontend:**
- Na criação/edição de questão, há campos para anexar imagens (ex: editor Quill, input type="file").
- O upload pode ser feito via AJAX ou formulário para `/uploads/editor`.

**Backend:**
- Rota: `routes/uploadRouter.js`
  - `roteador.post('/editor', upload.single('image'), Database.questoes.addImage);`
- Middleware: `middleware/multerConfig.js`
  - Salva o arquivo em `UPLOADS_DIR`.
- Controller: `modules/Database.js` > `addImage`
  - Verifica se o arquivo foi enviado.
  - Retorna a URL pública da imagem: `/uploads/<nome_do_arquivo>`.
- O frontend insere a URL da imagem no campo da questão (ex: no markdown ou HTML).

**Exibição:**
- Ao renderizar a questão, a imagem é exibida usando a URL pública.

---

## 3. Adição de Foto em Material de Revisão

**Frontend:**
- Na criação/edição de material de revisão, há opção para anexar imagens (ex: editor markdown, input type="file").
- O upload pode ser feito via AJAX ou formulário para `/uploads/editor`.

**Backend:**
- Rota: `routes/uploadRouter.js`
  - `roteador.post('/editor', upload.single('image'), Database.questoes.addImage);` (reutilizado)
- Middleware: `middleware/multerConfig.js`
  - Salva o arquivo em `UPLOADS_DIR`.
- Controller: `modules/Database.js` > `addImage`
  - Verifica se o arquivo foi enviado.
  - Retorna a URL pública da imagem: `/uploads/<nome_do_arquivo>`.
- O frontend insere a URL da imagem no campo do material (ex: no markdown ou HTML).

**Exibição:**
- Ao renderizar o material, a imagem é exibida usando a URL pública.

---

## Observações Gerais
- O diretório de uploads pode ser alterado via variável de ambiente `UPLOADS_DIR`.
- O middleware Multer é responsável por salvar os arquivos e gerar nomes únicos.
- O acesso aos arquivos é feito via `express.static('/uploads', ...)`.
- O mesmo fluxo de upload é reutilizado para questões e materiais de revisão.
- A remoção de imagens antigas é feita apenas para fotos de perfil.

---

**Referências de código:**
- `middleware/multerConfig.js`
- `routes/uploadRouter.js`
- `modules/Database.js` (métodos: `changeImg`, `addImage`)
- `views/usuario/editar_usuario.ejs`
- `public/js/professor/editor.js`, `public/js/professor/initializeQuill.js`
- `domains/revisao/controllers/*` (criação/edição de material)
