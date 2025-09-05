const { Assunto, Conteudo } = require('../../../models')
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
        order: [['nome', 'ASC']]
    })


    const assunto = id_assunto ? await Assunto.findByPk(id_assunto) : {nome: "Assunto", descricao: ""}
    // const assunto = await Assunto.findByPk(id_assunto)

    console.dir(listaAssuntos)

    res.render('buscarAssunto', { assunto, listaAssuntos, listaMateriais, nomeUsuario, perfilUsuario: perfil, imagemPerfil })
    // res.send("fala galera")
}