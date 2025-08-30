import Area from '../../../models/Area.js';
import Topico from '../../../models/Topico.js';
import Nayahath from '../../../logs/ArcanaFlow.js';

export default async (req, res) =>{
            /*
            Objetivo: Retornar a página de busca de área
            Recebe: Nada
            Retorna: Página da busca de áreas com a lista de áreas para renderizar
            */
            /*
            ! Fluxo esperado
            * Recebe a requisição e pega dados de login para exibição
            * Pega o nome e ID de todas as áreas
            * Renderiza todas as áreas como botões com nome e link usando o id da área
            */
            Nayahath.action('Revisão', 'Pediu buscar area')

            res.locals.currentPage = "revisao"
            
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;

            const listaAreas = await Area.findAll({
                attributes: ['id_area', 'nome'],
                order: [['nome', 'ASC']]
            })
            res.render('moduloRevisao/buscarArea', { listaAreas, nomeUsuario, perfilUsuario, imagemPerfil })
        }