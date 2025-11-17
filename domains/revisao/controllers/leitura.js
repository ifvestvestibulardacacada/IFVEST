const { Conteudo, Assunto } = require('../../../models')
const MarkdownSolver = require('../utils/MarkdownSolver')

module.exports = async (req, res) => {
 

    const { id_conteudo } = req.params

    let autor = false;
    
    const conteudo = await Conteudo.findByPk(id_conteudo, {
        include: [{
            model: Assunto,
            as: "Assunto"
        }]
    }) || null

    console.log(`Perfil do usuario: ${perfil}`)
    
    if (perfil !== "ALUNO"){
        let usuarioAtual = await Usuario.findOne({
            where: {
                usuario: nomeUsuario
            }
        })
        console.log(`usuario atual: ${usuarioAtual.id_usuario} | conteudo: ${conteudo.id_usuario}`)
        autor = usuarioAtual.id_usuario == conteudo.id_usuario
    }
    
    // Pré-processa as referências no markdown
    let contentWithReferences = MarkdownSolver.processReferences(conteudo.conteudo_markdown)

    const conteudo_markdown = MarkdownSolver.Render(contentWithReferences)
    // const conteudo_markdown = conteudo.conteudo_markdown

    // console.log(conteudo.conteudo_markdown)
    // console.dir(conteudo_markdown)
    console.log(autor)
    res.render('leitura', {
        conteudo,
        conteudo_markdown,

        autor: autor,
    })
}