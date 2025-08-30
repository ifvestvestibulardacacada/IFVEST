import Nayahath from '../../../logs/ArcanaFlow.js';

export default async (req, res) =>{
            /*
            Objetivo: Retornar a página com o editor markdown para a edição de um material existente
            Recebe: Dados do usuário que enviou a requisição e o ID do material
            Retorna: Página 
            */
            /*
            ! Fluxo esperado
            * Recebe a requisição e pega dados de login para exibição
            * Se o login condizer com um usuário que tem permissão de editar ESTE ESPECIFICO MATERIAL, prossegue
            * Renderiza um editor de materiais com o conteúdo do material preenchendo os campos do editor
            */
            Nayahath.action('Revisão', 'Pediu editar material')

            res.locals.currentPage = "revisao"
            
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;

            // ! Temporário
            res.render('moduloRevisao/error', { nomeUsuario, perfilUsuario, imagemPerfil })
        }