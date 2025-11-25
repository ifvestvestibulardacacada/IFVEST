const { Area, Assunto, Topico } = require('../../../models');

// Áreas
async function listarAreasJSON(req, res) {
    // FORÇA JSON SEMPRE, SÓ PRA TESTAR
    const areas = await Area.findAll({ order: [['id_area', 'ASC']] });
    return res.json(areas);
}
async function listarAreas(req, res) {

   
        const areas = await Area.findAll({ order: [['id_area', 'ASC']] });

 

    return res.render('areas/index', { areas });
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
   
    const assuntos = await Assunto.findAll({ order: [['id_assunto', 'ASC']] });
    return res.render('assuntos/index', { assuntos});
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

    const topicos = await Topico.findAll({ order: [['id_topico', 'ASC']] });
    console.log(topicos)
    return res.render('topicos/index', { topicos });
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
        return res.status(200).json(topics);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

async function criarTopico(req, res) {
    const { nome, id_area } = req.body;
    let id_usuario = req.body.id_usuario;
    // Supondo que o ID do usuário esteja na sessão
    if (!id_usuario) {
        id_usuario = req.session.userId;
    }

    const topico = await Topico.create({ nome, id_area, id_usuario });

    const referer = req.get('Referer') || req.get('Origin') || '';
    const host = req.get('host');

    const refererUrl = referer.replace(/^https?:\/\//, '').replace(host, '').split('?')[0];

    if (refererUrl.includes('/professor/registrar-questao')) {
        return res.status(201).json(topico);
    }

    return res.redirect('/shared/topicos')

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
    listarAreasJSON,
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


