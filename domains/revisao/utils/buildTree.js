module.exports = function buildTree(list, parentId = null) {
    const tree = [];
    const childrenOf = {};

    // Mapeia todos os itens pelo seu ID
    list.forEach(item => {
        item.children = []; // Adiciona a propriedade children
        childrenOf[item.id_assunto] = childrenOf[item.id_assunto] || [];
        childrenOf[item.id_assunto].push(item);
    });

    list.forEach(item => {
        if (item.id_assunto_ascendente) {
            // Se tem um pai, encontra o pai no mapa e adiciona este item como filho
            const parent = list.find(p => p.id_assunto === item.id_assunto_ascendente);
            if (parent) {
                parent.children.push(item);
            }
        } else {
            // Se não tem pai (raiz), adiciona ao nível superior da árvore
            tree.push(item);
        }
    });

    // Filtra para retornar apenas os nós raiz (aqueles sem ascendente)
    return list.filter(item => item.id_assunto_ascendente === null);
}