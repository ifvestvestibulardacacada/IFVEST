const { Assunto, Conteudo, Usuario, TagConteudo, Sequelize, PalavraChave } = require('../../../models')
const Nayahath = require('../../../logs/ArcanaFlow');

module.exports = async (req, res) => {
    Nayahath.action('Revisão', 'Pediu buscar assunto')

    const { nomeUsuario, perfil, imagemPerfil } = req.session;
    const { id_assunto } = req.params
    try{

    const listaAssuntos = await Assunto.findAll({
        attributes: ['id_assunto', 'nome', 'id_assunto_ascendente'],
        where: { id_assunto_ascendente: id_assunto || null },
        order: [['nome', 'ASC']]
    })


    const listaMateriais = await Conteudo.findAll({
        attributes: ['id_conteudo', 'nome', 'id_assunto'],
        where: id_assunto ? { id_assunto } : { id_assunto: { [Sequelize.Op.is]: null } },
        order: [['nome', 'ASC']],
        include: [
            {
                model: Usuario,
                as: 'Usuario',
                required: false
            },
            {
                model: PalavraChave,
                as: 'PalavraChave',
                attributes: ['palavrachave'], 
                through: { attributes: [] },
                required: false
            }
        ]
    });

    const listaDeTags = [...new Set(
        listaMateriais.flatMap(conteudo =>
            conteudo.PalavraChave ? conteudo.PalavraChave.map(keyword => keyword.palavrachave.toLowerCase()).filter(palavra => palavra) : []
        )
    )].sort();

    listaMateriais.forEach(conteudo => {
        conteudo.keywords = conteudo.PalavraChave ? conteudo.PalavraChave.map(keyword => keyword.palavrachave.toLowerCase()).filter(palavra => palavra).join(',') : '';
    });


    const isRoot = id_assunto ? false : true

    const assunto = id_assunto ? await Assunto.findByPk(id_assunto) : { nome: "Assunto", descricao: "" }

    const ascendente = assunto.id_assunto_ascendente ? await assunto.getAscendent() : null

    res.render('buscarAssunto', {
        isRoot,
        id_ascendente: ascendente ? ascendente.id_assunto : "",
        ascendente,
        assunto,
        listaAssuntos,
        listaMateriais,
        listaDeTags,
        nomeUsuario,
        perfilUsuario: perfil,
        imagemPerfil
    })
       } catch (error) {
        console.error('Error in buscarAssunto:', error);
        res.status(500).render('error', { message: 'Erro ao carregar a página de busca por assunto.' });
    }
}