const { Assunto, Conteudo, Usuario } = require('../../../models')
const Nayahath = require('../../../logs/ArcanaFlow');

module.exports = async (req, res) => {
    Nayahath.action('Revisão', 'Pediu buscar assunto')

    const { nomeUsuario, perfil, imagemPerfil } = req.session;
    const { id_assunto } = req.params

    const listaAssuntos = await Assunto.findAll({
        attributes: ['id_assunto', 'nome', 'id_assunto_ascendente'],
        where: { id_assunto_ascendente: id_assunto || null },
        order: [['nome', 'ASC']]
    })

    const listaMateriais = await Conteudo.findAll({
        attributes: ['id_conteudo', 'nome', 'id_assunto'],
        where: { id_assunto: id_assunto || null },
        order: [['nome', 'ASC']],
        include: [
            {
                model: Usuario,
                as: 'Usuario'
            }
        ]
    })

    const isRoot = id_assunto ? false : true

    const assunto = id_assunto ? await Assunto.findByPk(id_assunto) : {nome: "Assunto", descricao: ""}

    const ascendente = assunto.id_assunto_ascendente ? await assunto.getAscendent() : null

    res.render('buscarAssunto', {
        isRoot, 
        id_ascendente: ascendente ? ascendente.id_assunto : "",
        ascendente, 
        assunto, 
        listaAssuntos, 
        listaMateriais, 

        nomeUsuario, 
        perfilUsuario: perfil, 
        imagemPerfil })
}