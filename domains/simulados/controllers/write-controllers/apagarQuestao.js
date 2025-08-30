const { Questao, Opcao } = require('../../../../models');

module.exports = async (req, res) => {
            try {
                const { id } = req.params;

                const questao = await Questao.findByPk(id);

                if (!questao) {
                    throw new Error("Questão nao encontrada");
                }

                await Opcao.destroy({
                    where: { id_questao: questao.id_questao }
                });

                await questao.destroy();

                res.status(200).redirect('/professor/questoes')
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