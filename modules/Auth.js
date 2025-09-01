const { Usuario } = require('../models');
const { store } = require('../utils/sessionConfig');
const bcrypt = require('bcrypt');


class Auth {
    static async login(req, res) {
          const { usuario, senha } = req.body;

        try {
            if (!usuario || !senha) {
                throw new Error("Usuario ou Senha invalidos");
            }

            const usuarioEncontrado = await Usuario.findOne({
                where: { usuario: usuario }
            });

            if (!usuarioEncontrado) {
                // ArcanaFlow.error('Auth.login', 'Usuario nao encontrado');
                throw new Error("Usuario ou Senha invalidos");
            }

            const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

            if (!senhaCorreta) {
                // ArcanaFlow.error('Auth.login', `Usuario ou senha invalidos`);
                throw new Error("Usuario ou Senha invalidos");
            }


            req.session.login = true;
            req.session.userId = usuarioEncontrado.id_usuario;
            req.session.perfil = usuarioEncontrado.tipo_perfil;
            req.session.nomeUsuario = usuarioEncontrado.usuario;
            req.session.imagemPerfil = usuarioEncontrado.imagem_perfil;


            await new Promise((resolve, reject) => {
                req.session.save(err => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            return res.redirect('/usuario/inicioLogado');
        } catch (error) {
            
            req.session.errorMessage = error.message;
            await new Promise((resolve, reject) => {
                req.session.save(err => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            return res.redirect(req.get("Referrer") || "/");
        }
    }

    static async logout(req, res) {
        if (!req.session || !req.session.userId || !req.sessionID) {
            console.log('Nenhuma sessão válida encontrada para logout');
            res.clearCookie('connect.sid', { path: '/' });
            return res.redirect('/login');
        }

        const userId = req.session.userId.toString();
        const sessionID = req.sessionID;
        

        try {
            // Deletar a sessão atual
            const deleted = await store.sessionModel.destroy({ where: { sid: sessionID } });
            console.log(`Sessão atual deletada: sid=${sessionID}, userId=${userId}, linhas =${deleted}`);

            // Destruir a sessão no servidor
            await new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) {
                        console.error('Erro ao destruir sessão:', err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            res.clearCookie('connect.sid', { path: '/' });
            console.log('Sessão destruída e cookie limpo');
            res.redirect('/login');
        } catch (err) {
            console.error('Erro ao processar logout:', err.message);
            req.session.errorMessage = err.message;
            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) {
                        console.error('Erro ao salvar sessão de erro:', err.message);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            return res.status(400).redirect('/login');
        }
    }
    static async cadastro(req, res) {
        const { nome, usuario, senha, email, perfil } = req.body;


        if (!nome || !usuario || !senha || !email || !perfil) {
            throw new Error("Dados Invalidos ou Incompletos")
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        try {
            await Usuario.create({ nome, usuario, senha: senhaCriptografada, email, tipo_perfil: perfil });

            res.status(201).redirect('/login');
        } catch (error) {
            console.error(error);
            req.session.errorMessage = error.message;
            await new Promise((resolve, reject) => {
                req.session.save(err => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            return res.redirect(req.get("Referrer") || "/");
        }
    }
}

exports.Auth = Auth;
