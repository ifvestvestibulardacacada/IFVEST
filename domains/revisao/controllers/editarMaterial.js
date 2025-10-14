const Nayahath = require('../../../logs/ArcanaFlow')
const { Conteudo, Assunto, PalavraChave } = require('../../../models')
const MarkdownSolver = require('../utils/MarkdownSolver');

module.exports = async (req, res) => {

    const id_conteudo = req.params.id_conteudo;

    Nayahath.action('Revisão', 'Pediu editar material')

    res.locals.currentPage = "revisao"

    const perfilUsuario = req.session.perfil;
    const nomeUsuario = req.session.nomeUsuario;
    const imagemPerfil = req.session.imagemPerfil;
    try {
        const Assuntos = await Assunto.findAll()

        const { jsPath, cssPaths } = MarkdownSolver.getViteAssets();

        const Material = await Conteudo.findByPk(id_conteudo, {
            include: [
            {
                model: PalavraChave,
                as: 'PalavraChave',
                through: { attributes: [] }
            }]


        });
        if (!Material) {
            return res.status(404).send('Material not found');
        }
        const assunto = await Assunto.findByPk(Material.id_assunto);


        // Convert to plain object
        const plainMaterial = Material.get({ plain: true });

        const DELIMITER = '---REFERENCES---';

        const parts = plainMaterial.conteudo_markdown.split(DELIMITER);
        plainMaterial.conteudo_markdown = parts[0]?.trim() || '';
        plainMaterial.referencias = parts[1]?.trim() || '';

        plainMaterial.PalavraChave = plainMaterial.PalavraChave.map(keyword => keyword.palavrachave); // Extract 'PalavraChave' field

        plainMaterial.assunto = assunto;


        // ! Temporário
        res.render('editarMaterial', { nomeUsuario, perfilUsuario, imagemPerfil, Assuntos, Material: plainMaterial, jsPath, cssPaths });

    } catch (error) {
        console.error(error)
        res.redirect(req.get("Referrer") || "/");
    }


}