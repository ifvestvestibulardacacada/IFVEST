const Nayahath = require('../../../logs/ArcanaFlow')
const { Conteudo, Assunto, PalavraChave } = require('../../../models')

module.exports = async (req, res) => {

    const id_conteudo = req.params.id_conteudo;

    Nayahath.action('Revisão', 'Pediu editar material')

    res.locals.currentPage = "revisao"

    const perfilUsuario = req.session.perfil;
    const nomeUsuario = req.session.nomeUsuario;
    const imagemPerfil = req.session.imagemPerfil;
    try {
        const Assuntos = await Assunto.findAll()

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

        // Transform PalavraChave to array of strings
        plainMaterial.PalavraChave = plainMaterial.PalavraChave.map(keyword => keyword.palavrachave); // Extract 'PalavraChave' field

        plainMaterial.assunto = assunto;


        // ! Temporário
        res.render('editarMaterial', { nomeUsuario, perfilUsuario, imagemPerfil, Assuntos, Material: plainMaterial, assunto });

    } catch (error) {
        console.error(error)
        res.redirect(req.get("Referrer") || "/");
    }


}