const { Simulado } = require('../../../../models');


module.exports = async (req, res) => {
            const { simuladoId } = req.params;
            const { titulo, descricao, tipo } = req.body;

            try {
                if (!titulo || !descricao || !tipo) {
                    throw new Error("Dados Invalidos !!! ")
                }

                const [updated] = await Simulado.update({
                    titulo: titulo,
                    descricao: descricao,
                    tipo: tipo
                }, {
                    where: {
                        id_simulado: simuladoId
                    }
                });

                if (!updated) {
                    throw new Error('Simulado não encontrado ou não atualizado');
                }
                res.redirect("/simulados/meus-simulados")
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