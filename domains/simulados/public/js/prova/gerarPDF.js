document.addEventListener("DOMContentLoaded", () => {
  const btnGenerate = document.getElementById("generate-pdf");

  if (btnGenerate) {
    btnGenerate.addEventListener("click", async () => {
      btnGenerate.disabled = true;
      btnGenerate.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...';
      try {
        await gerarPDFSemPaginaBranca();
        alert("PDF gerado com sucesso!");
      } catch (err) {
        console.error(err);
        alert("Erro ao gerar PDF.");
      }
      btnGenerate.disabled = false;
      btnGenerate.innerHTML = '<i class="fas fa-print"></i> Gerar PDF';
    });
  }

  async function gerarPDFSemPaginaBranca() {
    const content = document.querySelector("#questionario").cloneNode(true);

    if (!content) throw new Error("Elemento #questionario não encontrado.");

    // Reduzir imagens muito grandes para 160mm de largura
    const imagens = content.querySelectorAll("img");
    imagens.forEach((img) => {
      img.style.maxWidth = "160mm";
      img.style.height = "auto";
      img.style.pageBreakInside = "avoid";
      img.style.breakInside = "avoid";
      img.style.display = "block";
      img.style.margin = "5mm auto";
    });

    // Remover margens e quebras de página do último elemento para evitar página em branco
    const ultimoElemento = content.lastElementChild;
    if (ultimoElemento) {
      ultimoElemento.style.marginBottom = "0";
      ultimoElemento.style.pageBreakAfter = "auto";
    }

    // Configurações do PDF no html2pdf
    const pdfOptions = {
      margin: [8, 8, 8, 8],  // margem em mm
      filename: `IFVEST_ENEM_${new Date().toISOString().split('T')[0]}.pdf`,
      html2canvas: {
        scale: 1.6,
        useCORS: true,
        logging: false,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: {
        mode: ["avoid-all", "css"],
        avoid: [".questao-wrapper", "img"],
      },
    };

    await html2pdf().set(pdfOptions).from(content).save();
  }
});