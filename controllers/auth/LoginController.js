const { Usuario } = require('../../models');
const bcrypt = require('bcrypt');

exports.LoginController = async (req, res) => {
    const {usuario, senha} =  req.body;

    try {
        if (!usuario || !senha) {
            throw new Error("Usuario ou Senha invalidos");
        }

        const usuarioEncontrado = await Usuario.findOne({
            where: { usuario: usuario }
        });

        if (!usuarioEncontrado) {
            throw new Error("Usuario ou Senha invalidos");
        }

        const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (!senhaCorreta) {
            throw new Error("Usuario ou Senha invalidos");
        }

        req.session.login = true;
        req.session.userId = usuarioEncontrado.id;
        req.session.perfil = usuarioEncontrado.perfil;
        req.session.nomeUsuario = usuarioEncontrado.usuario;
        req.session.imagemPerfil = usuarioEncontrado.imagemPerfil;

        req.session.save(); 

        return res.redirect('/usuario/inicioLogado');
    } catch (err) {
        console.error(err)
        req.session.errorMessage = err.message;
        return res.redirect('/login');
    }
}