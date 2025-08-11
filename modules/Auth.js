const { Usuario } = require('../models');
const { store } = require('../utils/sessionConfig');
const bcrypt = require('bcrypt');


class Auth {
    static async login(req, res) {
        const { usuario, senha } = req.body;

        try {
            if (!usuario || !senha) {
                throw new Error('Usuário ou senha inválidos');
            }

            const usuarioEncontrado = await Usuario.findOne({
                where: { usuario },
            });

            if (!usuarioEncontrado) {
                throw new Error('Usuário ou senha inválidos');
            }

            const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

            if (!senhaCorreta) {
                throw new Error('Usuário ou senha inválidos');
            }

            const userId = usuarioEncontrado.id_usuario.toString(); // Normaliza para string
            console.log(`Iniciando login para userId: ${userId}`);

            // Verificar se já existe uma sessão ativa (opcional, para bloquear logins simultâneos)
            // let activeSessionExists = false;
            // try {
            //     const sessions = await store.sessionModel.findAll();
            //     console.log(`Total de sessões encontradas: ${sessions.length}`);

            //     for (const session of sessions) {
            //         try {
            //             const sessionData = JSON.parse(session.data);
            //             if (sessionData.userId && sessionData.userId.toString() === userId) {
            //                 activeSessionExists = true;
            //                 break;
            //             }
            //         } catch (err) {
            //             console.error(`Erro ao parsear sessão ${session.sid}:`, err.message);
            //         }
            //     }
            // } catch (err) {
            //     console.error('Erro ao verificar sessões existentes:', err.message);
            // }

            // // Opcional: Bloquear login se houver sessão ativa
            // if (activeSessionExists) {
            //     req.session.errorMessage = 'Já existe uma sessão ativa para esta conta. Faça logout primeiro.';
            //     await new Promise((resolve, reject) => {
            //         req.session.save((err) => {
            //             if (err) {
            //                 console.error('Erro ao salvar sessão de erro:', err.message);
            //                 reject(err);
            //             } else {
            //                 resolve();
            //             }
            //         });
            //     });
            //     return res.redirect('/login');
            // }

            // Deletar sessões antigas do mesmo userId
            try {
                const sessions = await store.sessionModel.findAll();
                let deletedCount = 0;
                for (const session of sessions) {
                    try {
                        const sessionData = JSON.parse(session.data);
                        console.log(`Analisando sessão: sid=${session.sid}, data=${JSON.stringify(sessionData)}`);

                        if (sessionData.userId && sessionData.userId.toString() === userId) {
                            const deleted = await store.sessionModel.destroy({ where: { sid: session.sid } });
                            deletedCount += deleted;
                            console.log(`Sessão antiga deletada: sid=${session.sid}, userId=${userId}, linhas afetadas=${deleted}`);
                        }
                    } catch (err) {
                        console.error(`Erro ao parsear sessão ${session.sid}:`, err.message);
                        // Deleta sessões com JSON inválido
                        const deleted = await store.sessionModel.destroy({ where: { sid: session.sid } });
                        deletedCount += deleted;
                        console.log(`Sessão com JSON inválido deletada: sid=${session.sid}, linhas afetadas=${deleted}`);
                    }
                }
                console.log(`Total de sessões antigas deletadas: ${deletedCount}`);
            } catch (err) {
                console.error('Erro ao deletar sessões antigas:', err.message);
                // Não bloqueia o login, mas loga o erro
            }

            // Criar nova sessão
            req.session.login = true;
            req.session.userId = userId;
            req.session.perfil = usuarioEncontrado.tipo_perfil;
            req.session.nomeUsuario = usuarioEncontrado.usuario;
            req.session.imagemPerfil = usuarioEncontrado.imagem_perfil;

            await new Promise((resolve, reject) => {
                req.session.save((err) => {
                    if (err) {
                        console.error('Erro ao salvar sessão:', err.message);
                        reject(err);
                    } else {
                        console.log(`Nova sessão criada: sid=${req.sessionID}, userId=${userId}`);
                        resolve();
                    }
                });
            });

            return res.redirect('/usuario/inicioLogado');
        } catch (error) {
            console.error('Erro no login:', error.message);
            req.session.errorMessage = error.message;
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
            return res.redirect('/login');
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
        console.log(`Iniciando logout para userId: ${userId}, sid: ${sessionID}`);

        try {
            // Deletar a sessão atual
            const deleted = await store.sessionModel.destroy({ where: { sid: sessionID } });
            console.log(`Sessão atual deletada: sid=${sessionID}, userId=${userId}, linhas afetadas=${deleted}`);

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
            return res.status(400).redirect('/cadastro');
        }
    }
}

exports.Auth = Auth;
