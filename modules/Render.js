
const { Area, Simulado, Topico, Questao, Opcao, Usuario, Resposta, Conteudo, TagConteudo, PalavraChave } = require('../models');
const { Op, where } = require('sequelize');

const Nayahath = require('../logs/ArcanaFlow');
const { ca } = require('zod/v4/locales');

class Render {
    static auth = {
        cadastro: async (req, res) => {
            let errorMessage = req.session.errorMessage;
            console.log(errorMessage);
            if (errorMessage === null) {
                errorMessage = " ";
            }
            req.session.errorMessage = null;
            res.status(200).render('usuario/cadastro', { errorMessage, layout: false });
        },
        home: async (req, res) => {
            res.status(200).render('usuario/inicio', { layout: false } );
        },
        login: async (req, res) => {
            let errorMessage = req.session.errorMessage;
            console.log(errorMessage);
            if (errorMessage === null) {
                errorMessage = " ";
            }
            req.session.errorMessage = null; // Limpa a mensagem de erro após exibi-la
            res.status(200).render('usuario/login', { errorMessage, layout: false  });
        }
    }

    static usuarios = {
        editarUsuario: async (req, res) => {
            try {
                let errorMessage = req.session.errorMessage;


                if (!req.session.userId) {
                    return res.status(300).send("Você precisa estar logado para acessar esta página.");
                }
                const usuario = await Usuario.findByPk(req.session.userId);

                if (!usuario) {
                    return res.status(400).send("Erro ao buscar usuario");
                }


                if (errorMessage === null) {
                    errorMessage = " ";
                }

                req.session.errorMessage = null;
                res.render('usuario/editar_usuario', { usuario, errorMessage  });
            } catch (err) {
                console.error(err)
                res.redirect('/login');
            }
        },
        inicioLogado: async (req, res) => {
            res.locals.currentPage = "inicio"

            const id = req.session.userId;

            // console.log(id)
            try {
                const usuario = await Usuario.findByPk(id);
                // console.log(usuario)

                if (!usuario) {
                    return res.status(400).send("Erro ao buscar usuario ");
                }
                res.status(200).render('usuario/inicio_logado', );
            } catch (err) {
                console.error(err)
                req.session.destroy();
                res.redirect('/login');
            }
        },
        perfilUsuario: async (req, res) => {
            res.locals.currentPage = "perfil"

            const id = req.session.userId;
            try {
                const usuario = await Usuario.findByPk(id);

                if (!usuario) {
                    return res.status(400).send("Erro ao buscar usuario");
                }
                res.status(200).render('usuario/perfil_usuario', { usuario,});
            } catch (err) {
                console.error(err)
                res.redirect('/perfil');
            }
        },
        sobreNos: async (req, res) => {
            res.locals.currentPage = "sobreNos"

            res.status(200).render('desenvolvedores/sobre_nos', );
        }
    }


}

exports.Render = Render;

// Render.auth.cadastro(req, res)

