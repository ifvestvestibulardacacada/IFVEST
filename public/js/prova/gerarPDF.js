// document.addEventListener('DOMContentLoaded', function () {
//     const btnGenerate = document.querySelector("#generate-pdf");
//     console.log("Botão de gerar PDF:", btnGenerate);

//     if (btnGenerate) {
//         btnGenerate.addEventListener("click", () => {
//             console.log("Botão de gerar PDF clicado:", btnGenerate);

//             // Captura o formulário de simulado pelo ID
//             const impressao = document.querySelector("#questionario");
//             const clone = impressao.cloneNode(true); 

//             // Define as opções para gerar o PDF
//             const design = {
//                 margin: [2, 2, 2, 2],
//                 filename: "IFVEST_simulado.pdf",
//                 html2canvas: { scale: 2 }, // Melhorar a resolução do PDF
//                 jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//                 pagebreak: {
//                     mode: ['css', 'legacy'], // Removido 'avoid-all' para testar
//                     before: '.questao-wrapper' // Configuração de quebra de página
//                 }
//             };

//             console.log("Opções de design do PDF:", design);

//             // Gera o PDF a partir do formulário capturado
//             html2pdf()
//                 .set(design)
//                 .from(clone) // Use o clone aqui
//                 .save()
//                 .then(() => {
//                     console.log("PDF gerado com sucesso!");
//                     // Opcional: Restaurar o botão de envio após o PDF ser gerado
//                     if (submitButton) {
//                         submitButton.style.display = ''; // Mostra o botão novamente
//                     }
//                 })
//                 .catch((error) => {
//                     console.error("Erro ao gerar PDF:", error);
//                 });
//         });
//     } else {
//         console.error("Botão de gerar PDF não encontrado");
//     }
// });
document.addEventListener('DOMContentLoaded', function () {
    const btnGenerate = document.querySelector("#generate-pdf");

    if (btnGenerate) {
        btnGenerate.addEventListener("click", () => {
            // Desativa o botão para evitar cliques duplos durante o processamento
            btnGenerate.disabled = true;
            btnGenerate.innerText = 'Gerando...';

            // Executa a lógica de geração de PDF
            gerarPdfPaginado();
        });
    }

    async function gerarPdfPaginado() {
        const impressao = document.querySelector("#questionario");
        
        // 1. CLONAR O CONTEÚDO
        const clone = impressao.cloneNode(true);

        // 2. PREPARAR ÁREA DE MEDIÇÃO
        // Cria um container oculto com a largura exata do conteúdo de um PDF A4.
        // Largura A4 = 210mm. Margens (2mm esq + 2mm dir) = 4mm. Área útil = 206mm.
        const areaDeMedicao = document.createElement('div');
        areaDeMedicao.style.position = 'absolute';
        areaDeMedicao.style.left = '-9999px'; // Empurra para fora da tela
        areaDeMedicao.style.top = '0';
        areaDeMedicao.style.width = '205mm'; // Largura útil do A4
        areaDeMedicao.appendChild(clone);
        document.body.appendChild(areaDeMedicao);

        // --- VALOR MAIS IMPORTANTE PARA AJUSTAR ---
        // Altura útil de uma página A4 em pixels.
        // A4 (297mm) com margens (2mm sup + 2mm inf) = 293mm.
        // A conversão mm -> px depende da resolução (DPI). Um bom valor inicial é ~1050px.
        // Você talvez precise ajustar este valor (ex: 1040, 1100) para um encaixe perfeito.
        const ALTURA_PAGINA_A4_PX = 1050;

        let contadorAltura = 0;
        const todasAsQuestoes = clone.querySelectorAll('.questao-wrapper');

        // 3. ITERAR E MEDIR
        todasAsQuestoes.forEach(questao => {
            // Pega a altura renderizada da questão DENTRO da área de medição
            const alturaQuestao = questao.offsetHeight;

            // 4. CALCULAR O ENCAIXE E INSERIR QUEBRA
            if (contadorAltura + alturaQuestao > ALTURA_PAGINA_A4_PX) {
                // A questão atual não cabe, então insere uma quebra de página ANTES dela
                questao.classList.add('pdf-page-break');
                // Zera o contador e a nova página começa com a altura da questão atual
                contadorAltura = alturaQuestao;
            } else {
                // A questão cabe, apenas adiciona sua altura ao contador
                contadorAltura += alturaQuestao;
            }
        });

        // 5. GERAR O PDF
        const design = {
            margin: [2, 2, 2, 2],
            filename: "IFVEST_simulado_paginado.pdf",
            html2canvas: { scale: 2, useCORS: true }, // useCORS ajuda com imagens externas
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: {
                mode: 'css', // Respeita a nossa classe .pdf-page-break
            }
        };

        html2pdf()
            .set(design)
            .from(clone) // Gera o PDF a partir do clone modificado
            .save()
            .then(() => {
                // 6. LIMPAR
                document.body.removeChild(areaDeMedicao);
                // Reativa o botão
                btnGenerate.disabled = false;
                btnGenerate.innerHTML = '<i class="fas fa-print"></i> Gerar PDF';
            })
            .catch((error) => {
                console.error("Erro ao gerar PDF paginado:", error);
                document.body.removeChild(areaDeMedicao);
                btnGenerate.disabled = false;
                btnGenerate.innerHTML = '<i class="fas fa-print"></i> Gerar PDF';
            });
    }
});