// ============================================
// 1. ESTRUTURA DO PROJETO
// ============================================
/*
projeto/
├── models/
│   ├── index.js
│   ├── Simulado.js
│   ├── Questao.js
│   └── Opcao.js
├── routes/
│   └── simulado.js
├── controllers/
│   └── simuladoController.js
├── utils/
│   └── pdfGenerator.js
├── views/
│   ├── simulados.ejs
│   └── partials/
│       └── header.ejs
├── public/
│   └── css/
│       └── style.css
├── server.js
└── package.json
*/

// ============================================
// 9. controllers/simuladoController.js
// ============================================
/*



// Gerar PDF
exports.gerarPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const simulado = await db.Simulado.findByPk(id, {
      include: [{
        model: db.Questao,
        as: 'Questao',
        include: [{
          model: db.Opcao,
          as: 'Opcao',
          order: [['alternativa', 'ASC']]
        }],
        order: [['id_questao', 'ASC']]
      }]
    });

    if (!simulado) {
      return res.status(404).send('Simulado não encontrado');
    }

    console.log(`📄 Gerando PDF do simulado: ${simulado.titulo}`);

    const pdf = await gerarPDFSimulado(simulado);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Simulado_${simulado.id_simulado}_${new Date().getFullYear()}.pdf"`);
    res.send(pdf);

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    res.status(500).send('Erro ao gerar PDF: ' + error.message);
  }
};

// API JSON (para uso futuro)
exports.buscarSimuladoAPI = async (req, res) => {
  try {
    const { id } = req.params;

    const simulado = await db.Simulado.findByPk(id, {
      include: [{
        model: db.Questao,
        as: 'Questao',
        include: [{
          model: db.Opcao,
          as: 'Opcao'
        }]
      }]
    });

    if (!simulado) {
      return res.status(404).json({ error: 'Simulado não encontrado' });
    }

    res.json(simulado);
  } catch (error) {
    console.error('Erro ao buscar simulado:', error);
    res.status(500).json({ error: 'Erro ao buscar simulado' });
  }
};
*/

// ============================================
// 10. utils/pdfGenerator.js (PUPPETEER)
// ============================================
/*
const puppeteer = require('puppeteer');

function converterDeltaParaHTML(delta) {
  try {
    let parsedDelta = delta;
    
    if (typeof delta === 'string' && delta.trim().startsWith('{')) {
      try {
        parsedDelta = JSON.parse(delta);
      } catch {
        return escaparHTML(delta);
      }
    }
    
    if (typeof parsedDelta === 'string') {
      return `<p>${escaparHTML(parsedDelta)}</p>`;
    }
    
    if (!parsedDelta || !parsedDelta.ops || !Array.isArray(parsedDelta.ops)) {
      return '<p>Sem conteúdo</p>';
    }
    
    return parsedDelta.ops.map(op => {
      if (op.insert && typeof op.insert === 'object' && op.insert.image) {
        return `<img src="${escaparHTML(op.insert.image)}" alt="Imagem" />`;
      }
      
      if (typeof op.insert === 'string') {
        let texto = escaparHTML(op.insert);
        texto = texto.replace(/\n/g, '<br/>');
        
        if (op.attributes) {
          if (op.attributes.bold) texto = `<strong>${texto}</strong>`;
          if (op.attributes.italic) texto = `<em>${texto}</em>`;
          if (op.attributes.underline) texto = `<u>${texto}</u>`;
        }
        
        return `<p>${texto}</p>`;
      }
      
      return '';
    }).join('');
    
  } catch (error) {
    console.error('Erro ao converter Delta:', error);
    return '<p>Erro ao processar conteúdo</p>';
  }
}

function escaparHTML(texto) {
  if (typeof texto !== 'string') return '';
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function gerarHTMLSimulado(simulado) {
  const ano = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Simulado ENEM - ${simulado.titulo}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      background: #fff;
    }

    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }

    .header h1 {
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }

    .header h2 {
      font-size: 12pt;
      font-weight: normal;
    }

    .instrucoes {
      border: 1px solid #333;
      padding: 10px;
      background: #f5f5f5;
      margin-bottom: 20px;
      font-size: 9pt;
    }

    .instrucoes strong {
      font-weight: bold;
    }

    .simulado {
      column-count: 2;
      column-gap: 20px;
      column-rule: 1px solid #ddd;
    }

    .questao {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 0.5px solid #ccc;
    }

    .questao-numero {
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 5px;
      text-transform: uppercase;
    }

    .titulo {
      margin-bottom: 8px;
      font-weight: bold;
    }

    .pergunta {
      margin-bottom: 10px;
      line-height: 1.5;
    }

    .conteudo p {
      margin: 0 0 5px 0;
    }

    .conteudo strong {
      font-weight: bold;
    }

    .conteudo em {
      font-style: italic;
    }

    .conteudo img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 8px 0;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .opcoes {
      margin-left: 10px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .opcao {
      display: flex;
      margin-bottom: 6px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .letra {
      font-weight: bold;
      margin-right: 8px;
      min-width: 20px;
      flex-shrink: 0;
    }

    .opcao-texto {
      flex: 1;
    }

    .textarea {
      width: 100%;
      height: 80px;
      border: 1px solid #000;
      background: #f9f9f9;
      margin-top: 10px;
      break-inside: avoid;
    }

    @page {
      size: A4;
      margin: 10mm;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Simulado ENEM - IFVest ${ano}</h1>
    <h2>${escaparHTML(simulado.titulo)}</h2>
  </div>

  <div class="instrucoes">
    <strong>Instruções Gerais:</strong> Leia atentamente cada questão antes de responder. 
    Marque apenas uma alternativa nas questões objetivas e utilize o espaço reservado nas dissertativas.
  </div>

  <div class="simulado">
    ${simulado.Questao.map((questao, index) => `
      <div class="questao">
        <div class="questao-numero">Questão ${index + 1}</div>
        
        ${questao.titulo ? `
          <div class="titulo conteudo">
            ${converterDeltaParaHTML(questao.titulo)}
          </div>
        ` : ''}
        
        <div class="pergunta conteudo">
          ${converterDeltaParaHTML(questao.pergunta)}
        </div>
        
        ${questao.tipo === 'OBJETIVA' && questao.Opcao ? `
          <div class="opcoes">
            ${questao.Opcao.map(opcao => `
              <div class="opcao">
                <div class="letra">${opcao.alternativa})</div>
                <div class="opcao-texto conteudo">
                  ${converterDeltaParaHTML(opcao.descricao)}
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        
        ${questao.tipo === 'DISSERTATIVA' ? `
          <div class="textarea"></div>
        ` : ''}
      </div>
    `).join('')}
  </div>
</body>
</html>
  `;
}

async function gerarPDFSimulado(simulado) {
  const html = gerarHTMLSimulado(simulado);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });

  const page = await browser.newPage();
  await page.setContent(html, {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      bottom: '10mm',
      left: '10mm',
      right: '10mm'
    }
  });

  await browser.close();

  return pdf;
}

module.exports = { gerarPDFSimulado, converterDeltaParaHTML };
*/