function parseRichText(jsonString) {
        if (!jsonString) return '';
        let html = '';
        try {
            const ops = JSON.parse(jsonString).ops;
            
            ops.forEach(op => {
                
                // IMAGEM
                if (op.insert && typeof op.insert === 'object' && op.insert.image) {
                    let attrs = op.attributes || {};
                    let style = 'max-width: 100%; height: auto; display: block; margin: 10px 0; border: 1px solid #ccc;';
                    
                    if (attrs.width) {
                        style = `width: ${attrs.width}px; max-width: 100%; height: auto; display: block; margin: 10px 0; border: 1px solid #ccc;`;
                    }
                    html += `<img src="${op.insert.image}" alt="Imagem da questão" style="${style}">`;
                }
                
                // TEXTO
                else if (op.insert && typeof op.insert === 'string') {
                    let text = op.insert;
                    
                    // Limpa qualquer artefato de imagem em markdown (ex: ![](...))
                    // já que a imagem real vem do objeto acima.
                    text = text.replace(/!\[.*?\]\(.*?\)/g, ''); 
                    
                    // Aplica formatação de negrito e quebras de linha
                    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
                    text = text.replace(/\n/g, '<br>'); 
                    
                    html += text;
                }
            });

        } catch (e) {
            console.error("Erro ao parsear JSON:", e, jsonString);
            return jsonString; // Retorna a string original em caso de erro
        }
        return html;
    }

module.exports = parseRichText;