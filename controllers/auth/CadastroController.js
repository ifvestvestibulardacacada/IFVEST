const { Usuario } = require('../../models');
const bcrypt = require('bcrypt');

exports.CadastroController = async (req, res) => {
    const { nome, usuario, senha, email, perfil } = req.body;
    try {
        if (!nome || !usuario || !senha || !email || !perfil) {
            console.log(nome, usuario, senha, email, perfil)
            throw new Error("Dados Invalidos ou Incompletos")
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10); // O segundo argumento é o número de "salt rounds"

        await Usuario.create({ nome, usuario, senha: senhaCriptografada, email, perfil });

        res.status(201).redirect('/login');
    } catch (err) {
        console.error(err)
        req.session.errorMessage = err.message;
        res.status(201).redirect('/cadastro');
    }

}