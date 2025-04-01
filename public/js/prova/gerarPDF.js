document.addEventListener('DOMContentLoaded', function () {
    const btnGenerate = document.querySelector("#generate-pdf");
    console.log("Botão de gerar PDF:", btnGenerate);

    if (btnGenerate) {
        btnGenerate.addEventListener("click", () => {
            console.log("Botão de gerar PDF clicado:", btnGenerate);

            // Captura o formulário de simulado pelo ID
            const impressao = document.querySelector("#questionario");
            const clone = impressao.cloneNode(true); 

            // Define as opções para gerar o PDF
            const design = {
                margin: [2, 2, 2, 2],
                filename: "IFVEST_simulado.pdf",
                html2canvas: { scale: 2 }, // Melhorar a resolução do PDF
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy'] // Configuração de quebra de página
                }
            };

            console.log("Opções de design do PDF:", design);

            // Gera o PDF a partir do formulário capturado
            html2pdf()
                .set(design)
                .from(clone) // Use o clone aqui
                .save()
                .then(() => {
                    console.log("PDF gerado com sucesso!");
                    // Opcional: Restaurar o botão de envio após o PDF ser gerado
                    if (submitButton) {
                        submitButton.style.display = ''; // Mostra o botão novamente
                    }
                })
                .catch((error) => {
                    console.error("Erro ao gerar PDF:", error);
                });
        });
    } else {
        console.error("Botão de gerar PDF não encontrado");
    }
});