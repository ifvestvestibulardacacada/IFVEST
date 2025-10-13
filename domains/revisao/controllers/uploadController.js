module.exports = {
    upload: async (req, res) => {
        // Salva os dados enviados na pasta "uploads" e retorna um JSON com o status e o link para o arquivo
        console.log("a requisiçao ta certa")
        try {
                // Verifica se uma imagem foi enviada
                if (!req.file) {
                    return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
                }

                const url = `/uploads/revisao/${req.file.filename}`;

                if (!url) {
                    return res.status(400).json({ message: 'Erro no upload do arquivo' });
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
    },
}