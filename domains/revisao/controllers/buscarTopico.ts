import Area from '../../../models/Area.js';
import Topico from '../../../models/Topico.js';
import Nayahath from '../../../logs/ArcanaFlow.js';

export default async (req, res) =>{
            /*
            Objetivo: Retornar uma página de busca de todos os tópicos de uma área específica
            Recebe: id_area da área correspondente
            Retorna: Página de busca de tópicos com a lista de todos os tópicos para renderizar
            */
            /*
            ! Fluxo esperado
            * Recebe a requisição e pega dados de login para exibição
            * Pega o nome e descrição da área escolhida
            * Pega o nome e ID de todos os tópicos pertencentes a área escolhida
            * Renderiza todos os tópicos como botões com nome e link usando o id do tópico, exibindo uma espécie de página representando a área em si, com título da área e subtítulo como descrição
            */
            Nayahath.action('Revisão', 'Pediu buscar topico')

            res.locals.currentPage = "revisao"
            
            const perfilUsuario = req.session.perfil;
            const nomeUsuario = req.session.nomeUsuario;
            const imagemPerfil = req.session.imagemPerfil;

            const { id_area } = req.params;

            const areaAtual = await Area.findByPk(id_area, {
                attributes: ['id_area', 'nome', 'descricao'],
                include: {
                    attributes: ['id_topico', 'nome'],
                    model: Topico,
                    as: 'Topico'
                }
            })

            const listaTopicos = areaAtual.Topico

            res.render('moduloRevisao/buscarTopico', { area:areaAtual, listaTopicos, nomeUsuario, perfilUsuario, imagemPerfil })
        }