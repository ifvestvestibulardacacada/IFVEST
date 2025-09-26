const { Area, Assunto, Topico } = require('../../../models');

// Áreas
async function listarAreas(req, res) {
    const { perfil, nomeUsuario, imagemPerfil} = req.session;
    const areas = await Area.findAll({ order: [['id_area','ASC']] });
    return res.render('areas/index', { areas, nomeUsuario, perfilUsuario: perfil, imagemPerfil });
}

async function criarArea(req, res) {
    const { nome, descricao } = req.body;
    await Area.create({ nome, descricao });
    return res.redirect('/shared/areas');
}

async function editarArea(req, res) {
    const { id_area } = req.params;
    const { nome, descricao } = req.body;
    await Area.update({ nome, descricao }, { where: { id_area } });
    return res.redirect('/shared/areas');
}

async function excluirArea(req, res) {
    const { id_area } = req.params;
    await Area.destroy({ where: { id_area } });
    return res.redirect('/shared/areas');
}

// Assuntos
async function listarAssuntos(req, res) {
    const { perfil, nomeUsuario, imagemPerfil} = req.session;
    const assuntos = await Assunto.findAll({ order: [['id_assunto','ASC']] });
    return res.render('assuntos/index', { assuntos, nomeUsuario, perfilUsuario: perfil, imagemPerfil });
}

async function criarAssunto(req, res) {
    const { nome, descricao, id_assunto_ascendente } = req.body;
    await Assunto.create({ nome, descricao, id_assunto_ascendente: id_assunto_ascendente || null });
    return res.redirect('/shared/assuntos');
}

async function editarAssunto(req, res) {
    const { id_assunto } = req.params;
    const { nome, descricao, id_assunto_ascendente } = req.body;
    await Assunto.update({ nome, descricao, id_assunto_ascendente: id_assunto_ascendente || null }, { where: { id_assunto } });
    return res.redirect('/shared/assuntos');
}

async function excluirAssunto(req, res) {
    const { id_assunto } = req.params;
    await Assunto.destroy({ where: { id_assunto } });
    return res.redirect('/shared/assuntos');
}

// Tópicos
 async function listarTopicos(req, res) {
     const { perfil, nomeUsuario, imagemPerfil} = req.session;
     const topicos = await Topico.findAll({ order: [['id_topico','ASC']] });
     console.log(topicos)
     return res.render('topicos/index', { topicos, nomeUsuario, perfilUsuario: perfil, imagemPerfil });
 }

// JSON consultas
async function consultarTopicos(req, res) {
    console.log("Consultando tópicos") // ! Log temporário
    console.log(req.params);
    const { id_area } = req.params;

    try {
        const where = {};
        if (id_area) {
            where.id_area = id_area;
        }
        
        const topics = await Topico.findAll({
            attributes: ['id_topico', 'nome'],
            where: where,
            order: [['nome', 'ASC']]
        });
        console.log(topics)
        res.status(200).json(topics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

async function criarTopico(req, res) {
    const { nome, id_area, id_usuario } = req.body;
    await Topico.create({ nome, id_area, id_usuario });
    return res.redirect('/shared/topicos');
}

async function editarTopico(req, res) {
    const { id_topico } = req.params;
    const { nome, id_area, id_usuario } = req.body;
    await Topico.update({ nome, id_area, id_usuario }, { where: { id_topico } });
    return res.redirect('/shared/topicos');
}

async function excluirTopico(req, res) {
    const { id_topico } = req.params;
    await Topico.destroy({ where: { id_topico } });
    return res.redirect('/shared/topicos');
}

module.exports = {
    listarAreas,
    criarArea,
    editarArea,
    excluirArea,
    listarAssuntos,
    criarAssunto,
    editarAssunto,
    excluirAssunto,
    listarTopicos,
    criarTopico,
    editarTopico,
     excluirTopico,
     consultarTopicos,
}


