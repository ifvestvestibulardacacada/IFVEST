const { Conteudo, Assunto } = require('../../../models')
const MarkdownSolver = require('../utils/MarkdownSolver')

module.exports = async (req, res) => {
    const { nomeUsuario, perfil, imagemPerfil } = req.session;

    const { id_conteudo } = req.params

    const conteudo = await Conteudo.findByPk(id_conteudo, {
        include: [{
            model: Assunto,
            as: "Assunto"
        }]
    }) || null

    const markdown = conteudo.conteudo_markdown.replace('---REFERENCES---', '## Referências e Links ').trim();
    const conteudo_markdown = MarkdownSolver.Render(markdown)

    

    // const conteudo_markdown = conteudo.conteudo_markdown

    // console.log(conteudo.conteudo_markdown)
    // console.dir(conteudo_markdown)

    res.render('leitura', {
        conteudo,
        conteudo_markdown,
        nomeUsuario,
        perfilUsuario: perfil,
        imagemPerfil
    })
}