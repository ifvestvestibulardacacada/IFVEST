document.addEventListener('DOMContentLoaded', () => {
    const listaPlacares = document.getElementById('lista-placares');

    async function buscarPlacares() {
        try {
            const response = await fetch('/quiz/api/placar');
            if (!response.ok) {
                listaPlacares.innerHTML = '<li>Erro ao carregar placares. Tente novamente.</li>';
                return;
            }

            const placares = await response.json();

            listaPlacares.innerHTML = '';

            if (placares.length === 0) {
                listaPlacares.innerHTML = '<li>Nenhum placar salvo ainda. Seja o primeiro!</li>';
                return;
            }

            placares.forEach((placar, index) => {
                const itemLista = document.createElement('li');
                
                const dataJogo = new Date(placar.createdAt).toLocaleDateString('pt-BR');
                itemLista.innerHTML = `
                    <span class="ranking">#${index + 1}</span>
                    <div class="info-placar">
                        <strong>${placar.nome || 'Jogador Anônimo'}</strong>
                        <small>Em: ${dataJogo}</small>
                    </div>
                    <span class="pontuacao">${placar.acertos} / ${placar.totalQuestoes} (${placar.porcentagem}%)</span>
                `;

                listaPlacares.appendChild(itemLista);
            });

        } catch (error) {
            console.error('Erro ao buscar placares:', error);
            listaPlacares.innerHTML = '<li>Erro de conexão ao carregar placares.</li>';
        }
    }

    buscarPlacares();
});