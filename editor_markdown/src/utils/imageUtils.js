import Resizer from 'react-image-file-resizer';
import axios from 'axios';

export const resizeImage = (file, maxWidth, maxHeight) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      'JPEG',
      100,
      0,
      (uri) => resolve(uri),
      'file'
    );
  });

export const handleImageUpload = async (file, width, height) => {
  if (/\s/.test(file.name)) {
    alert('Erro: o nome do arquivo não pode conter espaços em branco.\n\nRenomeie o arquivo (use sublinhado _ ou hífen -) e tente novamente.');
    return null;
  }
  try {
    const resizedFile = await resizeImage(file, width, height);

    const formData = new FormData();
    formData.append('image', resizedFile);

    const response = await axios.post('/uploads/editor', formData, {
      timeout: 30000,
      // NÃO defina Content-Type → deixa o navegador colocar com boundary correto
    });

    if (!response.data) {
      throw new Error('Resposta vazia do servidor');
    }

    const imageUrl = response.data.trim();

    // Markdown limpo: alt text sem espaços, URL intacta (seu backend já deve salvar com nome seguro)
    const altText = finalFileName.split('.').slice(0, -1).join('.'); // remove extensão do alt

    return `\n\n![${altText}](${imageUrl})\n\n`;

  } catch (error) {
    console.error('Falha no upload da imagem:', error);

    let mensagem = 'Falha ao enviar a imagem. Tente novamente.';

    if (error.response?.status === 413) mensagem = 'Imagem muito grande.';
    else if (error.response?.status === 415) mensagem = 'Formato de imagem não suportado.';
    else if (error.code === 'ERR_NETWORK') mensagem = 'Sem conexão com a internet.';

    alert(mensagem);
    return null;
  }
};