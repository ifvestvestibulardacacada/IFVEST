const Nayahath = require('../../../logs/ArcanaFlow')
const { Conteudo, Assunto, PalavraChave } = require('../../../models')
const MarkdownSolver = require('../utils/MarkdownSolver');
const buildTree = require('../utils/buildTree')
module.exports = async (req, res) => {

    const id_conteudo = req.params.id_conteudo;

    Nayahath.action('Revisão', 'Pediu editar material')

    res.locals.currentPage = "revisao"

   
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

        // Transform PalavraChave to array of strings
        plainMaterial.PalavraChave = plainMaterial.PalavraChave.map(keyword => keyword.palavrachave); // Extract 'PalavraChave' field

        plainMaterial.assunto = assunto;
        
        const { markdown, references } = MarkdownSolver.breakMarkdown(plainMaterial.conteudo_markdown);
        plainMaterial.conteudo_markdown =  markdown;


        // ! Temporário
        res.render('editor', {  
  Assuntos: buildTree(Assuntos), 
            Material: plainMaterial, 
            MaterialExterno: references,
            assunto,
            jsPath, 
            cssPaths });

    } catch (error) {
        console.error(error)
        res.redirect(req.get("Referrer") || "/");
    }


}