const Nayahath = require('../../../logs/ArcanaFlow')
const { Assunto, PalavraChave } = require('../../../models')

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
        // const topicos = await Topico.findAll();
        // const Areas = await Area.findAll({
        //     include: [{
        //         model: Topico,
        //         as: 'Topico'
        //     }]
        // });

        const Assuntos = await Assunto.findAll()
        const palavras = await PalavraChave.findAll({
            attributes: ['palavrachave']
        })
        const palavrasChave = palavras.map(palavra => palavra.palavrachave); // Extrai o campo 'palavrachave' de cada objeto

        res.render('criarMaterial', {
            nomeUsuario,
            perfilUsuario: perfil,
            imagemPerfil,
            // topicos,
            // Areas,
            Assuntos,
            palavrasChave
        })
    } catch (error) {
        console.error(error)
        res.redirect('/usuario/inicioLogado');
    }

}
