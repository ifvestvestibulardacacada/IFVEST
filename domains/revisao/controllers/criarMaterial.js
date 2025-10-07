const Nayahath = require('../../../logs/ArcanaFlow')
const { Assunto, PalavraChave } = require('../../../models')
const MarkdownSolver = require('../utils/MarkdownSolver')


module.exports = async (req, res) => {
    /*
    Objetivo: Retornar a página com o editor markdown para a criação de um novo material
    Recebe: Dados do usuario que enviou a requisição
    Retorna: Editor de material vazio
    */
    /*
    ! Fluxo esperado
    * Recebe a requisição e pega dados de login para exibição
    * Se o login condizer com um usuário que tem permissão de criar materiais de revisão, prossegue
    * Renderiza um editor de materiais vazio
    */
    Nayahath.action('Revisão', 'Pediu criar material')

    res.locals.currentPage = "revisao"

    

    const { perfil, nomeUsuario, imagemPerfil } = req.session

    try {

        const { jsPath, cssPaths } = MarkdownSolver.getViteAssets();

        const Assuntos = await Assunto.findAll()
        const palavras = await PalavraChave.findAll({
            attributes: ['palavrachave']
        })
        const palavrasChave = palavras.map(palavra => palavra.palavrachave); // Extrai o campo 'palavrachave' de cada objeto

        res.render('criarMaterial', {
            nomeUsuario,
            perfilUsuario: perfil,
            imagemPerfil,
            jsPath, cssPaths,
            Assuntos,
            palavrasChave
        })
    } catch (error) {
        console.error(error)
        res.redirect('/usuario/inicioLogado');
    }

}
