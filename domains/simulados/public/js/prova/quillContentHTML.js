document.addEventListener('DOMContentLoaded', function () {
    const deltaElements = document.querySelectorAll('[data-delta]');

    deltaElements.forEach(function (element) {
        try {
            const deltaString = element.getAttribute('data-delta');
            
            // Verifica se existe delta
            if (!deltaString || deltaString === 'null' || deltaString === '') {
                element.innerHTML = '';
                return;
            }

            const delta = JSON.parse(deltaString);
            
            // Cria container temporário para renderizar Quill
            const tempDiv = document.createElement('div');
            tempDiv.style.visibility = 'hidden';
            tempDiv.style.position = 'absolute';
            document.body.appendChild(tempDiv);
            
            const tempQuill = new Quill(tempDiv, { 
                modules: { toolbar: false },
                theme: 'snow'
            });
            
            tempQuill.setContents(delta);
            
            // Pega o HTML renderizado
            const htmlContent = tempQuill.root.innerHTML;
            
            // Remove o container temporário
            document.body.removeChild(tempDiv);
            
            // Remove span "required" se existir
            const requiredSpan = element.querySelector('.required');
            if (requiredSpan) {
                requiredSpan.remove();
            }
            
            // Substitui conteúdo
            element.innerHTML = htmlContent;
            
            // Processa imagens para melhorar renderização no PDF
            const images = element.querySelectorAll('img');
            images.forEach(img => {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.display = 'block';
                img.style.margin = '5mm auto';
                
                // Adiciona crossorigin para evitar problemas com CORS
                img.setAttribute('crossorigin', 'anonymous');
            });
            
        } catch (error) {
            console.error('Erro ao processar conteúdo Quill:', error);
            console.error('Elemento:', element);
            console.error('Delta:', element.getAttribute('data-delta'));
            
            // Em caso de erro, tenta mostrar texto plano
            try {
                const delta = JSON.parse(element.getAttribute('data-delta'));
                const tempDiv = document.createElement('div');
                const tempQuill = new Quill(tempDiv, { modules: { toolbar: false } });
                tempQuill.setContents(delta);
                element.textContent = tempQuill.getText();
            } catch (fallbackError) {
                element.textContent = '[Erro ao carregar conteúdo]';
            }
        }
    });
    
    console.log(`✓ ${deltaElements.length} elementos Quill processados`);
});