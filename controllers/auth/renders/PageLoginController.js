
exports.PageLoginController = async (req, res) => {
    let errorMessage = req.session.errorMessage;
    console.log(errorMessage);
    if (errorMessage === null) {
        errorMessage = " ";
    }
    req.session.errorMessage = null; // Limpa a mensagem de erro após exibi-la
    res.status(200).render('usuario/login', { errorMessage });
};
