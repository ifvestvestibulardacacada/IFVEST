
exports.PageCadastroController = async (req, res) => {
    let errorMessage = req.session.errorMessage;
    console.log(errorMessage);
    if (errorMessage === null) {
        errorMessage = " ";
    }
    req.session.errorMessage = null;
    res.status(200).render('usuario/cadastro', { errorMessage });
};
