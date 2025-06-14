const { Usuario } = require('../models');
const { Session } = require('../models/Session');
const { sequelize } = require('../models/index');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const store = new SequelizeStore({ db: sequelize, tableName: "sessions", model: Session })
const bcrypt = require('bcrypt');

class Auth{
    static async login(req, res){
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
            req.session.userId = usuarioEncontrado.id_usuario;
            req.session.perfil = usuarioEncontrado.tipo_perfil;
            req.session.nomeUsuario = usuarioEncontrado.usuario;
            req.session.imagemPerfil = usuarioEncontrado.imagem_perfil;
            

            await new Promise((resolve, reject) => {
                req.session.save(err => {
                    if(err) reject(err);
                    else resolve();
                });
            });
    
            return res.redirect('/usuario/inicioLogado');
        } catch (err) {
            console.error(err)
            req.session.errorMessage = err.message;
            return res.redirect('/login');
        }
    }
static async logout(req, res){
    try {
        const sessionID = req.sessionID;
        
        if (!sessionID) {
            return res.redirect('/usuario/login');
        }

        // Limpar o cookie antes de destruir a sessão
        res.clearCookie("connect.sid", { path: '/' });  // Certifique-se de passar o caminho correto, se necessário

        // Destruir a sessão
        req.session.destroy((err) => {
            if (err) {
                console.error("Erro ao destruir a sessão:", err.message);
                return res.status(500).send("Erro ao destruir a sessão");
            }
            // Destruir a sessão no store (se necessário)
            store.destroy(sessionID);

            res.redirect('/usuario/login');
        });

    } catch (error) {
        console.error("Erro no logout:", error.message);
        res.status(500).send("Erro interno");
    }
}

    static async cadastro(req, res){
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
}

exports.Auth = Auth