const Nayahath = require('../../../logs/ArcanaFlow')

module.exports = async (req, res) => {
    /*
    Objetivo: Página inicial para acessar os recursos do módulo de revisão
    Recebe: Nada
    Retorna: Página inicial do módulo com nome, perfil e imagem de perfil do usuario
    */
    /*
    ! Fluxo esperado
    * Recebe a requisição e pega dados de login para exibição
    * Retorna status 200 e renderiza a página inicial passando os dados de login
    */
    Nayahath.action('Revisão', 'Pediu homepage')

    res.locals.currentPage = "revisao"

    

    // ! Temporário
    // res.redirect('/revisao/busca')
    res.render('home', {

    })
}