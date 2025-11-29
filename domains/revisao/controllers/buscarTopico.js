const { Area, Topico } = require('../../../models');
const Nayahath = require('../../../logs/ArcanaFlow');

module.exports = async (req, res) =>{
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

            res.render('buscarTopico', { area:areaAtual, listaTopicos })
        }