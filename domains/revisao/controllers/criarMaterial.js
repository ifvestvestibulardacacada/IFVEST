const Nayahath = require('../../../logs/ArcanaFlow')

module.exports = async (req, res) =>{
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
            
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;

            // ! Temporário
            res.render('error', { nomeUsuario, perfilUsuario, imagemPerfil })
        }