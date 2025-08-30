import Nayahath from '../../../logs/ArcanaFlow.js';

export default async (req, res) =>{
            /*
            Objetivo: Retornar uma página de busca de todos os materiais de um tópico específico
            Recebe: id_topico do tópico correspondente
            Retorna: Página de busca de materiais com a lista de todos os materiais para renderizar
            */
            /*
            ! Fluxo esperado
            * Recebe a requisição e pega dados de login para exibição
            * Pega o nome do tópico escolhido
            * Pega o título, id, autor e data de todos os materiais associados a um tópico
            * Renderiza todos os materiais como botões com titulo, autor e data, usando o id do material para servir de link
            */
            Nayahath.action('Revisão', 'Pediu buscar material')

            res.locals.currentPage = "revisao"
            
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;

            // ! Temporário
            res.render('moduloRevisao/error', { nomeUsuario, perfilUsuario, imagemPerfil })
        }