const { sequelize, Usuario, Questao, Opcao, Simulado, Resposta, Topico, Conteudo, TagConteudo, PalavraChave } = require('../models');
const { removeFileFromUploads } = require('../utils/removeImage')
const { atualizarRelacaoTopicos } = require('../utils/AreaTopicoUtil')
const bcrypt = require('bcrypt');
const { tr } = require('zod/v4/locales');

class Database {
    static questoes = {
       
        addImage: async (req, res) => { // ? Antigo uploads/editorImageUploadController.js
            try {
                // Verifica se uma imagem foi enviada
                if (!req.file) {
                    return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
                }

                const url = `/uploads/${req.file.filename}`;

                if (!url) {
                    return res.status(400).json({ message: 'Erro no upload da imagem' });
                }

                res.status(200).json(url);

            } catch (error) {

                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                return res.status(400).redirect(req.get("Referrer") || "/");
            }
        }
    }
   
    static usuarios = {
        changeImg: async (req, res) => { // ? Antigo uploads/profileImageUploadControllers.js
            try {
                // Verifica se uma imagem foi enviada
                if (!req.file) {
                    throw new Error('Nenhum arquivo enviado.');
                }

                const idUsuario = req.session.userId;
                const caminhoImagem = `/uploads/${req.file.filename}`;

                // Obtém o usuário atual
                const usuario = await Usuario.findByPk(idUsuario);

                // Remove a imagem antiga se existir
                if (usuario.imagem_perfil) {
                    removeFileFromUploads(usuario.imagem_perfil);
                }

                // Verifica se uma nova imagem foi recebida
                if (!caminhoImagem) {
                    throw new Error('Nenhum arquivo enviado.');
                }

                // Atualiza o banco de dados com a nova imagem
                await Usuario.update({ imagem_perfil: caminhoImagem }, { where: { id_usuario: idUsuario } });

                // Atualiza a sessão com a nova imagem
                req.session.imagemPerfil = caminhoImagem;

                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                // Redireciona para a página de perfil
                return res.status(200).redirect(`/usuario/perfil`);
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                return res.status(400).redirect(req.get("Referrer") || "/");
            }
        },
        delete: async (req, res) => {
            const id = req.session.userId;
            try {
                if (id != req.params.id) {
                    throw new Error("Erro ao excluir usuario")
                }

                await Usuario.destroy({
                    where: {
                        id_usuario: req.params.id
                    }
                }
                );
                req.session.destroy();
                res.status(200).redirect('/usuario/login');
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                return res.status(400).redirect(req.get("Referrer") || "/");
            }
        },
        edit: async (req, res) => {
            const id = req.session.userId;
            const idUsuarioParaEditar = Number(req.params.id);
            try {

                // Verifica se o usuário está tentando editar seu próprio perfil
                if (id !== idUsuarioParaEditar) {
                    req.session.destroy();
                    return res.redirect('/usuario/login');
                }

                const {  nome, usuario, email,  } = req.body;

                // Verifica se pelo menos um campo foi preenchido
                if (!nome && !usuario && !email ) {
                    throw new Error('Pelo menos um campo deve ser preenchido.');
                }

                // Objeto para armazenar os campos a serem atualizados
                const updateFields = {};

                // Flag para verificar se a senha foi alterada





                // Adiciona campos não vazios ao objeto de atualização
                if (nome) updateFields.nome = nome;
                if (usuario) updateFields.usuario = usuario;
                if (email) updateFields.email = email;

                // Realiza a atualização em uma única chamada se houver campos para atualizar
                if (Object.keys(updateFields).length > 0) {
                    await Usuario.update(updateFields, {
                        where: { id_usuario: idUsuarioParaEditar }
                    });

                    // Atualiza a sessão com os novos dados
                    if (nome) {
                        req.session.nomeUsuario = nome;
                    }
                    if (usuario) {
                        req.session.nomeUsuario = usuario;
                    }
                    // Força a sessão a salvar as alterações
                    await new Promise((resolve) => req.session.save(resolve));
                }

        
 

                res.status(200).redirect(`/usuario/perfil`);
            } catch (error) {
                console.error(error);
                req.session.errorMessage = error.message;
                await new Promise((resolve, reject) => {
                    req.session.save(err => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
                return res.status(400).redirect(req.get("Referrer") || "/");
            }
        }
    }

}

exports.Database = Database;


